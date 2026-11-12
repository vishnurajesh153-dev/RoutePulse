import React from 'react';
import {
  Activity, ArrowRight, CalendarDays, ChevronDown, CircleHelp,
  Compass, Home, Navigation, Settings, ShieldCheck, MoreHorizontal,
  Users, BarChart3, LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

const USER_NAV = [
  { label: 'Overview',       icon: Home },
  { label: 'Plan a route',   icon: Compass },
  { label: 'Live tracking',  icon: Navigation },
  { label: 'Safety reports', icon: ShieldCheck },
  { label: 'Trip history',   icon: CalendarDays },
];

const ADMIN_NAV = [
  { label: 'Dashboard',   icon: BarChart3 },
  { label: 'All Users',   icon: Users },
  { label: 'Safety',      icon: ShieldCheck },
];

export default function Sidebar({ activeNav, setActiveNav, onNotify }) {
  const { user, role, logout } = useAuth();
  const isAdmin   = role === ROLES.ADMIN;
  const navItems  = isAdmin ? ADMIN_NAV : USER_NAV;
  const initials  = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  const handleNav = (label) => {
    setActiveNav(label);
    if (!isAdmin) {
      if (label === 'Plan a route') return;      // handled in Dashboard
      if (label !== 'Overview') onNotify?.(`${label} view is part of the prototype.`);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        <div className="brand-mark">
          <Activity size={22} strokeWidth={2.8} />
        </div>
        <div>
          <div className="brand-name">route<span>pulse</span></div>
          <div className="brand-tag">GROUP NAVIGATION</div>
        </div>
      </div>

      {/* Workspace / admin indicator */}
      {isAdmin && (
        <div className="sidebar-admin-badge">
          <ShieldCheck size={10} /> ADMIN PANEL
        </div>
      )}

      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-switch">
        <div className={`workspace-icon ${isAdmin ? 'admin-icon' : ''}`}>
          {isAdmin ? 'A' : 'S'}
        </div>
        <div className="ws-info">
          <strong>{isAdmin ? 'Admin Workspace' : 'Sunday Riders'}</strong>
          <small>{isAdmin ? 'Admin portal' : 'Group workspace'}</small>
        </div>
        <ChevronDown size={15} />
      </div>

      <div className="nav-label">MENU</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${activeNav === label ? (isAdmin ? 'admin-active' : 'active') : ''}`}
            onClick={() => handleNav(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Live tracking' && <i className="nav-live" />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {!isAdmin && (
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <strong>Need a hand?</strong>
            <p>Learn how RoutePulse keeps your group moving safely.</p>
            <button onClick={() => onNotify?.('Help centre will be connected soon.')}>
              Visit help centre <ArrowRight size={13} />
            </button>
          </div>
        )}

        <button
          className="nav-item settings"
          onClick={() => onNotify?.('Settings panel coming soon.')}
        >
          <Settings size={18} /><span>Settings</span>
        </button>

        {/* Logout */}
        <button className="nav-item" onClick={logout}>
          <LogOut size={18} /><span>Sign out</span>
        </button>

        <div className="profile-row">
          <div className={`profile-avatar ${isAdmin ? 'admin-avatar' : ''}`}>{initials}</div>
          <div className="pr-info">
            <strong>{user?.name || 'User'}</strong>
            <small>{isAdmin ? 'Administrator' : 'Member'}</small>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </div>
    </aside>
  );
}
