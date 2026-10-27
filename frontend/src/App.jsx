import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Employees from './pages/Employees';
import { MyLeaves, LeaveRequests } from './pages/Leaves';
import { MyAttendance, AttendanceReport } from './pages/Attendance';
import Announcements from './pages/Announcements';
import Training from './pages/Training';
import Profile from './pages/Profile';

function Guard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Guard><Layout /></Guard>}>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<Guard roles={['hr']}><Employees /></Guard>} />
        <Route path="/leave-requests" element={<Guard roles={['hr', 'manager']}><LeaveRequests /></Guard>} />
        <Route path="/attendance-report" element={<Guard roles={['hr', 'manager']}><AttendanceReport /></Guard>} />
        <Route path="/my-leaves" element={<Guard roles={['employee', 'manager']}><MyLeaves /></Guard>} />
        <Route path="/my-attendance" element={<Guard roles={['employee', 'manager']}><MyAttendance /></Guard>} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/training" element={<Training />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
