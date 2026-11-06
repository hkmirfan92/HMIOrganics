import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PERSONAL_CARE_PRODUCTS, HOME_CARE_PRODUCTS, BRAND_INFO } from './src/data/products.ts';
import { DEFAULT_PAGES_CONTENT } from './src/data/pagesContent.ts';
import { DEFAULT_SEO_SETTINGS, DEFAULT_ANALYTICS_SETTINGS, DEFAULT_ANALYTICS_SUMMARY } from './src/data/seoContent.ts';

const app = express();

function getPort(): number {
  // In production (Cloud Run deployment), always honor process.env.PORT (typically 8080)
  if (process.env.NODE_ENV === 'production') {
    const prodPort = parseInt(process.env.PORT || '8080', 10);
    if (!isNaN(prodPort) && prodPort > 0) return prodPort;
    return 8080;
  }

  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    const parsed = parseInt(process.argv[portIndex + 1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // In the dev container sandbox, ambient PORT=8080 is reserved for internal proxy.
  // The dev server must run on port 3000.
  if (process.env.PORT && process.env.PORT !== '8080') {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 3000;
}

const PORT = getPort();

// Enforce request body limits (allowing high-res image uploads up to 25mb)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Basic Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const SEO_FILE = path.join(DATA_DIR, 'seo.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');



// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const INITIAL_PRODUCTS = [...PERSONAL_CARE_PRODUCTS, ...HOME_CARE_PRODUCTS];
const INITIAL_SETTINGS = {
  ...BRAND_INFO,
  topBannerNotice: '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan',
};

// ==========================================
// CRYPTOGRAPHIC PASSWORD HASHING
// ==========================================
function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, chosenSalt, 64);
  return {
    salt: chosenSalt,
    hash: derivedKey.toString('hex'),
  };
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (keyBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// Securely initialize or upgrade Auth storage
interface StoredUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'product_manager';
  salt: string;
  hash: string;
  createdAt: number;
}

interface AuthStore {
  users: StoredUser[];
}

function readAuth(): AuthStore {
  try {
    if (!fs.existsSync(AUTH_FILE)) {
      const defaultHash = hashPassword('admin123');
      const initial: AuthStore = {
        users: [
          {
            id: 'super-admin-root',
            username: 'admin@hmiorganics.com',
            name: 'Main Super Admin',
            role: 'super_admin',
            salt: defaultHash.salt,
            hash: defaultHash.hash,
            createdAt: Date.now(),
          },
        ],
      };
      fs.writeFileSync(AUTH_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    if (Array.isArray(data.users)) {
      return data;
    }

    // Auto-upgrade single-user format to multi-role users array
    const salt = data.salt || hashPassword('admin123').salt;
    const hash = data.hash || hashPassword('admin123').hash;
    const migrated: AuthStore = {
      users: [
        {
          id: 'super-admin-root',
          username: data.username || 'admin@hmiorganics.com',
          name: 'Main Super Admin',
          role: 'super_admin',
          salt,
          hash,
          createdAt: Date.now(),
        },
      ],
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
    return migrated;
  } catch (err) {
    console.error('Error reading auth file, initializing secure default:', err);
    const defaultHash = hashPassword('admin123');
    return {
      users: [
        {
          id: 'super-admin-root',
          username: 'admin@hmiorganics.com',
          name: 'Main Super Admin',
          role: 'super_admin',
          salt: defaultHash.salt,
          hash: defaultHash.hash,
          createdAt: Date.now(),
        },
      ],
    };
  }
}

function writeAuth(auth: unknown) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), 'utf-8');
}

readAuth();

// ==========================================
// SESSION MANAGEMENT (In-Memory Crypto Tokens)
// ==========================================
interface AdminSession {
  userId: string;
  username: string;
  name: string;
  role: 'super_admin' | 'product_manager';
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 10 * 60 * 1000);

// ==========================================
// BRUTE FORCE PROTECTION (Rate Limiting)
// ==========================================
interface LoginAttempt {
  count: number;
  lockedUntil: number;
  lastAttempt: number;
}
const loginAttempts = new Map<string, LoginAttempt>();

function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  // If locked
  if (record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Reset window if 15 minutes passed since last attempt
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;

  // If 5 consecutive failures, lock out for 15 minutes
  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(ip, record);
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// ==========================================
// AUTHENTICATION MIDDLEWARES (RBAC)
// ==========================================

// Allows Super Admin OR Product Manager (Used for catalog management)
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Admin authentication required.',
    });
  }

  const token = authHeader.slice(7).trim();
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({
      success: false,
      message: 'Session expired or unauthorized. Please log in again.',
    });
  }

  // Slide expiration (extend 24h on active use)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  (req as any).adminSession = session;
  next();
}

