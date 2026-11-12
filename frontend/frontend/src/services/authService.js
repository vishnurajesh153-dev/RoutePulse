import { ROLES, ADMIN_INVITE_CODE } from '../config/constants';

// ─── Storage keys ──────────────────────────────────────────────
const USERS_KEY = 'rp_users_v1';

// ─── Helpers ───────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Minimal demo hashing — replace with bcrypt/Argon2 on a real server */
function hashPw(pw) {
  return btoa(encodeURIComponent(pw + '__rp_salt__'));
}

function stripPw({ password: _, ...u }) { return u; }

/** Fake network delay so loading states look realistic */
const delay = (ms = 650) => new Promise(r => setTimeout(r, ms));

// ─── Seed default admin on first load ─────────────────────────
(function seedAdmin() {
  const users = getUsers();
  if (!users.some(u => u.role === ROLES.ADMIN)) {
    users.push({
      id:       'admin-seed-001',
      name:     'Super Admin',
      email:    'admin@routepulse.app',
      password: hashPw('Admin@2026'),
      role:     ROLES.ADMIN,
      status:   'active',
      joinedAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
})();

// ─── Auth Service ──────────────────────────────────────────────
export const authService = {
  /**
   * Log in with email + password.
   * @param {string}  email
   * @param {string}  password
   * @param {boolean} asAdmin  — enforces admin role check when true
   */
  async login(email, password, asAdmin = false) {
    await delay();
    const users = getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user)
      return { success: false, error: 'No account found with this email.' };
    if (user.password !== hashPw(password))
      return { success: false, error: 'Incorrect password.' };
    if (user.status === 'inactive')
      return { success: false, error: 'Your account has been deactivated. Contact support.' };
    if (asAdmin && user.role !== ROLES.ADMIN)
      return { success: false, error: 'This account does not have admin privileges.' };

    return { success: true, user: stripPw(user), role: user.role };
  },

  /**
   * Register a new account.
   * @param {string}  name
   * @param {string}  email
   * @param {string}  password
   * @param {boolean} asAdmin
   * @param {string}  inviteCode — required when asAdmin is true
   */
  async register(name, email, password, asAdmin = false, inviteCode = '') {
    await delay();

    if (asAdmin && inviteCode !== ADMIN_INVITE_CODE)
      return { success: false, error: 'Invalid admin invite code. Contact your administrator.' };

    const users = getUsers();

    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase()))
      return { success: false, error: 'An account with this email already exists.' };

    if (password.length < 8)
      return { success: false, error: 'Password must be at least 8 characters.' };

    const newUser = {
      id:       `usr-${Date.now()}`,
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password: hashPw(password),
      role:     asAdmin ? ROLES.ADMIN : ROLES.USER,
      status:   'active',
      joinedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, user: stripPw(newUser), role: newUser.role };
  },

  // ── Admin-only user management ─────────────────────────────

  /** Returns all users, passwords stripped */
  getAllUsers() {
    return getUsers().map(stripPw);
  },

  /** Update a user's fields (role, status, name, etc.) */
  updateUser(id, updates) {
    const users = getUsers();
    const idx   = users.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, error: 'User not found.' };
    // Never allow password updates via this method
    const { password: _, ...safeUpdates } = updates;
    users[idx] = { ...users[idx], ...safeUpdates };
    saveUsers(users);
    return { success: true, user: stripPw(users[idx]) };
  },

  /** Hard-delete a user record */
  deleteUser(id) {
    const users   = getUsers();
    const updated = users.filter(u => u.id !== id);
    if (updated.length === users.length) return { success: false, error: 'User not found.' };
    saveUsers(updated);
    return { success: true };
  },
};
