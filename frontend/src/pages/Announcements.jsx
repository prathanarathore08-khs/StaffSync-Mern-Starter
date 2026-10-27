import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { fmtDate } from '../utils';

export default function Announcements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => { try { setList((await api.get('/announcements')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); } };
  useEffect(() => { load(); }, []);

  const post = async (e) => {
    e.preventDefault();
    try { await api.post('/announcements', form); setForm({ title: '', message: '' }); setMsg({ type: 'success', text: 'Announcement posted' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await api.delete(`/announcements/${id}`); load(); } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <>
      <h2 className="page-title">Announcements</h2>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      {user.role === 'hr' && (
        <form className="panel" onSubmit={post}>
          <h5 className="mb-3">Post an announcement</h5>
          <input className="form-control mb-2" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="form-control mb-3" rows="3" placeholder="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-teal">Post announcement</button>
        </form>
      )}
      <div className="panel">
        {list.length === 0 && <p className="muted mb-0">No announcements yet.</p>}
        {list.map((n) => (
          <div className="news d-flex justify-content-between gap-3" key={n._id}>
            <div>
              <h6>{n.title}</h6>
              <div>{n.message}</div>
              <div className="muted">{fmtDate(n.createdAt)} by {n.postedBy?.name}</div>
            </div>
            {user.role === 'hr' && <button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => remove(n._id)}>Delete</button>}
          </div>
        ))}
      </div>
    </>
  );
}