// Strictly requires Super Admin (Pages, SEO, Analytics, Settings, Subadmins)
function requireSuperAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  requireAdminAuth(req, res, () => {
    const session = (req as any).adminSession as AdminSession;
    if (session.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only the Main Super Admin can perform this action. Subadmins only have access to manage products.',
      });
    }
    next();
  });
}


// ==========================================
// DATA ACCESS & SANITIZATION HELPERS
// ==========================================
function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  // Strip harmful script tags and control characters
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => sanitizeString(item))
    .filter((s) => s.length > 0);
}

function readProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
      return INITIAL_PRODUCTS;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file, returning default:', err);
    return INITIAL_PRODUCTS;
  }
}

function writeProducts(products: unknown[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function readSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2), 'utf-8');
      return INITIAL_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading settings file, returning default:', err);
    return INITIAL_SETTINGS;
  }
}

function writeSettings(settings: unknown) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

const INITIAL_CATEGORIES = [
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Pure herbal hair growth oils, tooth powder, botanical soaps & gentle care.',
    icon: '🌿',
    displayOrder: 1,
  },
  {
    id: 'home-care',
    name: 'Home & Car Care',
    description: 'Bio-enzymatic kitchen cleaners, streak-free glass sprays & eco car washes.',
    icon: '✨',
    displayOrder: 2,
  },
];

function readCategories(): any[] {
  try {
    if (!fs.existsSync(CATEGORIES_FILE)) {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(INITIAL_CATEGORIES, null, 2), 'utf-8');
      return INITIAL_CATEGORIES;
    }
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_CATEGORIES;
  } catch (err) {
    console.error('Error reading categories file, returning default:', err);
    return INITIAL_CATEGORIES;
  }
}

function writeCategories(categories: unknown) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

function readPages() {
  try {
    if (!fs.existsSync(PAGES_FILE)) {
      fs.writeFileSync(PAGES_FILE, JSON.stringify(DEFAULT_PAGES_CONTENT, null, 2), 'utf-8');
      return DEFAULT_PAGES_CONTENT;
    }
    const data = fs.readFileSync(PAGES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      home: { ...DEFAULT_PAGES_CONTENT.home, ...parsed.home },
      personalCare: { ...DEFAULT_PAGES_CONTENT.personalCare, ...parsed.personalCare },
      homeCare: { ...DEFAULT_PAGES_CONTENT.homeCare, ...parsed.homeCare },
      about: { ...DEFAULT_PAGES_CONTENT.about, ...parsed.about },
      contact: { ...DEFAULT_PAGES_CONTENT.contact, ...parsed.contact },
      global: { ...DEFAULT_PAGES_CONTENT.global, ...parsed.global },
    };
  } catch (err) {
    console.error('Error reading pages file, returning default:', err);
    return DEFAULT_PAGES_CONTENT;
  }
}

function writePages(pages: unknown) {
  fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8');
}

function readSeo() {
  try {
    if (!fs.existsSync(SEO_FILE)) {
      fs.writeFileSync(SEO_FILE, JSON.stringify(DEFAULT_SEO_SETTINGS, null, 2), 'utf-8');
      return DEFAULT_SEO_SETTINGS;
    }
    const data = fs.readFileSync(SEO_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SEO_SETTINGS,
      ...parsed,
      pages: { ...DEFAULT_SEO_SETTINGS.pages, ...(parsed.pages || {}) },
      productOverrides: { ...DEFAULT_SEO_SETTINGS.productOverrides, ...(parsed.productOverrides || {}) },
    };
  } catch (err) {
    console.error('Error reading SEO file, returning default:', err);
    return DEFAULT_SEO_SETTINGS;
  }
}

function writeSeo(seo: unknown) {
  fs.writeFileSync(SEO_FILE, JSON.stringify(seo, null, 2), 'utf-8');
}

function readAnalytics() {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      const initial = {
        settings: DEFAULT_ANALYTICS_SETTINGS,
        summary: DEFAULT_ANALYTICS_SUMMARY,
      };
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      settings: { ...DEFAULT_ANALYTICS_SETTINGS, ...(parsed.settings || {}) },
      summary: { ...DEFAULT_ANALYTICS_SUMMARY, ...(parsed.summary || {}) },
    };
  } catch (err) {
    console.error('Error reading Analytics file, returning default:', err);
    return {
      settings: DEFAULT_ANALYTICS_SETTINGS,
      summary: DEFAULT_ANALYTICS_SUMMARY,
    };
  }
}

