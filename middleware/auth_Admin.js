const Users = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        //get user from req.user from auth midlleware
        const user = req.user

        //check user is admin or not 
        const checkUser = await Users.findOne({ _id: user.id })

        //check role of user above
        if (checkUser.role !== 1) {
            return res.status(400).json({ msg: "Admin resource." });
        }

        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = authAdmin