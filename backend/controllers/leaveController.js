const Leave = require('../models/Leave');
const User = require('../models/User');

exports.apply = async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;
    if (!type || !fromDate || !toDate) return res.status(400).json({ message: 'Type and dates are required' });
    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({ message: 'End date must be on or after start date' });
    }
    const leave = await Leave.create({ employee: req.user._id, type, fromDate, toDate, reason });
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.myLeaves = async (req, res) => {
  res.json(await Leave.find({ employee: req.user._id }).sort('-createdAt'));
};

// HR: all leaves. Manager: leaves of own team.
exports.list = async (req, res) => {
  const filter = {};
  if (req.user.role === 'manager') {
    const team = await User.find({ manager: req.user._id }).select('_id');
    filter.employee = { $in: team.map((t) => t._id) };
  }
  const leaves = await Leave.find(filter)
    .populate('employee', 'name department')
    .populate('reviewedBy', 'name')
    .sort('-createdAt');
  res.json(leaves);
};

exports.review = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected' });
  }
  const leave = await Leave.findById(req.params.id).populate('employee', 'manager');
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  if (req.user.role === 'manager' && String(leave.employee.manager) !== String(req.user._id)) {
    return res.status(403).json({ message: 'This employee is not in your team' });
  }
  leave.status = status;
  leave.reviewedBy = req.user._id;
  await leave.save();
  res.json({ message: `Leave ${status}` });
};
