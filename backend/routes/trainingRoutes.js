const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/trainingController');

router.use(protect);
router.get('/', c.list);
router.post('/', authorize('manager'), c.create);
router.delete('/:id', authorize('hr', 'manager'), c.remove);

module.exports = router;
