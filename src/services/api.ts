import {
  Product,
  Category,
  BrandSettings,
  SitePagesContent,
  SiteSeoSettings,
  AnalyticsSettings,
  AnalyticsSummary,
  AnalyticsEvent,
  AdminRole,
  AdminUser,
  SubadminCreateInput,
} from '../types';
import { ALL_PRODUCTS, BRAND_INFO } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import {
  DEFAULT_SEO_SETTINGS,
  DEFAULT_ANALYTICS_SETTINGS,
  DEFAULT_ANALYTICS_SUMMARY,
} from '../data/seoContent';

const LOCAL_STORAGE_PRODUCTS_KEY = 'hmi_organics_products';
const LOCAL_STORAGE_CATEGORIES_KEY = 'hmi_organics_categories';
const LOCAL_STORAGE_SETTINGS_KEY = 'hmi_organics_settings';
const LOCAL_STORAGE_PAGES_KEY = 'hmi_organics_pages';
const LOCAL_STORAGE_SEO_KEY = 'hmi_organics_seo';
const SESSION_TOKEN_KEY = 'hmi_admin_token';
const AUTH_STATE_KEY = 'hmi_admin_authenticated';
const USER_ROLE_KEY = 'hmi_admin_role';
const USER_DATA_KEY = 'hmi_admin_user';



