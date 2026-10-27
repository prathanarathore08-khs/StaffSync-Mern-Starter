import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { fmtDate, fmtTime } from '../utils';

export function MyAttendance() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => { try { setList((await api.get('/attendance/my')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); } };
  useEffect(() => { load(); }, []);

  const act = async (path, ok) => {
    try { await api.post(`/attendance/${path}`); setMsg({ type: 'success', text: ok }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const today = list.find((r) => new Date(r.date).toDateString() === new Date().toDateString());

  return (
    <>
      <h2 className="page-title">My attendance</h2>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <div className="panel d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h5 className="mb-1">Today, {fmtDate(new Date())}</h5>
          <div className="muted">
            {!today && 'You have not checked in yet.'}
            {today && !today.checkOut && `Checked in at ${fmtTime(today.checkIn)}.`}
            {today?.checkOut && `Checked in ${fmtTime(today.checkIn)}, checked out ${fmtTime(today.checkOut)}.`}
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-teal" disabled={!!today} onClick={() => act('checkin', 'Checked in')}>Check in</button>
          <button className="btn btn-outline-secondary" disabled={!today || !!today.checkOut} onClick={() => act('checkout', 'Checked out')}>Check out</button>
        </div>
      </div>
      <div className="panel table-responsive">
        <h5 className="mb-3">Recent days</h5>
        <table className="table mb-0">
          <thead><tr><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r._id}><td>{fmtDate(r.date)}</td><td>{fmtTime(r.checkIn)}</td><td>{fmtTime(r.checkOut)}</td><td><span className={`pill ${r.status}`}>{r.status}</span></td></tr>
            ))}
            {list.length === 0 && <tr><td colSpan="4" className="muted text-center py-4">No attendance recorded yet. Use Check in to start.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AttendanceReport() {
  const [list, setList] = useState([]);
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/attendance', { params: date ? { date } : {} })
      .then((r) => setList(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [date]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center page-title flex-wrap gap-2">
        <h2 className="mb-0">Attendance</h2>
        <div className="d-flex align-items-center gap-2">
          <label className="muted">Show one day</label>
          <input type="date" className="form-control w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
          {date && <button className="btn btn-outline-secondary" onClick={() => setDate('')}>Clear</button>}
        </div>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="panel table-responsive">
        <table className="table mb-0">
          <thead><tr><th>Employee</th><th>Date</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r._id}>
                <td>{r.employee?.name}<div className="muted">{r.employee?.department}</div></td>
                <td>{fmtDate(r.date)}</td><td>{fmtTime(r.checkIn)}</td><td>{fmtTime(r.checkOut)}</td>
                <td><span className={`pill ${r.status}`}>{r.status}</span></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="5" className="muted text-center py-4">No records for this selection.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
