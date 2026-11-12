import React from 'react';
import { Bell, CalendarDays, ChevronRight, Search } from 'lucide-react';

export default function Topbar({ breadcrumb, pageTitle, onNotify }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'short',
    day:     'numeric',
  });

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>{breadcrumb || pageTitle}</strong>
      </div>

      <div className="top-actions">
        <div className="search-box" role="search">
          <Search size={15} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </div>

        <button
          className="icon-button notification"
          aria-label="Notifications"
          onClick={() => onNotify?.("You're all caught up!")}
        >
          <Bell size={18} />
          <i />
        </button>

        <div className="top-divider" />

        <div className="date-chip">
          <CalendarDays size={15} />
          {today}
        </div>
      </div>
    </header>
  );
}
