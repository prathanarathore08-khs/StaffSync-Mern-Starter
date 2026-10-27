const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/announcementController');

router.use(protect);
router.get('/', c.list);
router.post('/', authorize('hr'), c.create);
router.delete('/:id', authorize('hr'), c.remove);

module.exports = router;
