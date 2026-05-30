const router  = require('express').Router();
const auth    = require('../controllers/auth.controller');
const { protect }      = require('../middleware/auth.middleware');
const { authLimiter }  = require('../middleware/rateLimit.middleware');

router.post('/register',        authLimiter, auth.register);
router.post('/login',           authLimiter, auth.login);
router.post('/google',          authLimiter, auth.googleLogin);
router.post('/forgot-password', authLimiter, auth.forgotPassword);
router.put('/reset-password/:token',         auth.resetPassword);

router.get('/me',               protect, auth.getMe);
router.put('/update-profile',   protect, auth.updateProfile);
router.put('/change-password',  protect, auth.changePassword);

module.exports = router;