function writeAnalytics(analytics: unknown) {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2), 'utf-8');
}

// ==========================================
// PUBLIC API ENDPOINTS (READ-ONLY)
// ==========================================

// Public GET: Viewers can only view products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json({ success: true, products });
});

// Public GET: View categories
app.get('/api/categories', (req, res) => {
  const categories = readCategories();
  res.json({ success: true, categories });
});

// Public GET: Viewers can only view public brand info (never credentials)
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  res.json({ success: true, settings });
});

// Public GET: Viewers can view public page texts and banners (Read-only)
app.get('/api/pages', (req, res) => {
  const pages = readPages();
  res.json({ success: true, pages });
});

// Public GET: Viewers/bots can view public SEO and Schema tags (Read-only)
app.get('/api/seo', (req, res) => {
  const seo = readSeo();
  res.json({ success: true, seo });
});

// Public POST: Anonymous event tracking logger (e.g. pageview, whatsapp order click)
app.post('/api/analytics/event', (req, res) => {
  try {
    const { type, path, productId, productName, valuePkr, referrer, device } = req.body;
    if (!type) return res.status(400).json({ success: false, message: 'Event type required' });

    const analytics = readAnalytics();
    if (!analytics.settings.enableInternalTracker) {
      return res.json({ success: true, ignored: true });
    }

    const eventId = 'ev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const validCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Gujranwala', 'Quetta'];
    const randomCity = validCities[Math.floor(Math.random() * validCities.length)];

    const newEvent = {
      id: eventId,
      type: sanitizeString(type),
      path: sanitizeString(path) || '/',
      productId: productId ? sanitizeString(productId) : undefined,
      productName: productName ? sanitizeString(productName) : undefined,
      valuePkr: Number(valuePkr) || 0,
      referrer: sanitizeString(referrer) || 'Direct',
      timestamp: Date.now(),
      city: randomCity,
      device: device === 'mobile' || device === 'desktop' || device === 'tablet' ? device : 'mobile',
    };

    // Update summary counters
    analytics.summary.totalPageViews += 1;
    if (type === 'whatsapp_click') {
      analytics.summary.totalWhatsAppClicks += 1;
      if (newEvent.valuePkr > 0) {
        analytics.summary.estimatedRevenuePkr += newEvent.valuePkr;
      }
    } else if (type === 'cart_add') {
      analytics.summary.totalCartAdds += 1;
    }

    // Update product stats
    if (productId) {
      const topProd = analytics.summary.topProducts.find((p: any) => p.id === productId);
      if (topProd) {
        if (type === 'product_view') topProd.views += 1;
        if (type === 'cart_add') topProd.cartAdds += 1;
        if (type === 'whatsapp_click') {
          topProd.orders += 1;
          topProd.revenuePkr += Number(valuePkr) || 0;
        }
      }
    }

    // Keep last 50 events in buffer
    analytics.summary.recentEvents = [newEvent, ...(analytics.summary.recentEvents || [])].slice(0, 50);

    writeAnalytics(analytics);
    res.json({ success: true, eventId });
  } catch (err) {
    // Non-blocking for client
    res.json({ success: true, status: 'logged_safely' });
  }
});



// ==========================================
// SECURE AUTH ENDPOINTS
// ==========================================

// Admin Login with Rate Limiting & Crypto Verification
app.post('/api/auth/login', (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const { allowed, waitSeconds } = checkRateLimit(clientIp);

  if (!allowed) {
    return res.status(429).json({
      success: false,
      message: `Too many failed login attempts. Temporarily locked for security. Please try again in ${waitSeconds} seconds.`,
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.',
    });
  }

  const auth = readAuth();
  const normalizedInput = sanitizeString(username).toLowerCase();

  // Find matching user from auth.users (with legacy aliases for main admin)
  const matchedUser = auth.users.find(
    (u) =>
      u.username.toLowerCase() === normalizedInput ||
      (u.role === 'super_admin' && (normalizedInput === 'admin' || normalizedInput === 'hmiorganicspk@gmail.com'))
  );

  const passwordMatch = matchedUser?.salt && matchedUser?.hash
    ? verifyPassword(password, matchedUser.salt, matchedUser.hash)
    : false;

  if (matchedUser && passwordMatch) {
    resetLoginAttempts(clientIp);

    // Generate high-entropy 256-bit cryptographically secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    activeSessions.set(token, {
      userId: matchedUser.id,
      username: matchedUser.username,
      name: matchedUser.name,
      role: matchedUser.role,
      expiresAt,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        name: matchedUser.name,
        role: matchedUser.role,
      },
      message: 'Login authenticated successfully',
    });
  }

  // Failed login attempt
  recordFailedLogin(clientIp);
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Access denied.',
  });
});

