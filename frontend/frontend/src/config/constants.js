/**
 * RoutePulse — App-wide Constants
 */

export const APP_NAME    = 'RoutePulse';
export const APP_TAGLINE = 'Group Navigation';
export const APP_VERSION = '1.0.0';

// ── User roles ───────────────────────────────────────────────
export const ROLES = {
  USER:  'user',
  ADMIN: 'admin',
};

// ── Hash-based client routes ─────────────────────────────────
export const HASH_ROUTES = {
  ROOT:         '/',
  SIGNIN:       '/signin',
  SIGNUP:       '/signup',
  DASHBOARD:    '/dashboard',
  ADMIN_SIGNIN: '/admin/signin',
  ADMIN_SIGNUP: '/admin/signup',
  ADMIN:        '/admin',
};

/**
 * Admin invite code — required when registering an admin account.
 * Change this to a strong, secret value before going to production.
 * In production, generate this server-side and distribute it securely.
 */
export const ADMIN_INVITE_CODE = 'ADMIN2026';

// ── Feature flags ────────────────────────────────────────────
// Set to true once the relevant backend / API key is connected.
export const FEATURES = {
  liveTracking: false,
  weatherAPI:   false,
  realRoutes:   false,
  stravaSync:   false,
};

// ── Toast / notification duration (ms) ──────────────────────
export const TOAST_DURATION = 2800;
