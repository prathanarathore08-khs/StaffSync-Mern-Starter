import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { fmtDate } from '../utils';

const Pill = ({ s }) => <span className={`pill ${s}`}>{s}</span>;

export function MyLeaves() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ type: 'casual', fromDate: '', toDate: '', reason: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => { try { setList((await api.get('/leaves/my')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); } };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', form);
      setForm({ type: 'casual', fromDate: '', toDate: '', reason: '' });
      setMsg({ type: 'success', text: 'Leave request sent' });
      load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <>
      <h2 className="page-title">My leave</h2>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <form className="panel" onSubmit={submit}>
        <h5 className="mb-3">Apply for leave</h5>
        <div className="row g-3">
          <div className="col-md-3"><label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="casual">Casual</option><option value="sick">Sick</option><option value="earned">Earned</option>
            </select></div>
          <div className="col-md-3"><label className="form-label">From</label>
            <input type="date" className="form-control" required value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">To</label>
            <input type="date" className="form-control" required min={form.fromDate} value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} /></div>
          <div className="col-md-12"><label className="form-label">Reason</label>
            <textarea className="form-control" rows="2" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
        </div>
        <button className="btn btn-teal mt-3">Send request</button>
      </form>
      <div className="panel table-responsive">
        <h5 className="mb-3">History</h5>
        <table className="table mb-0">
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((l) => (
              <tr key={l._id}><td className="text-capitalize">{l.type}</td><td>{fmtDate(l.fromDate)}</td><td>{fmtDate(l.toDate)}</td><td>{l.reason || '-'}</td><td><Pill s={l.status} /></td></tr>
            ))}
            {list.length === 0 && <tr><td colSpan="5" className="muted text-center py-4">You have not applied for any leave yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function LeaveRequests() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => { try { setList((await api.get('/leaves')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); } };
  useEffect(() => { load(); }, []);

  const review = async (id, status) => {
    try { await api.put(`/leaves/${id}`, { status }); setMsg({ type: 'success', text: `Leave ${status}` }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const shown = list.filter((l) => filter === 'all' || l.status === filter);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center page-title">
        <h2 className="mb-0">{user.role === 'manager' ? 'Team leave requests' : 'Leave requests'}</h2>
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option><option value="approved">Approved</option>
          <option value="rejected">Rejected</option><option value="all">All</option>
        </select>
      </div>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <div className="panel table-responsive">
        <table className="table align-middle mb-0">
          <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l._id}>
                <td>{l.employee?.name}<div className="muted">{l.employee?.department}</div></td>
                <td className="text-capitalize">{l.type}</td><td>{fmtDate(l.fromDate)}</td><td>{fmtDate(l.toDate)}</td>
                <td>{l.reason || '-'}</td><td><Pill s={l.status} /></td>
                <td className="text-end text-nowrap">
                  {l.status === 'pending' && (<>
                    <button className="btn btn-sm btn-teal me-1" onClick={() => review(l._id, 'approved')}>Approve</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => review(l._id, 'rejected')}>Reject</button>
                  </>)}
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="7" className="muted text-center py-4">Nothing here. Requests will show up when people apply.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
