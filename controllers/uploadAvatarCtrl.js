const cloudinary = require('cloudinary')
const fs = require('fs')
const filterImage = require('../middleware/filterImage')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_SECRECT
})

const uploadAvataCtrl = {
    uploadAvatar: (req, res) => {
        try {
            //get file from req.files.file
            const file = req.files.file

            //upload tempFilePath up to cloudinary
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 200, height: 200, crop: 'fill'
            }, async (err, result) => {

                if (err) throw err;

                //delete file.tempFilePath after upload path image to cloudinary
                removeTmp(file.tempFilePath)

                //respone secure_url
                res.json({
                    url: result.secure_url,
                    msg: "Upload avatar successful."
                });
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = uploadAvataCtrl