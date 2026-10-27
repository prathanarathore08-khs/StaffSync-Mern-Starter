const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/employeeController');

router.use(protect);
router.put('/profile', c.updateProfile);
router.get('/team', authorize('hr', 'manager'), c.team);
router.route('/').get(authorize('hr'), c.getAll).post(authorize('hr'), c.create);
router.route('/:id').put(authorize('hr'), c.update).delete(authorize('hr'), c.remove);

module.exports = router;