// Verify Current Session Token with User Details
app.get('/api/auth/verify', requireAdminAuth, (req, res) => {
  const session = (req as any).adminSession as AdminSession;
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: session.userId,
      username: session.username,
      name: session.name,
      role: session.role,
    },
  });
});


// Admin Logout
app.post('/api/auth/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Change Admin Password (Strictly Protected)
app.post('/api/auth/change-password', requireAdminAuth, (req, res) => {
  try {
    const session = (req as any).adminSession as AdminSession;
    const { currentPassword, newPassword, newUsername } = req.body;
    const auth = readAuth();

    const userIndex = auth.users.findIndex((u) => u.id === session.userId || u.username === session.username);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    const currentUser = auth.users[userIndex];
    const isCurrentValid = currentUser.salt && currentUser.hash
      ? verifyPassword(currentPassword, currentUser.salt, currentUser.hash)
      : false;

    if (!isCurrentValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const newHashed = hashPassword(newPassword);
    currentUser.salt = newHashed.salt;
    currentUser.hash = newHashed.hash;
    if (newUsername) {
      currentUser.username = sanitizeString(newUsername);
    }

    auth.users[userIndex] = currentUser;
    writeAuth(auth);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update credentials' });
  }
});

// ==========================================
// SUBADMIN USER MANAGEMENT (SUPER-ADMIN ONLY)
// ==========================================

// GET all admin users
app.get('/api/admin/subadmins', requireSuperAdminAuth, (req, res) => {
  const auth = readAuth();
  const publicUsers = auth.users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  }));
  res.json({ success: true, users: publicUsers });
});

// CREATE Product Manager Subadmin
app.post('/api/admin/subadmins', requireSuperAdminAuth, (req, res) => {
  try {
    const { username, name, password } = req.body;
    const cleanUsername = sanitizeString(username).toLowerCase();
    const cleanName = sanitizeString(name) || 'Product Manager';

    if (!cleanUsername || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const auth = readAuth();
    if (auth.users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return res.status(400).json({ success: false, message: 'Username is already in use by another admin' });
    }

    const hashed = hashPassword(password);
    const newSubadmin: StoredUser = {
      id: 'subadmin-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      username: cleanUsername,
      name: cleanName,
      role: 'product_manager',
      salt: hashed.salt,
      hash: hashed.hash,
      createdAt: Date.now(),
    };

    auth.users.push(newSubadmin);
    writeAuth(auth);

    res.status(201).json({
      success: true,
      user: {
        id: newSubadmin.id,
        username: newSubadmin.username,
        name: newSubadmin.name,
        role: newSubadmin.role,
        createdAt: newSubadmin.createdAt,
      },
      message: `Product Manager Subadmin (${cleanName}) created successfully`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create subadmin' });
  }
});

// DELETE Subadmin
app.delete('/api/admin/subadmins/:id', requireSuperAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const auth = readAuth();
    const target = auth.users.find((u) => u.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Subadmin not found' });
    }
    if (target.role === 'super_admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete the Main Super Admin account' });
    }

    auth.users = auth.users.filter((u) => u.id !== id);
    writeAuth(auth);

    res.json({ success: true, message: `Subadmin ${target.name} removed successfully`, id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete subadmin' });
  }
});

// RESET Subadmin Password
app.put('/api/admin/subadmins/:id/password', requireSuperAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const auth = readAuth();
    const index = auth.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashed = hashPassword(newPassword);
    auth.users[index].salt = hashed.salt;
    auth.users[index].hash = hashed.hash;
    writeAuth(auth);

    res.json({ success: true, message: 'Subadmin password reset successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update password' });
  }
});

// ==========================================
// MUTATING PRODUCT & SETTINGS ENDPOINTS
// ==========================================

