const Attendance = require('../models/Attendance');
const User = require('../models/User');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.checkIn = async (req, res) => {
  const date = startOfToday();
  const exists = await Attendance.findOne({ employee: req.user._id, date });
  if (exists) return res.status(400).json({ message: 'You have already checked in today' });
  const rec = await Attendance.create({ employee: req.user._id, date, checkIn: new Date(), status: 'present' });
  res.status(201).json(rec);
};

exports.checkOut = async (req, res) => {
  const rec = await Attendance.findOne({ employee: req.user._id, date: startOfToday() });
  if (!rec) return res.status(400).json({ message: 'Check in first' });
  if (rec.checkOut) return res.status(400).json({ message: 'You have already checked out today' });
  rec.checkOut = new Date();
  await rec.save();
  res.json(rec);
};

exports.mine = async (req, res) => {
  res.json(await Attendance.find({ employee: req.user._id }).sort('-date').limit(60));
};

// HR: everyone. Manager: own team.
exports.list = async (req, res) => {
  const filter = {};
  if (req.user.role === 'manager') {
    const team = await User.find({ manager: req.user._id }).select('_id');
    filter.employee = { $in: team.map((t) => t._id) };
  }
  if (req.query.date) {
    const d = new Date(req.query.date);
    d.setHours(0, 0, 0, 0);
    filter.date = d;
  }
  res.json(await Attendance.find(filter).populate('employee', 'name department').sort('-date').limit(200));
};
