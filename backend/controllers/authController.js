const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const payload = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: sign(user._id), user: payload(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user._id).populate('manager', 'name');
  res.json(user);
};
