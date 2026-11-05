import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, BrandSettings, PageId, SitePagesContent, AdminRole, SiteSeoSettings } from '../types';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { SettingsModal } from '../components/admin/SettingsModal';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal';
import { PageEditorModal } from '../components/admin/PageEditorModal';
import { SeoManagementTab } from '../components/admin/SeoManagementTab';
import { AnalyticsDashboardTab } from '../components/admin/AnalyticsDashboardTab';
import { SubadminManagementTab } from '../components/admin/SubadminManagementTab';
import { BrandingManagementTab } from '../components/admin/BrandingManagementTab';
import { api } from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Settings,
  RotateCcw,
  Sparkles,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ArrowLeft,
  LogOut,
  KeyRound,
  ShieldCheck,
  FileText,
  Layers,
  ArrowUpRight,
  TrendingUp,
  SearchCheck,
  Users,
  Shield,
  Lock,
  Globe,
  ExternalLink,
  Download,
  HardDriveDownload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminPageProps {
  products: Product[];
  settings: BrandSettings;
  pagesContent: SitePagesContent;
  seoSettings?: SiteSeoSettings;
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onResetCatalog: () => Promise<void>;
  onUpdateSettings: (settings: Partial<BrandSettings>) => Promise<void>;
  onUpdatePagesContent: (pages: Partial<SitePagesContent>) => Promise<void>;
  onResetPagesContent: () => Promise<void>;
  onNavigate: (page: PageId) => void;
  onQuickView: (product: Product) => void;
  onLogout: () => void;
}