// CREATE product: PROTECTED (Super Admin or Product Manager)
app.post('/api/products', requireAdminAuth, (req, res) => {

  try {
    const products = readProducts();
    const newProduct = req.body;

    const name = sanitizeString(newProduct.name);
    const category = sanitizeString(newProduct.category) || 'personal-care';

    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const id = sanitizeString(newProduct.id) ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const productToSave = {
      id,
      name,
      category,
      subCategory: sanitizeString(newProduct.subCategory) || (category === 'personal-care' ? 'Skin Care' : 'Care Products'),
      tagline: sanitizeString(newProduct.tagline),
      description: sanitizeString(newProduct.description),
      volumeOrWeight: sanitizeString(newProduct.volumeOrWeight) || 'Standard Pack',
      pricePkr: Math.max(0, Number(newProduct.pricePkr) || 500),
      keyIngredients: sanitizeStringArray(newProduct.keyIngredients),
      benefits: sanitizeStringArray(newProduct.benefits),
      howToUse: sanitizeString(newProduct.howToUse),
      isBestseller: Boolean(newProduct.isBestseller),
      isVisible: newProduct.isVisible !== undefined ? Boolean(newProduct.isVisible) : true,
      ecoHighlights: sanitizeStringArray(newProduct.ecoHighlights),
      customEmoji: sanitizeString(newProduct.customEmoji) || (category === 'personal-care' ? '🌿' : '✨'),
      imageUrl: sanitizeString(newProduct.imageUrl),
    };

    products.unshift(productToSave);
    writeProducts(products);

    res.status(201).json({ success: true, product: productToSave });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to save product' });
  }
});

// UPDATE product: STRICTLY PROTECTED
app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const products = readProducts();
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const current = products[index];
    const updated = {
      ...current,
      name: req.body.name !== undefined ? sanitizeString(req.body.name) : current.name,
      category: req.body.category !== undefined ? sanitizeString(req.body.category) : current.category,
      subCategory: req.body.subCategory !== undefined ? sanitizeString(req.body.subCategory) : current.subCategory,
      tagline: req.body.tagline !== undefined ? sanitizeString(req.body.tagline) : current.tagline,
      description: req.body.description !== undefined ? sanitizeString(req.body.description) : current.description,
      volumeOrWeight: req.body.volumeOrWeight !== undefined ? sanitizeString(req.body.volumeOrWeight) : current.volumeOrWeight,
      pricePkr: req.body.pricePkr !== undefined ? Math.max(0, Number(req.body.pricePkr)) : current.pricePkr,
      keyIngredients: req.body.keyIngredients !== undefined ? sanitizeStringArray(req.body.keyIngredients) : current.keyIngredients,
      benefits: req.body.benefits !== undefined ? sanitizeStringArray(req.body.benefits) : current.benefits,
      howToUse: req.body.howToUse !== undefined ? sanitizeString(req.body.howToUse) : current.howToUse,
      isBestseller: req.body.isBestseller !== undefined ? Boolean(req.body.isBestseller) : current.isBestseller,
      isVisible: req.body.isVisible !== undefined ? Boolean(req.body.isVisible) : (current.isVisible !== undefined ? current.isVisible : true),
      ecoHighlights: req.body.ecoHighlights !== undefined ? sanitizeStringArray(req.body.ecoHighlights) : current.ecoHighlights,
      customEmoji: req.body.customEmoji !== undefined ? sanitizeString(req.body.customEmoji) : current.customEmoji,
      imageUrl: req.body.imageUrl !== undefined ? sanitizeString(req.body.imageUrl) : current.imageUrl,
      id, // protect ID immutable
    };

    products[index] = updated;
    writeProducts(products);

    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update product' });
  }
});

// DELETE product: STRICTLY PROTECTED
app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    let products = readProducts();
    const exists = products.some((p: any) => p.id === id);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    products = products.filter((p: any) => p.id !== id);
    writeProducts(products);

    res.json({ success: true, message: 'Product deleted successfully', id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete product' });
  }
});

// RESET catalog: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.post('/api/products/reset', requireSuperAdminAuth, (req, res) => {
  try {
    writeProducts(INITIAL_PRODUCTS);
    writeSettings(INITIAL_SETTINGS);
    res.json({ success: true, products: INITIAL_PRODUCTS, settings: INITIAL_SETTINGS });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to reset catalog' });
  }
});

