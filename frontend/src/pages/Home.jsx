import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { fmtDate } from '../utils';

const Stat = ({ num, label }) => (
  <div className="col-6 col-lg-3">
    <div className="stat"><div className="num">{num}</div><div className="lbl">{label}</div></div>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const ann = await api.get('/announcements');
        setNews(ann.data.slice(0, 3));
        if (user.role === 'hr') {
          const [emp, leaves, att] = await Promise.all([
            api.get('/employees'), api.get('/leaves'), api.get(`/attendance?date=${new Date().toISOString().slice(0, 10)}`),
          ]);
          setStats([
            [emp.data.length, 'People in company'],
            [leaves.data.filter((l) => l.status === 'pending').length, 'Leave requests waiting'],
            [att.data.length, 'Checked in today'],
          ]);
        } else if (user.role === 'manager') {
          const [team, leaves, tr] = await Promise.all([api.get('/employees/team'), api.get('/leaves'), api.get('/trainings')]);
          setStats([
            [team.data.length, 'People in your team'],
            [leaves.data.filter((l) => l.status === 'pending').length, 'Leave requests waiting'],
            [tr.data.length, 'Training programs'],
          ]);
        } else {
          const [leaves, att, tr] = await Promise.all([api.get('/leaves/my'), api.get('/attendance/my'), api.get('/trainings')]);
          setStats([
            [leaves.data.filter((l) => l.status === 'pending').length, 'Leave requests waiting'],
            [att.data.length, 'Days attended (last 60)'],
            [tr.data.length, 'Trainings assigned'],
          ]);
        }
      } catch { /* dashboard cards are optional */ }
    })();
  }, [user.role]);

  return (
    <>
      <h2 className="page-title">Welcome, {user.name.split(' ')[0]}</h2>
      <div className="row g-3 mb-4">
        {stats.map(([n, l]) => <Stat key={l} num={n} label={l} />)}
      </div>
      <div className="panel">
        <h5 className="mb-3">Latest announcements</h5>
        {news.length === 0 && <p className="muted mb-0">No announcements yet.</p>}
        {news.map((n) => (
          <div className="news" key={n._id}>
            <h6>{n.title}</h6>
            <div>{n.message}</div>
            <div className="muted">{fmtDate(n.createdAt)} by {n.postedBy?.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