type AdminMainTab = 'catalog' | 'pages' | 'branding' | 'seo' | 'analytics' | 'subadmins';

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  settings,
  pagesContent,
  seoSettings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onUpdateSettings,
  onUpdatePagesContent,
  onResetPagesContent,
  onNavigate,
  onQuickView,
  onLogout,
}) => {
  const currentRole: AdminRole = api.getRole();
  const currentUser = api.getUser();
  const isSuperAdmin = currentRole === 'super_admin';

  // Navigation tab in Admin Portal
  const [activeTab, setActiveTab] = useState<AdminMainTab>('catalog');

  // Search & Filters for Catalog Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'personal-care' | 'home-care' | 'bestsellers' | 'visible' | 'hidden'>('all');
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPageEditorModalOpen, setIsPageEditorModalOpen] = useState(false);
  const [pageEditorTarget, setPageEditorTarget] = useState<PageId | 'global'>('home');
  
  // Confirmation state for deleting
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered list for Catalog tab
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyIngredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (selectedFilter === 'personal-care') matchesFilter = p.category === 'personal-care';
      if (selectedFilter === 'home-care') matchesFilter = p.category === 'home-care';
      if (selectedFilter === 'bestsellers') matchesFilter = Boolean(p.isBestseller);
      if (selectedFilter === 'visible') matchesFilter = p.isVisible !== false;
      if (selectedFilter === 'hidden') matchesFilter = p.isVisible === false;

      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, selectedFilter]);

  // Statistics
  const personalCareCount = products.filter((p) => p.category === 'personal-care').length;
  const homeCareCount = products.filter((p) => p.category === 'home-care').length;
  const bestsellerCount = products.filter((p) => p.isBestseller).length;
  const hiddenCount = products.filter((p) => p.isVisible === false).length;
  const visibleCount = products.filter((p) => p.isVisible !== false).length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleToggleVisibility = async (product: Product) => {
    const nextVisibility = product.isVisible === false ? true : false;
    await onUpdateProduct(product.id, { isVisible: nextVisibility });
    showToast(
      nextVisibility
        ? `"${product.name}" is now visible to customers in store listing`
        : `"${product.name}" is now hidden from public store listing`
    );
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, productData);
      showToast(`Updated "${productData.name}" successfully`);
    } else {
      await onAddProduct(productData);
      showToast(`Created new product "${productData.name}"`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    await onDeleteProduct(productToDelete.id);
    setProductToDelete(null);
    showToast(`Deleted "${name}"`);
  };

  const handleConfirmReset = async () => {
    await onResetCatalog();
    setIsResetConfirmOpen(false);
    showToast('Catalog and settings reset to standard defaults');
  };

  const openPageEditor = (target: PageId | 'global') => {
    setPageEditorTarget(target);
    setIsPageEditorModalOpen(true);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadWebsiteZip = async () => {
    try {
      setIsExporting(true);
      showToast('Generating complete website backup archive (.ZIP)...');
      await fetch('/api/system/generate-backup', { method: 'POST' }).catch(() => {});
      const link = document.createElement('a');
      link.href = '/api/system/download-backup';
      link.setAttribute('download', 'hmi-organics-website-codebase.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Website ZIP downloaded! Save and extract on your computer.');
    } catch {
      window.location.href = '/hmi-organics-complete-code.zip';
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#163824] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#2D603F] text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#8CE39E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Bar */}
      <section className="bg-gradient-to-r from-[#173827] via-[#1E4A35] to-[#255C41] text-white py-8 border-b border-[#2C6346]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#98EAB0]">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Store Management Portal</span>
                <span className="text-white/40">·</span>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#143721] text-[#98EAB0] border border-[#356B48]">
                    <ShieldCheck className="w-3 h-3" />
                    Super Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    <Shield className="w-3 h-3" />
                    Product Manager (Subadmin)
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                HMI Organics Control Center
              </h1>
              <p className="text-xs sm:text-sm text-[#D0EADB] max-w-xl">
                {isSuperAdmin
                  ? `Welcome, ${currentUser?.name || 'Admin'}. Full root authority over product catalog, frontend pages, SEO metadata, analytics, and subadmin managers.`
                  : `Welcome, ${currentUser?.name || 'Staff'}. You have dedicated permissions to manage the product catalog (add, edit, and delete products).`}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Live Website</span>
              </button>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl border border-white/25 transition-all cursor-pointer"
                title="Change your login password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl border border-white/25 transition-all cursor-pointer"
                  title="Store Contact & Delivery Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Store Settings</span>
                </button>
              )}

              {/* Download Codebase Button */}
              <button
                onClick={handleDownloadWebsiteZip}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl border border-emerald-400/40 transition-all cursor-pointer shadow-sm"
                title="Download entire website codebase (.ZIP) to save on your computer"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <HardDriveDownload className="w-3.5 h-3.5 text-emerald-200" />
                )}
                <span>Download Website (ZIP)</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BC59] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl border border-rose-500/40 transition-all cursor-pointer"
                title="Sign out from Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Subadmin Scope Notice if logged in as product_manager */}
          {!isSuperAdmin && (
            <div className="bg-amber-900/30 border border-amber-400/30 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-100">
              <Shield className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>Subadmin Scope Active:</strong> You are signed in as a Product Manager. You have full access to add, edit, and delete products in the catalog. Frontend page content, SEO settings, analytics, and team credentials are strictly protected by the Super Admin.
              </span>
            </div>
          )}

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/20 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#163824] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Products Catalog ({products.length})</span>
            </button>

            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'pages'
                      ? 'bg-white text-[#163824] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Frontend Pages</span>
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'branding'
                      ? 'bg-white text-[#163824] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Branding & Images</span>
                </button>

                <button
                  onClick={() => setActiveTab('seo')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'seo'
                      ? 'bg-white text-[#163824] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <SearchCheck className="w-3.5 h-3.5" />
                  <span>SEO Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-white text-[#163824] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Store Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('subadmins')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'subadmins'
                      ? 'bg-white text-[#163824] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Subadmin Managers</span>
                </button>
              </>
            )}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* TAB 1: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* KPI Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Catalog</span>
                <span className="text-2xl font-extrabold text-[#143721] tabular-nums">{products.length}</span>
                <span className="text-[10px] text-slate-400 block">Total registered items</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-[#2C5E43] uppercase tracking-wider block">Personal Care</span>
                <span className="text-2xl font-extrabold text-[#2C5E43] tabular-nums">{personalCareCount}</span>
                <span className="text-[10px] text-slate-400 block">Hair, Skin & Oral</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-[#8C6D2B] uppercase tracking-wider block">Home & Car Care</span>
                <span className="text-2xl font-extrabold text-[#8C6D2B] tabular-nums">{homeCareCount}</span>
                <span className="text-[10px] text-slate-400 block">Cleaners, Polish & Wash</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
                <span className="text-[11px] font-semibold text-[#B87A24] uppercase tracking-wider block">Bestsellers</span>
                <span className="text-2xl font-extrabold text-[#B87A24] tabular-nums">{bestsellerCount}</span>
                <span className="text-[10px] text-slate-400 block">Featured on home</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">Listing Status</span>
                  {hiddenCount > 0 ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="text-xl font-extrabold text-[#143721] flex items-center gap-1.5 tabular-nums">
                  <span className="text-emerald-700">{visibleCount} live</span>
                  {hiddenCount > 0 && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                      {hiddenCount} hidden
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {hiddenCount === 0 ? 'All products visible' : `${hiddenCount} hidden from store`}
                </span>
              </div>
            </div>

            {/* Toolbar: Search, Filters, Reset */}
            <div className="bg-white p-4 rounded-2xl border border-[#DFE7E1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Segmented Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F2F6F3] rounded-xl overflow-x-auto">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-white text-[#1B4D2E] shadow-2xs font-bold'
                      : 'text-[#4A6854] hover:text-[#1B4D2E]'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('personal-care')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === 'personal-care'
                      ? 'bg-white text-[#1B4D2E] shadow-2xs font-bold'
                      : 'text-[#4A6854] hover:text-[#1B4D2E]'
                  }`}
                >
                  Personal Care ({personalCareCount})
                </button>
                <button
                  onClick={() => setSelectedFilter('home-care')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === 'home-care'
                      ? 'bg-white text-[#1B4D2E] shadow-2xs font-bold'
                      : 'text-[#4A6854] hover:text-[#1B4D2E]'
                  }`}
                >
                  Home Care ({homeCareCount})
                </button>
                <button
                  onClick={() => setSelectedFilter('bestsellers')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === 'bestsellers'
                      ? 'bg-white text-[#1B4D2E] shadow-2xs font-bold'
                      : 'text-[#4A6854] hover:text-[#1B4D2E]'
                  }`}
                >
                  Bestsellers ({bestsellerCount})
                </button>
                <button
                  onClick={() => setSelectedFilter('visible')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter === 'visible'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-[#4A6854] hover:text-[#1B4D2E]'
                  }`}
                >
                  <Eye className="w-3 h-3 text-emerald-600" />
                  <span>Visible ({visibleCount})</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('hidden')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedFilter === 'hidden'
                      ? 'bg-white text-amber-800 shadow-2xs font-bold'
                      : 'text-amber-800/80 hover:text-amber-900'
                  }`}
                >
                  <EyeOff className="w-3 h-3 text-amber-600" />
                  <span>Hidden ({hiddenCount})</span>
                </button>
              </div>

              {/* Search + Reset catalog */}
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>

                {isSuperAdmin && (
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Reset catalog to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {/* Product Table View */}
            <div className="bg-white rounded-2xl border border-[#DFE7E1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#F8FAF8] border-b border-[#E1EDE4] text-[11px] font-bold uppercase tracking-wider text-[#355B42]">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Size/Volume</th>
                      <th className="py-3.5 px-4">Retail Price</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const isPersonal = product.category === 'personal-care';
                        const isHidden = product.isVisible === false;

                        return (
                          <tr
                            key={product.id}
                            className={`transition-colors ${
                              isHidden
                                ? 'bg-amber-50/30 hover:bg-amber-50/50'
                                : 'hover:bg-[#F9FCFA]'
                            }`}
                          >
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-[#DFE7E1] shrink-0"
                                    onError={(e) => {
                                      // Fallback on broken image
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-[#F0F6F2] border border-[#DFE7E1] flex items-center justify-center text-lg shrink-0">
                                    {product.customEmoji || (isPersonal ? '🌿' : '✨')}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 block">{product.name}</span>
                                    {isHidden && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 border border-amber-200 px-1.5 py-0.2 rounded-md">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 line-clamp-1">{product.tagline}</span>
                                </div>
                              </div>
                            </td>

                            {/* Category Badge */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPersonal
                                    ? 'bg-[#EAF3EE] text-[#1B4D2E]'
                                    : 'bg-[#F9F4EB] text-[#8C6D2B]'
                                }`}
                              >
                                {isPersonal ? 'Personal Care' : 'Home Care'}
                              </span>
                            </td>

                            {/* Volume */}
                            <td className="py-3.5 px-4 text-slate-600 font-medium">
                              {product.volumeOrWeight}
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4">
                              {product.pricePkr ? (
                                <span className="font-bold text-[#143721]">Rs. {product.pricePkr}</span>
                              ) : (
                                <span className="text-slate-400 italic">Call for price</span>
                              )}
                            </td>

                            {/* Status (Visibility & Bestseller) */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1 items-start">
                                {isHidden ? (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100/80 text-amber-800 border border-amber-300"
                                    title="Hidden from public customers"
                                  >
                                    <EyeOff className="w-3 h-3 text-amber-600 shrink-0" />
                                    <span>Hidden</span>
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    title="Active on public catalog"
                                  >
                                    <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Listed</span>
                                  </span>
                                )}

                                {product.isBestseller && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    <span>Bestseller</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions with Quick Show/Hide Toggle */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick Toggle Show/Hide Button */}
                                <button
                                  onClick={() => handleToggleVisibility(product)}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isHidden
                                      ? 'text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200'
                                      : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                                  }`}
                                  title={
                                    isHidden
                                      ? 'Currently Hidden from public website. Click to Show.'
                                      : 'Currently Listed on public website. Click to Hide.'
                                  }
                                >
                                  {isHidden ? (
                                    <EyeOff className="w-4 h-4 text-amber-700" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-emerald-700" />
                                  )}
                                </button>

                                <button
                                  onClick={() => onQuickView(product)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Quick View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(product)}
                                  className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FRONTEND PAGES CONTENT (SUPER ADMIN ONLY) */}
        {activeTab === 'pages' && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DFE7E1] shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
                  <FileText className="w-4 h-4 text-[#2C5E43]" />
                  <span>Frontend Pages Content Editor</span>
                </div>
                <h2 className="text-xl font-bold text-[#143721]">
                  Edit Live Website Text, Banners & Guarantees
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Update headlines, slogans, guarantee badges, and category subtitles on any frontend page without modifying source code.
                </p>
              </div>

              <button
                onClick={async () => {
                  if (confirm('Reset all frontend pages content to brand defaults?')) {
                    await onResetPagesContent();
                    showToast('Frontend pages reset to default brand copy');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Pages</span>
              </button>
            </div>

            {/* Grid of Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Home Page Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2C5E43] font-bold text-xs flex items-center justify-center">
                    🏠
                  </span>
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#2C5E43] flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Home Page</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    Hero headline, subtitle, Shop Now call-to-action, trust guarantees, and value pillars.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('home')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Home Page Content</span>
                </button>
              </div>

              {/* Personal Care Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2C5E43] font-bold text-xs flex items-center justify-center">
                    🌿
                  </span>
                  <button
                    onClick={() => onNavigate('personal-care')}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#2C5E43] flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Personal Care Page</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    Banner header, tagline, herbal formulations guarantee, and purity badge descriptions.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('personal-care')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Personal Care Content</span>
                </button>
              </div>

              {/* Home & Car Care Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-[#8C6D2B] font-bold text-xs flex items-center justify-center">
                    ✨
                  </span>
                  <button
                    onClick={() => onNavigate('home-care')}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#2C5E43] flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Home & Car Care Page</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    High-efficiency cleaners header, bio-degreasers tagline, and performance highlight banners.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('home-care')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Home & Car Care Content</span>
                </button>
              </div>

              {/* About Us Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2C5E43] font-bold text-xs flex items-center justify-center">
                    📖
                  </span>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#2C5E43] flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">About Us Page</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    Brand founding story, organic mission, safe formulation principles, and our promise.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('about')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit About Us Content</span>
                </button>
              </div>

              {/* Contact Us Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2C5E43] font-bold text-xs flex items-center justify-center">
                    📞
                  </span>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#2C5E43] flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Contact Us Page</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    WhatsApp direct order link, helpline numbers, email address, and customer inquiry copy.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('contact')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Contact Us Content</span>
                </button>
              </div>

              {/* Global Announcement Bar Card */}
              <div className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs space-y-4 hover:border-[#2C5E43]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2C5E43] font-bold text-xs flex items-center justify-center">
                    📢
                  </span>
                  <span className="text-[10px] font-bold text-[#2C5E43] bg-[#E8F3EC] px-2 py-0.5 rounded-full">
                    Site-Wide Banner
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Global Top Announcement Bar</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    The top green announcement strip visible across all pages and footer brand notices.
                  </p>
                </div>
                <button
                  onClick={() => openPageEditor('global')}
                  className="w-full py-2 px-3 bg-[#F2F6F3] hover:bg-[#E1EBE4] text-[#1D4A2F] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Top Announcement</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB: BRANDING & MEDIA ASSETS (SUPER ADMIN ONLY) */}
        {activeTab === 'branding' && isSuperAdmin && (
          <BrandingManagementTab
            settings={settings}
            pagesContent={pagesContent}
            seoSettings={seoSettings}
            onUpdateSettings={onUpdateSettings}
            onUpdatePagesContent={onUpdatePagesContent}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {/* TAB 3: SEO STUDIO (SUPER ADMIN ONLY) */}
        {activeTab === 'seo' && isSuperAdmin && (
          <SeoManagementTab onNotify={(msg) => showToast(msg)} />
        )}

        {/* TAB 4: STORE ANALYTICS (SUPER ADMIN ONLY) */}
        {activeTab === 'analytics' && isSuperAdmin && (
          <AnalyticsDashboardTab onNotify={(msg) => showToast(msg)} />
        )}

        {/* TAB 5: SUBADMIN MANAGERS (SUPER ADMIN ONLY) */}
        {activeTab === 'subadmins' && isSuperAdmin && (
          <SubadminManagementTab onNotify={(msg) => showToast(msg)} />
        )}

      </section>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      {/* Store Settings Modal */}
      {isSuperAdmin && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={settings}
          onSaveSettings={async (newSettings) => {
            await onUpdateSettings(newSettings);
            showToast('Store settings updated successfully');
          }}
        />
      )}

      {/* Page Live Content Editor Modal */}
      {isSuperAdmin && (
        <PageEditorModal
          isOpen={isPageEditorModalOpen}
          onClose={() => setIsPageEditorModalOpen(false)}
          targetPage={pageEditorTarget}
          pagesContent={pagesContent}
          onSave={async (newContent) => {
            await onUpdatePagesContent(newContent);
            showToast('Page content updated successfully');
          }}
          onResetToDefault={async () => {
            await onResetPagesContent();
            showToast('Page content restored to brand defaults');
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Delete "{productToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-500">
                This item will be permanently removed from your catalog and store pages.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Reset Catalog to Factory Defaults?
              </h3>
              <p className="text-xs text-slate-500">
                This will restore the original 13 curated Personal Care and Home Care items and reset brand settings.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1B4D2E] hover:bg-[#153D24] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

    </div>
  );
};
