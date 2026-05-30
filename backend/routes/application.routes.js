const router = require('express').Router();
const app    = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/',     app.getAll);
router.post('/',    app.create);
router.put('/:id',  app.update);
router.delete('/:id', app.remove);

module.exports = router;