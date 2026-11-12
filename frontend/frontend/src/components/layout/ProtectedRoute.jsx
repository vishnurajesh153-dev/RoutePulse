import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

/**
 * Route guard — redirects unauthenticated users or non-admin users.
 * @prop {boolean} requireAdmin  — if true, only ADMIN role is allowed
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    window.location.hash = requireAdmin ? '/admin/signin' : '/signin';
    return null;
  }

  if (requireAdmin && role !== ROLES.ADMIN) {
    window.location.hash = '/dashboard';
    return null;
  }

  return children;
}
