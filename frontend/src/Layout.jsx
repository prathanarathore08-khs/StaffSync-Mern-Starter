import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MENU = {
  hr: [
    ['/', 'Dashboard'], ['/employees', 'Employees'], ['/leave-requests', 'Leave requests'],
    ['/attendance-report', 'Attendance'], ['/announcements', 'Announcements'], ['/training', 'Training'], ['/profile', 'My profile'],
  ],
  manager: [
    ['/', 'Dashboard'], ['/leave-requests', 'Team leave requests'], ['/attendance-report', 'Team attendance'],
    ['/training', 'Training programs'], ['/my-leaves', 'My leave'], ['/my-attendance', 'My attendance'],
    ['/announcements', 'Announcements'], ['/profile', 'My profile'],
  ],
  employee: [
    ['/', 'Dashboard'], ['/my-leaves', 'My leave'], ['/my-attendance', 'My attendance'],
    ['/announcements', 'Announcements'], ['/training', 'My training'], ['/profile', 'My profile'],
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Staff<span>Sync</span></div>
        <nav className="nav flex-column">
          {MENU[user.role].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link">{label}</NavLink>
          ))}
        </nav>
        <div className="who">
          <strong>{user.name}</strong>
          <span className="text-capitalize">{user.role}</span>
          <div><button className="btn btn-sm btn-outline-light mt-2" onClick={logout}>Log out</button></div>
        </div>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}
