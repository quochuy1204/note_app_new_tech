const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        //get token from req.header
        const token = req.header("Authorization")

        //check token exist or not 
        if (!token) {
            return res.status(400).json({ msg: "Access token is not available." });
        }

        //verify token with jwt.verify function
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ msg: "Invalid token." });
            }

            //if token verified, assign req.user equal to user
            req.user = user;

            next();
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = auth