const Training = require('../models/Training');

// HR: all. Manager: created by them. Employee: where they are a participant.
exports.list = async (req, res) => {
  let filter = {};
  if (req.user.role === 'manager') filter = { createdBy: req.user._id };
  if (req.user.role === 'employee') filter = { participants: req.user._id };
  const items = await Training.find(filter)
    .populate('createdBy', 'name')
    .populate('participants', 'name')
    .sort('-startDate');
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const { title, description, startDate, endDate, participants } = req.body;
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be on or after start date' });
    }
    const item = await Training.create({
      title, description, startDate, endDate,
      participants: participants || [],
      createdBy: req.user._id,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  const item = await Training.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Training not found' });
  if (req.user.role === 'manager' && String(item.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You can only delete your own programs' });
  }
  await item.deleteOne();
  res.json({ message: 'Training deleted' });
};
