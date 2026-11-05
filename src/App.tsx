import React, { useState, useEffect } from 'react';
import {
  PageId,
  Product,
  Category,
  CartItem,
  BrandSettings,
  SitePagesContent,
  SiteSeoSettings,
  AnalyticsSettings,
} from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WhatsAppCartModal } from './components/WhatsAppCartModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { SeoHeadManager } from './components/SeoHeadManager';
import { AdminQuickEditBar } from './components/admin/AdminQuickEditBar';
import { PageEditorModal } from './components/admin/PageEditorModal';
import { HomePage } from './pages/HomePage';
import { PersonalCarePage } from './pages/PersonalCarePage';
import { HomeCarePage } from './pages/HomeCarePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { api } from './services/api';
import { ALL_PRODUCTS, BRAND_INFO } from './data/products';
import { DEFAULT_PAGES_CONTENT } from './data/pagesContent';
import { DEFAULT_SEO_SETTINGS, DEFAULT_ANALYTICS_SETTINGS } from './data/seoContent';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => api.isAuthenticated());
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('all');
  const [settings, setSettings] = useState<BrandSettings>({
    ...BRAND_INFO,
    topBannerNotice: '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan',
  });
  const [pagesContent, setPagesContent] = useState<SitePagesContent>(DEFAULT_PAGES_CONTENT);
  const [seoSettings, setSeoSettings] = useState<SiteSeoSettings>(DEFAULT_SEO_SETTINGS);
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>(DEFAULT_ANALYTICS_SETTINGS);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLiveEditorOpen, setIsLiveEditorOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hmi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load products, categories, settings, pages content, and SEO from backend on mount
  useEffect(() => {
    let mounted = true;
    async function loadInitialData() {
      try {
        const [loadedProducts, loadedCategories, loadedSettings, loadedPages, loadedSeo, loadedAnalytics] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getSettings(),
          api.getPages(),
          api.getSeo(),
          api.getAnalytics().catch(() => null),
        ]);
        if (mounted) {
          if (Array.isArray(loadedProducts) && loadedProducts.length > 0) {
            setProducts(loadedProducts);
          }
          if (Array.isArray(loadedCategories) && loadedCategories.length > 0) {
            setCategories(loadedCategories);
          }
          if (loadedSettings) {
            setSettings(loadedSettings);
          }
          if (loadedPages) {
            setPagesContent(loadedPages);
          }
          if (loadedSeo) {
            setSeoSettings(loadedSeo);
          }
          if (loadedAnalytics?.settings) {
            setAnalyticsSettings(loadedAnalytics.settings);
          }
        }
      } catch (err) {
        console.warn('Could not load data from API, using defaults:', err);
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    }

    loadInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hmi_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore localStorage errors
    }
  }, [cartItems]);

  // Track Page Views for internal store analytics
  useEffect(() => {
    const pagePath = currentPage === 'home' ? '/' : `/${currentPage}`;
    api.trackEvent({
      type: 'page_view',
      path: pagePath,
    });
    // Scroll to top on page navigate
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // CRUD Handlers for Products
  const handleAddProduct = async (productData: Partial<Product>) => {
    const created = await api.createProduct(productData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await api.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));

    // Also update item if currently in cart
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, product: updated } : item
      )
    );

    // If quickView is showing this product, update it
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(updated);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }
  };

  const handleResetCatalog = async () => {
    const defaultList = await api.resetProducts();
    setProducts(defaultList);
    const defaultSettings: BrandSettings = {
      ...BRAND_INFO,
      topBannerNotice: '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan',
    };
    setSettings(defaultSettings);
  };

  const handleAddCategory = async (catData: Partial<Category>) => {
    const created = await api.createCategory(catData);
    setCategories((prev) => [...prev, created]);
  };

  const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
    const updated = await api.updateCategory(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Reload products because any products in deleted category were safely reassigned to fallback
    const freshProducts = await api.getProducts();
    setProducts(freshProducts);
  };

  const handleUpdateSettings = async (newSettings: Partial<BrandSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleUpdatePagesContent = async (newPages: Partial<SitePagesContent>) => {
    const updated = await api.updatePages(newPages);
    setPagesContent(updated);
  };

  const handleResetPagesContent = async () => {
    const reset = await api.resetPages();
    setPagesContent(reset);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Track analytics event
    api.trackEvent({
      type: 'cart_add',
      productId: product.id,
      productName: product.name,
      valuePkr: product.pricePkr || 0,
      path: `/${currentPage}`,
    });
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    api.trackEvent({
      type: 'product_view',
      productId: product.id,
      productName: product.name,
      valuePkr: product.pricePkr || 0,
      path: `/${currentPage}`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartProductIds = new Set(cartItems.map((item) => item.product.id));

  // Global top banner text (from settings or pagesContent.global)
  const topBannerText =
    pagesContent.global?.topBannerNotice ||
    settings.topBannerNotice ||
    '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan';

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#192D21]">
      
      {/* Dynamic SEO Meta Tags, OpenGraph, Twitter Cards, Google Analytics & Schema.org JSON-LD */}
      <SeoHeadManager
        currentPage={currentPage}
        seoSettings={seoSettings}
        activeProduct={quickViewProduct}
        settings={settings}
        analyticsSettings={analyticsSettings}
      />

      {/* Top Banner / Announcement */}
      <div className="bg-[#183925] text-[#DCECE0] text-[11px] font-medium py-1.5 px-4 text-center border-b border-[#234E34]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>{topBannerText}</span>
          <span aria-hidden="true" className="text-[#6EA780] hidden sm:inline">·</span>
          <a
            href={settings.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              api.trackEvent({
                type: 'whatsapp_click',
                path: '/top-banner',
              });
            }}
            className="text-[#96EAB1] hover:underline"
          >
            Direct WhatsApp: {settings.phone}
          </a>
        </div>
      </div>

      {/* Header (Strict 3-zone Top Bar Contract) */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        settings={settings}
        isAdminAuthenticated={isAdminAuthenticated}
        categories={categories}
        onSelectCategoryFilter={setHomeCategoryFilter}
      />

      {/* Active Page View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            products={products}
            categories={categories}
            settings={settings}
            content={pagesContent.home}
            selectedCategoryFilter={homeCategoryFilter}
            onSelectCategoryFilter={setHomeCategoryFilter}
          />
        )}

        {currentPage === 'personal-care' && (
          <PersonalCarePage
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            products={products}
            settings={settings}
            content={pagesContent.personalCare}
          />
        )}

        {currentPage === 'home-care' && (
          <HomeCarePage
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            cartProductIds={cartProductIds}
            products={products}
            settings={settings}
            content={pagesContent.homeCare}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={setCurrentPage}
            content={pagesContent.about}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
            content={pagesContent.contact}
          />
        )}

        {currentPage === 'admin' && (
          !isAdminAuthenticated ? (
            <AdminLoginPage
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
              onNavigate={setCurrentPage}
            />
          ) : (
            <AdminPage
              products={products}
              categories={categories}
              settings={settings}
              pagesContent={pagesContent}
              seoSettings={seoSettings}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetCatalog={handleResetCatalog}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onUpdateSettings={handleUpdateSettings}
              onUpdatePagesContent={handleUpdatePagesContent}
              onResetPagesContent={handleResetPagesContent}
              onNavigate={setCurrentPage}
              onQuickView={handleOpenQuickView}
              onLogout={() => {
                api.logout();
                setIsAdminAuthenticated(false);
              }}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
        settings={settings}
        content={pagesContent.global}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton settings={settings} />

      {/* Floating Admin Quick Edit Toolbar (Visible only when logged in as admin/subadmin browsing public pages) */}
      {isAdminAuthenticated && (
        <AdminQuickEditBar
          isAdmin={isAdminAuthenticated}
          currentPage={currentPage}
          onOpenPageEditor={() => setIsLiveEditorOpen(true)}
          onNavigate={setCurrentPage}
          onLogout={() => {
            api.logout();
            setIsAdminAuthenticated(false);
          }}
        />
      )}

      {/* Live Page Editor Modal (Launched from Quick Edit Bar) */}
      {isAdminAuthenticated && (
        <PageEditorModal
          isOpen={isLiveEditorOpen}
          onClose={() => setIsLiveEditorOpen(false)}
          targetPage={currentPage}
          pagesContent={pagesContent}
          onSave={handleUpdatePagesContent}
          onResetToDefault={handleResetPagesContent}
        />
      )}

      {/* WhatsApp Cart & Multi-Item Order Modal */}
      <WhatsAppCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onBrowseProducts={() => {
          setIsCartOpen(false);
          setCurrentPage('personal-care');
        }}
        whatsappPhone={settings.phoneRaw}
      />

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        whatsappPhone={settings.phoneRaw}
      />

    </div>
  );
}