function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const api = {
  // Public GET: Fetch all products (Read-only for all viewers)
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(data.products));
          return data.products;
        }
      }
    } catch (e) {
      console.warn('API error fetching products, using cached store:', e);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return ALL_PRODUCTS;
  },

  // Public GET: Fetch all categories
  async getCategories(): Promise<Category[]> {
    const defaultCategories: Category[] = [
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

    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(data.categories));
          return data.categories;
        }
      }
    } catch (e) {
      console.warn('API error fetching categories, using cached store:', e);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return defaultCategories;
  },

  // PROTECTED: Create category
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(categoryData),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to create categories.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create category');
    }

    return data.category;
  },

  // PROTECTED: Update category
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to update categories.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update category');
    }

    return data.category;
  },

  // PROTECTED: Delete category
  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to delete categories.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete category');
    }

    return true;
  },

  // Public GET: Fetch brand settings (Read-only public info)
  async getSettings(): Promise<BrandSettings> {
    const defaultSettings: BrandSettings = {
      ...BRAND_INFO,
      topBannerNotice: '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan',
    };

    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(data.settings));
          return data.settings;
        }
      }
    } catch (e) {
      console.warn('API error fetching settings, using cached settings:', e);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return defaultSettings;
  },

  // Public GET: Fetch frontend pages content (Read-only for all viewers)
  async getPages(): Promise<SitePagesContent> {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.pages) {
          localStorage.setItem(LOCAL_STORAGE_PAGES_KEY, JSON.stringify(data.pages));
          return data.pages;
        }
      }
    } catch (e) {
      console.warn('API error fetching page content, using cached data:', e);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return DEFAULT_PAGES_CONTENT;
  },

  // PROTECTED: Create a new product (Strictly requires Admin Token)
  async createProduct(productData: Partial<Product>): Promise<Product> {

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(productData),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to add products.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create product');
    }

    return data.product;
  },

  // PROTECTED: Update an existing product (Strictly requires Admin Token)
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to edit products.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update product');
    }

    return data.product;
  },

  // PROTECTED: Delete a product (Strictly requires Admin Token)
  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to delete products.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete product');
    }

    return true;
  },

  // PROTECTED: Reset catalog to defaults (Strictly requires Admin Token)
  async resetProducts(): Promise<Product[]> {
    const res = await fetch('/api/products/reset', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to reset catalog.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset catalog');
    }

    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(data.products));
    return data.products;
  },

  // PROTECTED: Update settings (Strictly requires Admin Token)
  async updateSettings(settings: Partial<BrandSettings>): Promise<BrandSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(settings),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to update store settings.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update settings');
    }

    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(data.settings));
    return data.settings;
  },

  // PROTECTED: Update frontend pages content (Strictly requires Admin Token)
  async updatePages(pagesUpdates: Partial<SitePagesContent>): Promise<SitePagesContent> {
    const res = await fetch('/api/pages', {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(pagesUpdates),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to edit frontend page content.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update page content');
    }

    localStorage.setItem(LOCAL_STORAGE_PAGES_KEY, JSON.stringify(data.pages));
    return data.pages;
  },

  // PROTECTED: Reset frontend pages content to brand defaults (Strictly requires Admin Token)
  async resetPages(): Promise<SitePagesContent> {
    const res = await fetch('/api/pages/reset', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to reset page content.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset page content');
    }

    localStorage.setItem(LOCAL_STORAGE_PAGES_KEY, JSON.stringify(data.pages));
    return data.pages;
  },

  // Public GET: Fetch SEO settings & structured data
  async getSeo(): Promise<SiteSeoSettings> {
    try {
      const res = await fetch('/api/seo');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.seo) {
          localStorage.setItem(LOCAL_STORAGE_SEO_KEY, JSON.stringify(data.seo));
          return data.seo;
        }
      }
    } catch (e) {
      console.warn('API error fetching SEO, using cached store:', e);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SEO_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return DEFAULT_SEO_SETTINGS;
  },

  // PROTECTED: Update SEO settings (Admin-Only)
  async updateSeo(updates: Partial<SiteSeoSettings>): Promise<SiteSeoSettings> {
    const res = await fetch('/api/seo', {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to edit SEO settings.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update SEO settings');
    }

    localStorage.setItem(LOCAL_STORAGE_SEO_KEY, JSON.stringify(data.seo));
    return data.seo;
  },

  // PROTECTED: Reset SEO settings to defaults (Admin-Only)
  async resetSeo(): Promise<SiteSeoSettings> {
    const res = await fetch('/api/seo/reset', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to reset SEO settings.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset SEO settings');
    }

    localStorage.setItem(LOCAL_STORAGE_SEO_KEY, JSON.stringify(data.seo));
    return data.seo;
  },

  // PROTECTED: Fetch Store Analytics (Admin-Only)
  async getAnalytics(): Promise<{ settings: AnalyticsSettings; summary: AnalyticsSummary }> {
    const res = await fetch('/api/analytics', {
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to view analytics.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch analytics');
    }

    return data.analytics;
  },

  // Public POST: Anonymous event logger
  async trackEvent(event: Partial<AnalyticsEvent>): Promise<void> {
    try {
      const isMobile = window.innerWidth < 768;
      const device = isMobile ? 'mobile' : 'desktop';
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          device: event.device || device,
          referrer: document.referrer || 'Direct',
        }),
      });
    } catch {
      // Non-blocking
    }
  },

  // PROTECTED: Update Analytics Settings (Admin-Only)
  async updateAnalyticsSettings(settings: Partial<AnalyticsSettings>): Promise<AnalyticsSettings> {
    const res = await fetch('/api/analytics/settings', {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(settings),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to update analytics tracking.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update analytics settings');
    }

    return data.settings;
  },

  // PROTECTED: Reset Analytics (Admin-Only)
  async resetAnalytics(): Promise<{ settings: AnalyticsSettings; summary: AnalyticsSummary }> {
    const res = await fetch('/api/analytics/reset', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Access Denied: You must be logged in as an administrator to reset analytics.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset analytics');
    }

    return data.analytics;
  },

  // SECURE AUTH: Admin Login with Rate Limit handling


  async login(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        return {
          success: false,
          message: data.message || 'Too many failed login attempts. Temporarily locked for security.',
        };
      }

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_STATE_KEY, 'true');
        if (data.user) {
          sessionStorage.setItem(USER_ROLE_KEY, data.user.role || 'super_admin');
          sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        } else {
          sessionStorage.setItem(USER_ROLE_KEY, 'super_admin');
        }
        return { success: true, token: data.token, user: data.user };
      }

      return {
        success: false,
        message: data.message || 'Invalid email or password. Access denied.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: 'Could not connect to secure authentication server. Please try again.',
      };
    }
  },

  // Admin Logout (Clears tokens on backend & client)
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeader(),
      });
    } catch {}

    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(USER_ROLE_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_STATE_KEY);
  },

  // Check Authentication Status
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const authState = localStorage.getItem(AUTH_STATE_KEY);
    return Boolean(token && authState === 'true');
  },

  // Get current admin user role
  getRole(): AdminRole {
    return (sessionStorage.getItem(USER_ROLE_KEY) as AdminRole) || 'super_admin';
  },

  // Get current admin user info
  getUser(): AdminUser | null {
    try {
      const raw = sessionStorage.getItem(USER_DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // PROTECTED: Change Admin Password (Strictly requires Admin Token)
  async changePassword(currentPassword: string, newPassword: string, newUsername?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ currentPassword, newPassword, newUsername }),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update password');
    }

    return data;
  },

  // ==========================================
  // SUBADMIN MANAGEMENT (SUPER ADMIN ONLY)
  // ==========================================

  // List all admin users & subadmins
  async getSubadmins(): Promise<AdminUser[]> {
    const res = await fetch('/api/admin/subadmins', {
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired. Please log in again.');
    }
    if (res.status === 403) {
      throw new Error('Access Denied: Only the Main Super Admin can manage subadmins.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch subadmins');
    }

    return data.users;
  },

  // Create Product Manager Subadmin
  async createSubadmin(input: SubadminCreateInput): Promise<AdminUser> {
    const res = await fetch('/api/admin/subadmins', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(input),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired. Please log in again.');
    }
    if (res.status === 403) {
      throw new Error('Access Denied: Only the Main Super Admin can create subadmins.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create subadmin');
    }

    return data.user;
  },

  // Delete Subadmin
  async deleteSubadmin(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/subadmins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired. Please log in again.');
    }
    if (res.status === 403) {
      throw new Error('Access Denied: Only the Main Super Admin can delete subadmins.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete subadmin');
    }

    return true;
  },

  // Reset Subadmin Password
  async resetSubadminPassword(id: string, newPassword: string): Promise<void> {
    const res = await fetch(`/api/admin/subadmins/${id}/password`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ newPassword }),
    });

    if (res.status === 401) {
      this.logout();
      throw new Error('Session expired. Please log in again.');
    }
    if (res.status === 403) {
      throw new Error('Access Denied: Only the Main Super Admin can reset subadmin passwords.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset subadmin password');
    }
  },

  // Upload Image File (converts file to dataUrl and saves to server /uploads/)
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({
              dataUrl,
              filename: file.name,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Image upload failed');
          }
          resolve({ url: data.url, filename: data.filename });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};