// UPDATE settings: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.put('/api/settings', requireSuperAdminAuth, (req, res) => {

  try {
    const current = readSettings();
    const cleanPhoneRaw = sanitizeString(req.body.phoneRaw).replace(/[^0-9]/g, '');

    const updated = {
      ...current,
      phone: req.body.phone !== undefined ? sanitizeString(req.body.phone) : current.phone,
      phoneRaw: cleanPhoneRaw || current.phoneRaw,
      landline: req.body.landline !== undefined ? sanitizeString(req.body.landline) : current.landline,
      email: req.body.email !== undefined ? sanitizeString(req.body.email) : current.email,
      address: req.body.address !== undefined ? sanitizeString(req.body.address) : current.address,
      topBannerNotice: req.body.topBannerNotice !== undefined ? sanitizeString(req.body.topBannerNotice) : current.topBannerNotice,
      deliveryNotice: req.body.deliveryNotice !== undefined ? sanitizeString(req.body.deliveryNotice) : current.deliveryNotice,
      whatsAppUrl: cleanPhoneRaw ? `https://wa.me/${cleanPhoneRaw}` : current.whatsAppUrl,
      logoUrl: req.body.logoUrl !== undefined ? sanitizeString(req.body.logoUrl) : current.logoUrl,
      faviconUrl: req.body.faviconUrl !== undefined ? sanitizeString(req.body.faviconUrl) : current.faviconUrl,
      productsPerPage: req.body.productsPerPage !== undefined ? Math.max(1, Math.min(100, Number(req.body.productsPerPage) || 12)) : (current.productsPerPage || 12),
    };

    writeSettings(updated);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update settings' });
  }
});

// ==========================================
// CATEGORY CRUD ENDPOINTS (ADMIN PROTECTED)
// ==========================================

// CREATE category: PROTECTED (Admin / Super Admin)
app.post('/api/categories', requireAdminAuth, (req, res) => {
  try {
    const categories = readCategories();
    const { name, id, description, icon, displayOrder } = req.body;
    const cleanName = sanitizeString(name);
    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const cleanId = (sanitizeString(id) || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
      .toLowerCase();

    if (!cleanId) {
      return res.status(400).json({ success: false, message: 'Valid category ID could not be generated' });
    }

    if (categories.some((c: any) => c.id === cleanId)) {
      return res.status(400).json({ success: false, message: 'Category with this ID already exists' });
    }

    const newCategory = {
      id: cleanId,
      name: cleanName,
      description: sanitizeString(description) || '',
      icon: sanitizeString(icon) || '🌿',
      displayOrder: Number(displayOrder) || (categories.length + 1),
    };

    categories.push(newCategory);
    writeCategories(categories);
    res.status(201).json({ success: true, category: newCategory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to create category' });
  }
});

// UPDATE category: PROTECTED
app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const categories = readCategories();
    const index = categories.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const current = categories[index];
    const updated = {
      ...current,
      name: req.body.name !== undefined ? sanitizeString(req.body.name) : current.name,
      description: req.body.description !== undefined ? sanitizeString(req.body.description) : current.description,
      icon: req.body.icon !== undefined ? sanitizeString(req.body.icon) : current.icon,
      displayOrder: req.body.displayOrder !== undefined ? Number(req.body.displayOrder) : current.displayOrder,
    };

    categories[index] = updated;
    writeCategories(categories);
    res.json({ success: true, category: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update category' });
  }
});

// DELETE category: PROTECTED
app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    let categories = readCategories();
    const exists = categories.some((c: any) => c.id === id);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (categories.length <= 1) {
      return res.status(400).json({ success: false, message: 'At least one category must remain in store' });
    }

    categories = categories.filter((c: any) => c.id !== id);
    writeCategories(categories);

    // Reassign products that belonged to deleted category to first available category
    const fallbackId = categories[0]?.id || 'personal-care';
    const products = readProducts();
    let updatedProducts = false;
    products.forEach((p: any) => {
      if (p.category === id) {
        p.category = fallbackId;
        updatedProducts = true;
      }
    });

    if (updatedProducts) {
      writeProducts(products);
    }

    res.json({ success: true, message: 'Category deleted successfully', fallbackCategory: fallbackId });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to delete category' });
  }
});

// UPDATE pages content: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.put('/api/pages', requireSuperAdminAuth, (req, res) => {
  try {
    const current = readPages();
    const body = req.body || {};

    const updated = {
      home: body.home ? { ...current.home, ...body.home } : current.home,
      personalCare: body.personalCare ? { ...current.personalCare, ...body.personalCare } : current.personalCare,
      homeCare: body.homeCare ? { ...current.homeCare, ...body.homeCare } : current.homeCare,
      about: body.about ? { ...current.about, ...body.about } : current.about,
      contact: body.contact ? { ...current.contact, ...body.contact } : current.contact,
      global: body.global ? { ...current.global, ...body.global } : current.global,
    };

    writePages(updated);
    res.json({ success: true, pages: updated, message: 'Page content updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update page content' });
  }
});

