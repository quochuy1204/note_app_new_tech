const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACTIVATION_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL } = process.env
const sendMail = require('./sendMail');
const { google } = require('googleapis')
const { OAuth2 } = google.auth

const fetch = require('node-fetch')

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const userCtrl = {
    register: async (req, res) => {
        try {

            const { name, email, password } = req.body;

            //check if user fill all fields or not
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Please fill in all fields." });
            }

            //check valid email
            if (!validateEmail(email)) {
                return res.status(400).json({ msg: "Invalid email address." });
            }

            //check email available or not 
            const user = await Users.findOne({ email })
            if (user) {
                return res.status(400).json({ msg: "Email already exist." });
            }

            //check lenght of password
            if (password.length < 8) {
                return res.status(400).json({ msg: "Password must be at least 8 characters." });
            }

            //encrypt password
            const passwordHash = await bcrypt.hash(password, 12);

            //assign newUser with hash password
            const newUser = {
                name, email, password: passwordHash
            }

            //generate activationToken for new user
            const activationToken = await createActivationToken(newUser)

            //send this url with an email 
            const url = `${CLIENT_URL}/user/activate/${activationToken}`;

            //send mail to active email
            sendMail(email, url, "Verify your email");

            res.json({ msg: "Register successed. Please verify your email." });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //function to activation email
    activationEmail: async (req, res) => {
        try {
            //get activation_token from request body
            const { activation_token } = req.body

            //using jsonwebtoken to verify the activation token
            const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET)

            //assign name, email, password = user if the activation token is verified
            const { name, email, password } = user;

            //check if email exist or not 
            const check = await Users.findOne({ email });

            //if email already exist return status 400 and error message
            if (check) {
                return res.status(400).json({ msg: "This email is already exist. Please sign up with another email address." });
            }

            //if email not exist, assign new User
            const newUser = new Users({
                name, email, password
            })

            //save new User to mongoDB
            await newUser.save();

            //res successed 
            res.json({ msg: "Your account has been activated." });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //function login
    login: async (req, res) => {
        try {
            //get email and password from request body
            const { email, password } = req.body

            //check email exist or not
            const user = await Users.findOne({ email })

            if (!user) {
                return res.status(400).json({ msg: "Email is not exist." });
            }

            //check password correct or not
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Password is incorrect." });
            }

            //generate refresh token with user._id
            const refresh_token = await createRefreshToken({ id: user._id })

            //store refresh token into cookie 
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: "/users/refresh_token",
                maxAge: 7 * 24 * 60 * 60 * 1000 // equal to 7 days 
            })

            res.json({ msg: "Login successed." })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to get access token 
    getAccessToken: (req, res) => {
        try {
            //get refresh token in request cookies 
            const ref_token = req.cookies.refreshtoken

            //check refresh token exist or not 
            if (!ref_token) {
                return res.status(400).json({ msg: "Refresh token does not exist. Please login now." });
            }

            //verifying the refresh token
            jwt.verify(ref_token, REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.json(400).json({ msg: "Refresh token is incorrect. Please login again." });
                }

                //if refresh token correct - generate access token with user._id
                const access_Token = createAccessToken({ id: user.id })

                //response access token
                res.json({ access_Token });
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to generate new access token and send the forgot password mail with url 
    forgotPassword: async (req, res) => {
        try {
            //get email address from req.body
            const { email } = req.body

            //check email exist or not
            const user = await Users.findOne({ email })
            if (!user) {
                return res.status(400).json({ msg: "Email is not exist." });
            }

            //generate new access token
            const access_token = createAccessToken({ id: user._id })

            //assign url
            const url = `${CLIENT_URL}/users/reset/${access_token}`

            //send the reset password mail to user
            sendMail(email, url, "Reset your password")

            res.json({ msg: "Re-send the password. Please check your email." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to reset password
    resetPassword: async (req, res) => {
        try {
            //get password from req.body
            const { password } = req.body

            //check password exist or not 
            if (!password) {
                return res.status(400).json({ msg: "Please enter your new password." });
            }

            //encrypt password to passwordHash
            const passwordHash = await bcrypt.hash(password, 12)

            const user = req.user

            //find the user with _id and update the password
            await Users.findByIdAndUpdate({ _id: user.id }, {
                password: passwordHash
            })
            res.json({ msg: "Reset your password successful. Please sign in again." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to get information about user by user id or user access token 
    getUserInfor: async (req, res) => {
        try {
            //get user information by user id or user token 
            const user = await Users.findById({ _id: req.user.id }).select("-password")

            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to get all information of all users
    getUsersAllInfor: async (req, res) => {
        try {
            //find all information of all user in mongoDb
            const users = await Users.find().select("-password")

            //response users
            res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //function to loggout 
    logout: (req, res) => {
        try {
            //clear cookie in client browser
            res.clearCookie('refreshtoken', {
                path: '/users/refresh_token'
            })

            return res.json({ msg: "Logged out." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to update user 
    updateUserInfor: async (req, res) => {
        try {
            //get name and avartar from request body
            const { name, avatar } = req.body

            //find user by id and update
            await Users.findByIdAndUpdate({ _id: req.user.id }, {
                name,
                avatar
            })

            res.json({ msg: "Updated." })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to update role for user (admin)
    updateUserRole: async (req, res) => {
        try {
            //get role from res.body
            const { role } = req.body

            //find user by id from params
            await Users.findByIdAndUpdate({ _id: req.params.id }, {
                role
            })

            res.json({ msg: "Updated" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    //function to delete user
    deleteUser: async (req, res) => {
        try {
            //find user by id in params and delete it
            await Users.findByIdAndDelete({ _id: req.params.id })

            res.json({ msg: "Deleted." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body

            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

            const { email_verified, email, name, picture } = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/users/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/users/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    facebookLogin: async (req, res) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL).then(res => res.json()).then(res => { return res })

            const { email, name, picture } = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/users/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/userss/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

//function to check valid email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//function to generate activation token
const createActivationToken = (payload) => {
    return jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: "5m" });
}

// //function to generate access token 
const createAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

//function to generate refresh token 
const createRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

module.exports = userCtrl