import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function UserSignUp() {
  const { register } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    const res = await register(name, email, password, false);
    setLoading(false);
    if (res.success) {
      window.location.hash = '/dashboard';
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-mark">
            <Activity size={20} strokeWidth={2.8} />
          </div>
          <div className="auth-brand-name">route<span>pulse</span></div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join RoutePulse and start riding safely with your group.</p>
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
            <label className="form-label" htmlFor="name">Full name</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><User size={15} /></span>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Alex Morgan"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email address</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Mail size={15} /></span>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="signup-password"
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
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="confirm-password"
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

          <button
            type="submit"
            className="auth-submit"
            id="user-signup-btn"
            disabled={loading}
          >
            {loading
              ? <><div className="btn-spinner" /> Creating account…</>
              : <><UserPlus size={16} /> Create account</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <a onClick={() => { window.location.hash = '/signin'; }}>Sign in</a>
        </p>
        <p className="auth-alt-link">
          Admin?{' '}
          <a onClick={() => { window.location.hash = '/admin/signup'; }}>Register as admin →</a>
        </p>
      </div>
    </div>
  );
}
