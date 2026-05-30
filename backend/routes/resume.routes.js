const router  = require('express').Router();
const resume  = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');

// Public
router.get('/public/:slug', resume.getPublicResume);

// Protected
router.use(protect);
router.get('/',                    resume.getAllResumes);
router.post('/',                   resume.createResume);
router.get('/:id',                 resume.getResume);
router.put('/:id',                 resume.updateResume);
router.delete('/:id',              resume.deleteResume);
router.post('/:id/duplicate',      resume.duplicateResume);
router.post('/:id/share',          resume.generateShareLink);

module.exports = router;