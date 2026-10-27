const User = require('../models/User');

// HR: all users
exports.getAll = async (req, res) => {
  const users = await User.find().populate('manager', 'name').sort('name');
  res.json(users);
};

// HR: create user (any role)
exports.create = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, phone, manager, joiningDate } = req.body;
    const user = await User.create({
      name, email, password, role, department, designation, phone,
      manager: manager || null,
      joiningDate: joiningDate || undefined,
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    const msg = err.code === 11000 ? 'Email already registered' : err.message;
    res.status(400).json({ message: msg });
  }
};

// HR: update user
exports.update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Employee not found' });
    const fields = ['name', 'email', 'role', 'department', 'designation', 'phone', 'joiningDate'];
    fields.forEach((f) => { if (req.body[f] !== undefined && req.body[f] !== '') user[f] = req.body[f]; });
    if (req.body.manager !== undefined) user.manager = req.body.manager || null;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ message: 'Employee updated' });
  } catch (err) {
    const msg = err.code === 11000 ? 'Email already registered' : err.message;
    res.status(400).json({ message: msg });
  }
};

// HR: delete user
exports.remove = async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Employee deleted' });
};

// Any user: update own profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, password } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (password) user.password = password;
    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Manager: own team. HR: everyone except HR.
exports.team = async (req, res) => {
  const filter = req.user.role === 'manager' ? { manager: req.user._id } : { role: { $ne: 'hr' } };
  res.json(await User.find(filter).select('name email department designation').sort('name'));
};
