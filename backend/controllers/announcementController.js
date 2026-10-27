const Announcement = require('../models/Announcement');

exports.list = async (req, res) => {
  res.json(await Announcement.find().populate('postedBy', 'name').sort('-createdAt'));
};

exports.create = async (req, res) => {
  try {
    const { title, message } = req.body;
    const item = await Announcement.create({ title, message, postedBy: req.user._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  const item = await Announcement.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found' });
  res.json({ message: 'Announcement deleted' });
};
