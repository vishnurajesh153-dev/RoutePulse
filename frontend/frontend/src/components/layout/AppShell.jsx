import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Shared layout shell used by both Dashboard and AdminDashboard.
 */
export default function AppShell({
  children,
  activeNav,
  setActiveNav,
  pageTitle,
  breadcrumb,
  onNotify,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onNotify={onNotify}
      />
      <main className="main-content">
        <Topbar
          pageTitle={pageTitle}
          breadcrumb={breadcrumb || pageTitle}
          onNotify={onNotify}
        />
        <div className="page-wrap">
          {children}
        </div>
      </main>
    </div>
  );
}
