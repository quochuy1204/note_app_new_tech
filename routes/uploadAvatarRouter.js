const express = require('express');
const router = express.Router();
const UploadImageCtrl = require('../controllers/uploadAvatarCtrl')
const filterImage = require('../middleware/filterImage')
const auth = require('../middleware/auth')

router.post('/upload_avatar', filterImage, UploadImageCtrl.uploadAvatar);

module.exports = router