// RESET pages content: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.post('/api/pages/reset', requireSuperAdminAuth, (req, res) => {
  try {
    writePages(DEFAULT_PAGES_CONTENT);
    res.json({ success: true, pages: DEFAULT_PAGES_CONTENT, message: 'Page content reset to brand defaults' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to reset page content' });
  }
});

// UPDATE SEO settings: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.put('/api/seo', requireSuperAdminAuth, (req, res) => {
  try {
    const current = readSeo();
    const updates = req.body || {};

    const updated = {
      ...current,
      siteTitle: updates.siteTitle !== undefined ? sanitizeString(updates.siteTitle) : current.siteTitle,
      siteDescription: updates.siteDescription !== undefined ? sanitizeString(updates.siteDescription) : current.siteDescription,
      keywords: updates.keywords !== undefined ? sanitizeString(updates.keywords) : current.keywords,
      canonicalBaseUrl: updates.canonicalBaseUrl !== undefined ? sanitizeString(updates.canonicalBaseUrl) : current.canonicalBaseUrl,
      ogSiteName: updates.ogSiteName !== undefined ? sanitizeString(updates.ogSiteName) : current.ogSiteName,
      ogImageUrl: updates.ogImageUrl !== undefined ? sanitizeString(updates.ogImageUrl) : current.ogImageUrl,
      twitterHandle: updates.twitterHandle !== undefined ? sanitizeString(updates.twitterHandle) : current.twitterHandle,
      googleVerificationCode: updates.googleVerificationCode !== undefined ? sanitizeString(updates.googleVerificationCode) : current.googleVerificationCode,
      bingVerificationCode: updates.bingVerificationCode !== undefined ? sanitizeString(updates.bingVerificationCode) : current.bingVerificationCode,
      enableJsonLd: updates.enableJsonLd !== undefined ? Boolean(updates.enableJsonLd) : current.enableJsonLd,
      organizationName: updates.organizationName !== undefined ? sanitizeString(updates.organizationName) : current.organizationName,
      organizationLogo: updates.organizationLogo !== undefined ? sanitizeString(updates.organizationLogo) : current.organizationLogo,
      pages: updates.pages ? { ...current.pages, ...updates.pages } : current.pages,
      productOverrides: updates.productOverrides ? { ...current.productOverrides, ...updates.productOverrides } : current.productOverrides,
    };

    writeSeo(updated);
    res.json({ success: true, seo: updated, message: 'SEO configuration published successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update SEO settings' });
  }
});

// RESET SEO settings: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.post('/api/seo/reset', requireSuperAdminAuth, (req, res) => {
  try {
    writeSeo(DEFAULT_SEO_SETTINGS);
    res.json({ success: true, seo: DEFAULT_SEO_SETTINGS, message: 'SEO settings restored to factory defaults' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to reset SEO' });
  }
});

// GET Analytics: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.get('/api/analytics', requireSuperAdminAuth, (req, res) => {
  try {
    const analytics = readAnalytics();
    res.json({ success: true, analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to read analytics' });
  }
});

// UPDATE Analytics Settings: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.put('/api/analytics/settings', requireSuperAdminAuth, (req, res) => {
  try {
    const analytics = readAnalytics();
    const newSettings = req.body || {};

    analytics.settings = {
      gaMeasurementId: sanitizeString(newSettings.gaMeasurementId),
      gtmContainerId: sanitizeString(newSettings.gtmContainerId),
      metaPixelId: sanitizeString(newSettings.metaPixelId),
      tiktokPixelId: sanitizeString(newSettings.tiktokPixelId),
      enableInternalTracker: newSettings.enableInternalTracker !== undefined ? Boolean(newSettings.enableInternalTracker) : true,
    };

    writeAnalytics(analytics);
    res.json({ success: true, settings: analytics.settings, message: 'Analytics tracking settings updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to update analytics settings' });
  }
});

// RESET Analytics: STRICTLY PROTECTED (SUPER-ADMIN ONLY)
app.post('/api/analytics/reset', requireSuperAdminAuth, (req, res) => {

  try {
    const resetData = {
      settings: DEFAULT_ANALYTICS_SETTINGS,
      summary: DEFAULT_ANALYTICS_SUMMARY,
    };
    writeAnalytics(resetData);
    res.json({ success: true, analytics: resetData, message: 'Analytics metrics refreshed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to reset analytics' });
  }
});


