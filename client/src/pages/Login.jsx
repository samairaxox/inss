import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Message from '../components/Message.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/login', form);
      login(data.user);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card narrow">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </div>
        <Message type="error">{error}</Message>
        <button id="login-submit" className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="muted">Demo: admin1@test.com / admin123 &nbsp;|&nbsp; user1@test.com / user123</p>
    </section>
  );
}
