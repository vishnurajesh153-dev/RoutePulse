import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function UserSignIn() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const res = await login(email, password, false);
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
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue riding with your group.</p>
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
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Mail size={15} /></span>
              <input
                id="email"
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
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-wrap">
              <span className="form-input-icon"><Lock size={15} /></span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Your password"
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
            className="auth-submit"
            id="user-signin-btn"
            disabled={loading}
          >
            {loading
              ? <><div className="btn-spinner" /> Signing in…</>
              : <><LogIn size={16} /> Sign in</>
            }
          </button>
        </form>

        {/* Footer links */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <a onClick={() => { window.location.hash = '/signup'; }}>Create one</a>
        </p>
        <p className="auth-alt-link">
          Are you an admin?{' '}
          <a onClick={() => { window.location.hash = '/admin/signin'; }}>Admin sign in →</a>
        </p>
      </div>
    </div>
  );
}
