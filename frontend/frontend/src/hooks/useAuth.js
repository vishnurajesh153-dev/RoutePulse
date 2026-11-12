import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication state and actions.
 *
 * Returns:
 *   user     — current user object (null if not logged in)
 *   role     — 'user' | 'admin' | null
 *   loading  — true while restoring session from localStorage
 *   login    — async (email, password, asAdmin?) => { success, error? }
 *   register — async (name, email, password, asAdmin?, inviteCode?) => { success, error? }
 *   logout   — () => void — clears session and redirects to /signin
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
