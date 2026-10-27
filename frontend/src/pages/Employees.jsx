import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { fmtDate, toInput } from '../utils';

const EMPTY = { name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '', manager: '', joiningDate: '' };

export default function Employees() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [q, setQ] = useState('');

  const load = async () => {
    try { setList((await api.get('/employees')).data); } catch (e) { setMsg({ type: 'danger', text: errMsg(e) }); }
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const managers = list.filter((u) => u.role === 'manager');

  const openNew = () => { setForm(EMPTY); setEditId(null); setShow(true); };
  const openEdit = (u) => {
    setForm({ ...EMPTY, ...u, password: '', manager: u.manager?._id || '', joiningDate: toInput(u.joiningDate) });
    setEditId(u._id);
    setShow(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/employees/${editId}`, form);
      else await api.post('/employees', form);
      setMsg({ type: 'success', text: editId ? 'Employee updated' : 'Employee added' });
      setShow(false);
      load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try { await api.delete(`/employees/${u._id}`); setMsg({ type: 'success', text: 'Employee deleted' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const shown = list.filter((u) => `${u.name} ${u.email} ${u.department}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center page-title flex-wrap gap-2">
        <h2 className="mb-0">Employees</h2>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search by name, email or department" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn-teal text-nowrap" onClick={openNew}>Add employee</button>
        </div>
      </div>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {show && (
        <form className="panel" onSubmit={save}>
          <h5 className="mb-3">{editId ? 'Edit employee' : 'Add employee'}</h5>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Full name</label><input className="form-control" required value={form.name} onChange={set('name')} /></div>
            <div className="col-md-4"><label className="form-label">Email</label><input type="email" className="form-control" required value={form.email} onChange={set('email')} /></div>
            <div className="col-md-4"><label className="form-label">{editId ? 'New password (optional)' : 'Password'}</label>
              <input type="password" minLength={6} className="form-control" required={!editId} value={form.password} onChange={set('password')} /></div>
            <div className="col-md-3"><label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="employee">Employee</option><option value="manager">Manager</option><option value="hr">HR</option>
              </select></div>
            <div className="col-md-3"><label className="form-label">Department</label><input className="form-control" value={form.department} onChange={set('department')} /></div>
            <div className="col-md-3"><label className="form-label">Designation</label><input className="form-control" value={form.designation} onChange={set('designation')} /></div>
            <div className="col-md-3"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={set('phone')} /></div>
            <div className="col-md-4"><label className="form-label">Reports to</label>
              <select className="form-select" value={form.manager} onChange={set('manager')}>
                <option value="">No manager</option>
                {managers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select></div>
            <div className="col-md-4"><label className="form-label">Joining date</label><input type="date" className="form-control" value={form.joiningDate} onChange={set('joiningDate')} /></div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-teal">Save employee</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="panel table-responsive">
        <table className="table align-middle mb-0">
          <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Designation</th><th>Reports to</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u._id}>
                <td>{u.name}<div className="muted">{u.email}</div></td>
                <td className="text-capitalize">{u.role}</td>
                <td>{u.department || '-'}</td>
                <td>{u.designation || '-'}</td>
                <td>{u.manager?.name || '-'}</td>
                <td>{fmtDate(u.joiningDate)}</td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEdit(u)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u)}>Delete</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="7" className="muted text-center py-4">No employees found. Use Add employee to create the first one.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
