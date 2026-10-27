// Run once:  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (await User.findOne({ email: 'hr@staffsync.com' })) {
    console.log('Demo users already exist');
    return process.exit(0);
  }
  await User.create({ name: 'Hina Rao', email: 'hr@staffsync.com', password: 'hr12345', role: 'hr',
    department: 'Human Resources', designation: 'HR Manager' });
  const manager = await User.create({ name: 'Manav Sharma', email: 'manager@staffsync.com', password: 'manager123',
    role: 'manager', department: 'Engineering', designation: 'Team Lead' });
  await User.create({ name: 'Esha Verma', email: 'employee@staffsync.com', password: 'employee123',
    role: 'employee', department: 'Engineering', designation: 'Developer', manager: manager._id });
  console.log('Demo users created:');
  console.log('  HR       hr@staffsync.com        / hr12345');
  console.log('  Manager  manager@staffsync.com   / manager123');
  console.log('  Employee employee@staffsync.com  / employee123');
  process.exit(0);
})();
