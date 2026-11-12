import React, { useState } from 'react';
import { Activity, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSignUp() {
  const { register } = useAuth();
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm || !inviteCode) {
      setError('Please fill in all fields including the invite code.');
      return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    const res = await register(name, email, password, true, inviteCode);
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
          <ShieldCheck size={10} /> ADMIN REGISTRATION
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Register as admin</h1>
          <p>An admin invite code is required to create an administrator account.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error-box" role="alert">
            <Lock size={14} /> {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-reg-name">Full name</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><ShieldCheck size={15} /></span>
              <input
                id="admin-reg-name"
                type="text"
                className="form-input"
                placeholder="Admin name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-reg-email">Email address</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Mail size={15} /></span>
              <input
                id="admin-reg-email"
                type="email"
                className="form-input"
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-reg-password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="admin-reg-password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="form-input-toggle"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide' : 'Show'}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-reg-confirm">Confirm password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="admin-reg-confirm"
                type={showPw ? 'text' : 'password'}
                className={`form-input ${confirm && confirm !== password ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invite-code">Admin invite code</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><KeyRound size={15} /></span>
              <input
                id="invite-code"
                type="text"
                className="form-input"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <span className="invite-hint">Hint: default code is ADMIN2026 (change in constants.js)</span>
          </div>

          <button
            type="submit"
            className="auth-submit admin-submit"
            id="admin-signup-btn"
            disabled={loading}
          >
            {loading
              ? <><div className="btn-spinner" /> Creating admin account…</>
              : <><UserPlus size={16} /> Register as admin</>
            }
          </button>
        </form>

        <p className="auth-footer admin-footer">
          Already have an admin account?{' '}
          <a onClick={() => { window.location.hash = '/admin/signin'; }}>Admin sign in</a>
        </p>
        <p className="auth-alt-link">
          Regular user?{' '}
          <a onClick={() => { window.location.hash = '/signup'; }}>User sign up →</a>
        </p>
      </div>
    </div>
  );
}