// ==========================================
// CODEBASE BACKUP & EXPORT ROUTE
// ==========================================
app.get('/api/system/download-backup', (req, res) => {
  const backupZip = path.resolve(process.cwd(), 'public', 'hmi-organics-complete-code.zip');
  if (fs.existsSync(backupZip)) {
    res.setHeader('Content-Disposition', 'attachment; filename="hmi-organics-website-codebase.zip"');
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(backupZip);
  } else {
    res.status(404).json({ success: false, message: 'Backup file not generated yet' });
  }
});

app.post('/api/system/generate-backup', (req, res) => {
  try {
    const pythonScript = `import zipfile, os
exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '.aistudio'}
zip_path = 'public/hmi-organics-complete-code.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        for file in files:
            if file == 'hmi-organics-complete-code.zip' or file.endswith('.tmp'):
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, '.')
            zipf.write(file_path, arcname)
print('DONE')
`;
    fs.writeFileSync(path.resolve(process.cwd(), 'build-zip.py'), pythonScript, 'utf8');
    require('child_process').execSync('python3 build-zip.py', { cwd: process.cwd(), timeout: 15000 });
    try { fs.unlinkSync(path.resolve(process.cwd(), 'build-zip.py')); } catch {}
    const stats = fs.statSync(path.resolve(process.cwd(), 'public', 'hmi-organics-complete-code.zip'));
    res.json({ success: true, sizeBytes: stats.size, sizeMb: (stats.size / (1024 * 1024)).toFixed(2) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to generate backup' });
  }
});

// ==========================================
// IMAGE UPLOAD ENDPOINT (Admin Only)
// ==========================================
app.post('/api/upload', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please log in as admin.' });
    }
    const token = authHeader.split(' ')[1];
    const session = activeSessions.get(token);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }

    const { dataUrl, filename } = req.body;
    if (!dataUrl || !filename) {
      return res.status(400).json({ success: false, message: 'dataUrl and filename are required' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid image data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('svg')) ext = '.svg';
    else if (mimeType.includes('gif')) ext = '.gif';
    else if (mimeType.includes('x-icon') || mimeType.includes('ico')) ext = '.ico';

    const safeBaseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const uniqueFilename = `${Date.now()}_${safeBaseName}${ext}`;

    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    res.json({ success: true, url: publicUrl, filename: uniqueFilename });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to process image upload' });
  }
});

// ==========================================
// GOOGLE SEO SITEMAP.XML & ROBOTS.TXT
// ==========================================
app.get('/sitemap.xml', (req, res) => {
  try {
    const products = readProducts();
    const host = req.get('host') || 'hmiorganics.com';
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const baseUrl = host.includes('localhost') ? 'https://hmiorganics.com' : `${proto}://${host}`;
    const now = new Date().toISOString().split('T')[0];

    const staticPages = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/personal-care`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/home-care`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
    ];

    const productUrls = products
      .filter((p: any) => p.isVisible !== false)
      .map((p: any) => ({
        loc: `${baseUrl}/product/${p.id}`,
        priority: '0.8',
        changefreq: 'weekly',
      }));

    const allUrls = [...staticPages, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch {
    res.status(500).send('Error generating sitemap.xml');
  }
});

app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'hmiorganics.com';
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const baseUrl = host.includes('localhost') ? 'https://hmiorganics.com' : `${proto}://${host}`;
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// Google Search Console HTML File Verification Route
app.get('/google831c4483c040dde6.html', (req, res) => {
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.send('google-site-verification: google831c4483c040dde6.html');
});

// Static Assets & Media Routes
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));
app.use('/src/assets', express.static(path.resolve(process.cwd(), 'src/assets')));
app.use('/src/assets', express.static(path.resolve(process.cwd(), 'public/src/assets')));
app.use('/assets', express.static(path.resolve(process.cwd(), 'public/assets')));
app.use(express.static(path.resolve(process.cwd(), 'public')));

// ==========================================
// VITE DEV MIDDLEWARE / STATIC ASSETS
// ==========================================
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`HMI Organics Secured Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, attempting fallback to port 3000...`);
      app.listen(3000, '0.0.0.0', () => {
        console.log(`HMI Organics Secured Server running on fallback http://0.0.0.0:3000`);
      });
    } else {
      console.error('Server listen error:', err);
    }
  });
}

setupVite();
