const router    = require('express').Router();
const dashboard = require('../controllers/dashboard.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/stats',  dashboard.getUserStats);
router.get('/admin',  adminOnly, dashboard.getAdminStats);

module.exports = router;