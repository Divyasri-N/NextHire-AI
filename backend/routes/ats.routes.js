const router  = require('express').Router();
const ats     = require('../controllers/ats.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/score',              ats.scoreResume);
router.post('/score-raw',          ats.scoreRaw);
router.get('/keywords',            ats.getKeywordBank);
router.get('/history/:resumeId',   ats.getATSHistory);

module.exports = router;