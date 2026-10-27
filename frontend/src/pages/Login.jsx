import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <section className="login-art">
        <h1>Every leave, check-in and notice in one place.</h1>
        <p>StaffSync keeps HR, managers and employees on the same page.</p>
      </section>
      <section className="login-form">
        <form onSubmit={submit}>
          <h3 className="mb-3">Sign in</h3>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <label className="form-label">Email</label>
          <input type="email" className="form-control mb-3" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="form-label">Password</label>
          <input type="password" className="form-control mb-3" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-teal w-100" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
          <p className="muted mt-3 mb-0">Accounts are created by HR. Ask HR if you cannot sign in.</p>
        </form>
      </section>
    </div>
  );
}
