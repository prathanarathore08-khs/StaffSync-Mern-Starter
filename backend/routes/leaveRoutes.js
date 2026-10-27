const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/leaveController');

router.use(protect);
router.post('/', authorize('employee', 'manager'), c.apply);
router.get('/my', c.myLeaves);
router.get('/', authorize('hr', 'manager'), c.list);
router.put('/:id', authorize('hr', 'manager'), c.review);

module.exports = router;
