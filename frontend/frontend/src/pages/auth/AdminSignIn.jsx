import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSignIn() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('admin@routepulse.app');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const res = await login(email, password, true); // asAdmin = true
    setLoading(false);
    if (res.success) {
      window.location.hash = '/admin';
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card admin-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-mark admin-mark">
            <Activity size={20} strokeWidth={2.8} />
          </div>
          <div className="auth-brand-name">route<span>pulse</span></div>
        </div>

        {/* Admin badge */}
        <div className="admin-badge">
          <ShieldCheck size={10} /> ADMIN PORTAL
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Admin sign in</h1>
          <p>Access the administration panel. Admin credentials required.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error-box" role="alert">
            <Lock size={14} /> {error}
          </div>
        )}

        {/* Hint */}
        <div className="auth-error-box" style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.2)', color: '#c4b5fd', marginBottom: 4 }}>
          <ShieldCheck size={14} />
          <span>Default: <strong>admin@routepulse.app</strong> / <strong>Admin@2026</strong></span>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin email</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Mail size={15} /></span>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="admin@routepulse.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit admin-submit"
            id="admin-signin-btn"
            disabled={loading}
          >
            {loading
              ? <><div className="btn-spinner" /> Signing in…</>
              : <><LogIn size={16} /> Sign in as admin</>
            }
          </button>
        </form>

        <p className="auth-footer admin-footer">
          Not an admin?{' '}
          <a onClick={() => { window.location.hash = '/signin'; }}>User sign in</a>
        </p>
        <p className="auth-alt-link">
          Need an admin account?{' '}
          <a onClick={() => { window.location.hash = '/admin/signup'; }}>Register as admin →</a>
        </p>
      </div>
    </div>
  );
}
