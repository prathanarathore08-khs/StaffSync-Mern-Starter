const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/attendanceController');

router.use(protect);
router.post('/checkin', authorize('employee', 'manager'), c.checkIn);
router.post('/checkout', authorize('employee', 'manager'), c.checkOut);
router.get('/my', c.mine);
router.get('/', authorize('hr', 'manager'), c.list);

module.exports = router;
