const fs = require('fs');

const filterImage = async (req, res, next) => {
    try {
        //check file exist or not 
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No flies uploaded." });
        }

        //get file from req.files.file
        const file = req.files.file

        //check file size 
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Your image is too large. Please choose another image equal or smaller 1Mb." });
        }

        //check file type 
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            return res.status(400).json({ msg: "Invalid image type. Please choose png or jpeg image." });
        }
        console.log("Image valid.")

        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = filterImage