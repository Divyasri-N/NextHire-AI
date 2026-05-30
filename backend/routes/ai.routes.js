const router  = require('express').Router();
const ai      = require('../controllers/ai.controller');
const { protect }   = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimit.middleware');

router.use(protect, aiLimiter);

router.post('/generate',            ai.generate);   
router.post('/summary',             ai.generateSummary);
router.post('/skills',              ai.suggestSkills);
router.post('/project-description', ai.generateProjectDescription);
router.post('/enhance',             ai.enhanceBullet);
router.post('/cover-letter',        ai.generateCoverLetter);

module.exports = router;