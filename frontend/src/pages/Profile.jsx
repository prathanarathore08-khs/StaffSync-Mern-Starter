import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { fmtDate } from '../utils';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setMe(data);
      setForm({ name: data.name, phone: data.phone || '', password: '' });
    } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/employees/profile', form);
      setMsg({ type: 'success', text: 'Profile saved' });
      const stored = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...stored, name: form.name }));
      load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  if (!me) return <p className="muted">Loading profile...</p>;

  return (
    <>
      <h2 className="page-title">My profile</h2>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <div className="row g-3">
        <div className="col-lg-5">
          <div className="panel h-100 mb-0">
            <h5 className="mb-3">Work details</h5>
            <dl className="row mb-0">
              <dt className="col-5">Email</dt><dd className="col-7">{me.email}</dd>
              <dt className="col-5">Role</dt><dd className="col-7 text-capitalize">{me.role}</dd>
              <dt className="col-5">Department</dt><dd className="col-7">{me.department || '-'}</dd>
              <dt className="col-5">Designation</dt><dd className="col-7">{me.designation || '-'}</dd>
              <dt className="col-5">Reports to</dt><dd className="col-7">{me.manager?.name || '-'}</dd>
              <dt className="col-5">Joined</dt><dd className="col-7">{fmtDate(me.joiningDate)}</dd>
            </dl>
          </div>
        </div>
        <div className="col-lg-7">
          <form className="panel h-100 mb-0" onSubmit={save}>
            <h5 className="mb-3">Edit my details</h5>
            <label className="form-label">Full name</label>
            <input className="form-control mb-3" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="form-label">Phone</label>
            <input className="form-control mb-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <label className="form-label">New password (leave blank to keep current)</label>
            <input type="password" minLength={6} className="form-control mb-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn btn-teal">Save changes</button>
          </form>
        </div>
      </div>
    </>
  );
}
