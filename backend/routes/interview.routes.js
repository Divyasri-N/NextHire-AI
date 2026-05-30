const router    = require('express').Router();
const interview = require('../controllers/interview.controller');
const { protect }   = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimit.middleware');

router.use(protect, aiLimiter);

router.post('/questions',  interview.generateQuestions);
router.post('/all',        interview.generateAllQuestions);

module.exports = router;