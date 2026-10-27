import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import { fmtDate } from '../utils';

const EMPTY = { title: '', description: '', startDate: '', endDate: '', participants: [] };

export default function Training() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => { try { setList((await api.get('/trainings')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); } };
  useEffect(() => {
    load();
    if (user.role === 'manager') api.get('/employees/team').then((r) => setTeam(r.data)).catch(() => {});
  }, [user.role]);

  const toggle = (id) =>
    setForm((f) => ({ ...f, participants: f.participants.includes(id) ? f.participants.filter((p) => p !== id) : [...f.participants, id] }));

  const create = async (e) => {
    e.preventDefault();
    try { await api.post('/trainings', form); setForm(EMPTY); setMsg({ type: 'success', text: 'Training program created' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try { await api.delete(`/trainings/${id}`); load(); } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <>
      <h2 className="page-title">{user.role === 'employee' ? 'My training' : 'Training programs'}</h2>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {user.role === 'manager' && (
        <form className="panel" onSubmit={create}>
          <h5 className="mb-3">Create a training program</h5>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Title</label>
              <input className="form-control" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Starts</label>
              <input type="date" className="form-control" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Ends</label>
              <input type="date" className="form-control" required min={form.startDate} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            <div className="col-12"><label className="form-label">Description</label>
              <textarea className="form-control" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="col-12">
              <label className="form-label">Participants</label>
              {team.length === 0 && <div className="muted">No one reports to you yet. HR can assign people to you from the Employees page.</div>}
              <div className="d-flex flex-wrap gap-3">
                {team.map((t) => (
                  <div className="form-check" key={t._id}>
                    <input className="form-check-input" type="checkbox" id={t._id} checked={form.participants.includes(t._id)} onChange={() => toggle(t._id)} />
                    <label className="form-check-label" htmlFor={t._id}>{t.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="btn btn-teal mt-3">Create program</button>
        </form>
      )}

      <div className="row g-3">
        {list.map((t) => (
          <div className="col-md-6" key={t._id}>
            <div className="panel h-100 mb-0">
              <div className="d-flex justify-content-between gap-2">
                <h5>{t.title}</h5>
                {user.role !== 'employee' && <button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => remove(t._id)}>Delete</button>}
              </div>
              <div className="muted mb-2">{fmtDate(t.startDate)} to {fmtDate(t.endDate)}, led by {t.createdBy?.name}</div>
              <p>{t.description || 'No description added.'}</p>
              <div className="muted">Participants: {t.participants?.length ? t.participants.map((p) => p.name).join(', ') : 'none yet'}</div>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="col-12"><div className="panel muted mb-0">
          {user.role === 'employee' ? 'No training has been assigned to you yet.' : 'No training programs yet.'}</div></div>}
      </div>
    </>
  );
}
