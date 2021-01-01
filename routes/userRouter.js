const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/auth_Admin')

const userCtrl = require('../controllers/userCtrl');

router.post('/register', userCtrl.register);

router.post('/activation', userCtrl.activationEmail);

router.post('/login', userCtrl.login);

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot_password', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)

router.get('/infor', auth, userCtrl.getUserInfor)

router.get('/all_infor', auth, authAdmin, userCtrl.getUsersAllInfor)

router.get('/logout', userCtrl.logout)

router.patch('/update', auth, userCtrl.updateUserInfor)

router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUserRole)

router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)


// Social Login
router.post('/google_login', userCtrl.googleLogin)

router.post('/facebook_login', userCtrl.facebookLogin)

module.exports = router;