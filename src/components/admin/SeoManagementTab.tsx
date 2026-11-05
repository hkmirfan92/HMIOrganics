import React, { useState, useEffect } from 'react';
import { SiteSeoSettings, Product, PageId, ProductSeoConfig } from '../../types';
import { api } from '../../services/api';
import { DEFAULT_SEO_SETTINGS } from '../../data/seoContent';
import { ALL_PRODUCTS } from '../../data/products';
import {
  Search,
  Globe,
  Share2,
  Code2,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Eye,
  Layers,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface SeoManagementTabProps {
  seoSettings?: SiteSeoSettings;
  products?: Product[];
  onSave?: (updated: Partial<SiteSeoSettings>) => Promise<void>;
  onReset?: () => Promise<void>;
  onNotify?: (msg: string) => void;
}

export const SeoManagementTab: React.FC<SeoManagementTabProps> = ({
  seoSettings,
  products = ALL_PRODUCTS,
  onSave,
  onReset,
  onNotify,
}) => {
  const [formData, setFormData] = useState<SiteSeoSettings>(seoSettings || DEFAULT_SEO_SETTINGS);
  const [activeSubTab, setActiveSubTab] = useState<'global' | 'pages' | 'products' | 'schema'>('global');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'hair-growth-oil');
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (seoSettings) {
      setFormData(seoSettings);
    } else {
      api.getSeo().then((s) => setFormData(s)).catch(() => {});
    }
  }, [seoSettings]);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const productOverride: Partial<ProductSeoConfig> = selectedProduct ? (formData.productOverrides[selectedProduct.id] || {}) : {};

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    if (onNotify) onNotify(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      if (onSave) {
        await onSave(formData);
      } else {
        await api.updateSeo(formData);
      }
      showSuccess('SEO settings published! Meta tags and Schema.org rich snippets updated.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update SEO settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to restore default SEO and social metadata?')) return;
    setIsSaving(true);
    try {
      if (onReset) {
        await onReset();
      } else {
        const res = await api.resetSeo();
        setFormData(res);
      }
      showSuccess('SEO settings restored to factory defaults.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset.');
    } finally {
      setIsSaving(false);
    }
  };

  // Live preview helpers
  const currentPreviewTitle =
    activeSubTab === 'products' && selectedProduct
      ? productOverride.customTitle || `${selectedProduct.name} — HMI Organics Herbal Care`
      : activeSubTab === 'pages' && formData.pages[selectedPageKey]
      ? formData.pages[selectedPageKey].title
      : formData.siteTitle;

  const currentPreviewDesc =
    activeSubTab === 'products' && selectedProduct
      ? productOverride.customDescription || selectedProduct.description
      : activeSubTab === 'pages' && formData.pages[selectedPageKey]
      ? formData.pages[selectedPageKey].description
      : formData.siteDescription;

  const currentPreviewUrl =
    activeSubTab === 'products' && selectedProduct
      ? `https://hmiorganics.com/product/${selectedProduct.id}`
      : activeSubTab === 'pages'
      ? `https://hmiorganics.com/${selectedPageKey === 'home' ? '' : selectedPageKey}`
      : formData.canonicalBaseUrl;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Feedback */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Banner / Intro */}
      <div className="bg-gradient-to-r from-[#173824] to-[#255C3A] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-[#2D6442] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#98EAB0]">
            <Search className="w-4 h-4" />
            <span>Search Engine Optimization & Social Sharing</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            SEO Studio & Rich Snippet Controls
          </h2>
          <p className="text-xs sm:text-sm text-[#D0EADB] leading-relaxed">
            Customize search engine titles, OpenGraph social cards for WhatsApp/Facebook, per-product Google keywords, and automated Schema.org structured data in Pakistani Rupees (PKR).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#D8EADB] text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish SEO'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Google & WhatsApp Live Simulator Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-display font-bold text-sm text-[#183925]">
              Live Search Engine Result Preview (SERP)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Simulating Google Search & WhatsApp Preview
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Google Preview */}
          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-slate-200 space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold">H</span>
              <span className="truncate max-w-[280px]">{currentPreviewUrl}</span>
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-base sm:text-lg text-[#1a0dab] hover:underline font-medium line-clamp-1 block leading-snug"
            >
              {currentPreviewTitle}
            </a>
            <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
              {currentPreviewDesc}
            </p>
          </div>

          {/* WhatsApp / Social Card Preview */}
          <div className="p-4 bg-[#F2F7F3] rounded-2xl border border-[#CDE3D2] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#183925]">
              <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp / Social Media Share Preview</span>
            </div>
            <div className="bg-white rounded-xl overflow-hidden border border-[#D5E5D8] shadow-xs">
              <div className="h-28 bg-[#183925] flex items-center justify-center text-white relative overflow-hidden">
                <img
                  src={formData.ogImageUrl || '/hero-botanical-banner.jpg'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/hero-botanical-banner.jpg')) {
                      target.src = '/hero-botanical-banner.jpg';
                    }
                  }}
                  alt="Social preview"
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-white font-mono">
                  hmiorganics.com
                </span>
              </div>
              <div className="p-3 space-y-1 bg-white">
                <p className="font-bold text-xs text-slate-800 line-clamp-1">
                  {currentPreviewTitle}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                  {currentPreviewDesc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-[#FAFDFB] p-1.5 rounded-2xl border border-[#DFE7E1] flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'global', label: '🌐 Global SEO & Social Cards', icon: Globe },
          { id: 'pages', label: '📑 Page-by-Page SEO', icon: Layers },
          { id: 'products', label: '🛍️ Per-Product Search Keywords', icon: Search },
          { id: 'schema', label: '⚙️ Schema.org & Verification', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#183925] text-white shadow-xs font-bold'
                  : 'text-[#2C5E43] hover:bg-[#EEF5EF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. GLOBAL SEO TAB */}
      {/* ============================================================ */}
      {activeSubTab === 'global' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="font-display font-bold text-base text-[#183925]">
              Global Website Meta & Branding
            </h3>
            <p className="text-[11px] text-slate-500">
              Default metadata rendered across all site pages when specific overrides are not present
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">Site Title Tag (&lt;title&gt;)</label>
                <span className={`text-[10px] font-mono ${formData.siteTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {formData.siteTitle.length} / 60 characters recommended
                </span>
              </div>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none font-medium"
                placeholder="e.g. HMI Organics — Pure Herbal Care & Eco Products"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">Meta Description (&lt;meta name="description"&gt;)</label>
                <span className={`text-[10px] font-mono ${formData.siteDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {formData.siteDescription.length} / 160 characters recommended
                </span>
              </div>
              <textarea
                rows={2}
                value={formData.siteDescription}
                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                placeholder="Compelling 1-2 sentence description with call-to-action"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-700">Global Keywords (Comma-Separated)</label>
              <textarea
                rows={2}
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                placeholder="organic products Pakistan, herbal shampoo, hair growth oil Pakistan, eco cleaner..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Canonical Base URL</label>
              <input
                type="text"
                value={formData.canonicalBaseUrl}
                onChange={(e) => setFormData({ ...formData, canonicalBaseUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                placeholder="https://hmiorganics.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">OpenGraph Site Name (og:site_name)</label>
              <input
                type="text"
                value={formData.ogSiteName}
                onChange={(e) => setFormData({ ...formData, ogSiteName: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Social Share Image URL (og:image / 1200x630)</label>
              <input
                type="text"
                value={formData.ogImageUrl}
                onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Twitter / X Creator Handle</label>
              <input
                type="text"
                value={formData.twitterHandle}
                onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                placeholder="@hmiorganicspk"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. PAGE-BY-PAGE SEO */}
      {/* ============================================================ */}
      {activeSubTab === 'pages' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="font-display font-bold text-base text-[#183925]">
              Page-Specific Meta Tags
            </h3>
            <p className="text-[11px] text-slate-500">
              Give each page a dedicated, keyword-optimized title and description for search engines
            </p>
          </div>

          {/* Page Selector Pill Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-[#F2F7F3] rounded-2xl overflow-x-auto">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'personal-care', label: 'Personal Care' },
              { id: 'home-care', label: 'Home & Car Care' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact Us' },
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPageKey(page.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPageKey === page.id
                    ? 'bg-white text-[#183925] shadow-xs font-bold'
                    : 'text-[#3E614A] hover:text-[#183925]'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {formData.pages[selectedPageKey] && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">
                    {selectedPageKey.toUpperCase()} Page Title
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {formData.pages[selectedPageKey].title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.pages[selectedPageKey].title}
                  onChange={(e) => {
                    const updatedPages = { ...formData.pages };
                    updatedPages[selectedPageKey] = {
                      ...updatedPages[selectedPageKey],
                      title: e.target.value,
                    };
                    setFormData({ ...formData, pages: updatedPages });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Page Meta Description</label>
                  <span className="text-[10px] text-slate-400">
                    {formData.pages[selectedPageKey].description.length} chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={formData.pages[selectedPageKey].description}
                  onChange={(e) => {
                    const updatedPages = { ...formData.pages };
                    updatedPages[selectedPageKey] = {
                      ...updatedPages[selectedPageKey],
                      description: e.target.value,
                    };
                    setFormData({ ...formData, pages: updatedPages });
                  }}
                  className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Page Keywords</label>
                <input
                  type="text"
                  value={formData.pages[selectedPageKey].keywords}
                  onChange={(e) => {
                    const updatedPages = { ...formData.pages };
                    updatedPages[selectedPageKey] = {
                      ...updatedPages[selectedPageKey],
                      keywords: e.target.value,
                    };
                    setFormData({ ...formData, pages: updatedPages });
                  }}
                  className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Page Canonical URL</label>
                  <input
                    type="text"
                    value={formData.pages[selectedPageKey].canonicalUrl || ''}
                    onChange={(e) => {
                      const updatedPages = { ...formData.pages };
                      updatedPages[selectedPageKey] = {
                        ...updatedPages[selectedPageKey],
                        canonicalUrl: e.target.value,
                      };
                      setFormData({ ...formData, pages: updatedPages });
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Social Share Image (OG Image)</label>
                  <input
                    type="text"
                    value={formData.pages[selectedPageKey].ogImage || ''}
                    onChange={(e) => {
                      const updatedPages = { ...formData.pages };
                      updatedPages[selectedPageKey] = {
                        ...updatedPages[selectedPageKey],
                        ogImage: e.target.value,
                      };
                      setFormData({ ...formData, pages: updatedPages });
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.pages[selectedPageKey].noIndex)}
                    onChange={(e) => {
                      const updatedPages = { ...formData.pages };
                      updatedPages[selectedPageKey] = {
                        ...updatedPages[selectedPageKey],
                        noIndex: e.target.checked,
                      };
                      setFormData({ ...formData, pages: updatedPages });
                    }}
                    className="w-4 h-4 text-[#1B4D2E] rounded border-slate-300 focus:ring-[#1B4D2E]"
                  />
                  <span className="font-medium text-slate-700">
                    Hide this page from search engine indexes (noindex, nofollow)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. PER-PRODUCT SEO */}
      {/* ============================================================ */}
      {activeSubTab === 'products' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="font-display font-bold text-base text-[#183925]">
              Product Search Keyword & SERP Overrides
            </h3>
            <p className="text-[11px] text-slate-500">
              Optimize search result rankings for individual herbal grooming and eco home care products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="font-semibold text-slate-700 whitespace-nowrap">
              Select Product to Optimize:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none font-semibold text-[#183925]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.customEmoji || '🌿'} {p.name} ({p.category === 'personal-care' ? 'Personal' : 'Home'} · PKR {p.pricePkr})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="p-5 bg-[#FAFDFB] rounded-2xl border border-[#DFE7E1] space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedProduct.customEmoji || '🌿'}</span>
                <div>
                  <h4 className="font-bold text-sm text-[#143721]">{selectedProduct.name}</h4>
                  <p className="text-[11px] text-slate-500">{selectedProduct.tagline}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Custom Google SEO Title</label>
                <input
                  type="text"
                  value={productOverride.customTitle || ''}
                  onChange={(e) => {
                    const newOverrides = { ...formData.productOverrides };
                    newOverrides[selectedProduct.id] = {
                      ...(newOverrides[selectedProduct.id] || { productId: selectedProduct.id }),
                      customTitle: e.target.value,
                    };
                    setFormData({ ...formData, productOverrides: newOverrides });
                  }}
                  className="w-full px-3.5 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  placeholder={`${selectedProduct.name} (100% Herbal) | HMI Organics Pakistan`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Custom Search Meta Description</label>
                <textarea
                  rows={2}
                  value={productOverride.customDescription || ''}
                  onChange={(e) => {
                    const newOverrides = { ...formData.productOverrides };
                    newOverrides[selectedProduct.id] = {
                      ...(newOverrides[selectedProduct.id] || { productId: selectedProduct.id }),
                      customDescription: e.target.value,
                    };
                    setFormData({ ...formData, productOverrides: newOverrides });
                  }}
                  className="w-full px-3.5 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  placeholder="Custom search description highlighting benefits and WhatsApp order call-to-action"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Target Focus Search Keyword</label>
                <input
                  type="text"
                  value={productOverride.focusKeyword || ''}
                  onChange={(e) => {
                    const newOverrides = { ...formData.productOverrides };
                    newOverrides[selectedProduct.id] = {
                      ...(newOverrides[selectedProduct.id] || { productId: selectedProduct.id }),
                      focusKeyword: e.target.value,
                    };
                    setFormData({ ...formData, productOverrides: newOverrides });
                  }}
                  className="w-full px-3.5 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  placeholder="e.g. hair growth oil Pakistan, eco kitchen degreaser"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SCHEMA.ORG & WEBMASTER VERIFICATION */}
      {/* ============================================================ */}
      {activeSubTab === 'schema' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="font-display font-bold text-base text-[#183925]">
              Schema.org JSON-LD Structured Data & Search Console Verification
            </h3>
            <p className="text-[11px] text-slate-500">
              Provide search engines with structured machine-readable product data, pricing, and verify ownership
            </p>
          </div>

          <div className="p-4 bg-[#F2F7F3] rounded-2xl border border-[#CDE3D2] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-[#183925] block">
                Enable Automated JSON-LD Rich Snippets
              </span>
              <span className="text-[11px] text-[#42654D] block">
                Generates Schema.org Store and Product entities with price in PKR and InStock status
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.enableJsonLd}
                onChange={(e) => setFormData({ ...formData, enableJsonLd: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
            </label>
          </div>

          {/* Google Search Console & XML Sitemap Card */}
          <div className="p-5 bg-[#F2F7F3] rounded-2xl border border-[#CDE3D2] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-[#183925] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#1B4D2E]" />
                  Google Search Console & XML Sitemap Integration
                </span>
                <span className="text-[11px] text-[#42654D]">
                  Verify site ownership on Google Search Console and submit your auto-generated XML Sitemap for faster indexing.
                </span>
              </div>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4D2E] text-white font-bold rounded-xl text-[11px] hover:bg-[#153D24] transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>Google Search Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Sitemap & Robots Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-[#D5E5D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">XML Sitemap</span>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[#1B4D2E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>/sitemap.xml</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/sitemap.xml`;
                    navigator.clipboard.writeText(fullUrl);
                    showSuccess('Sitemap URL copied to clipboard: ' + fullUrl);
                  }}
                  className="px-2.5 py-1 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Copy URL
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#D5E5D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Robots Directives</span>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[#1B4D2E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>/robots.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/robots.txt`;
                    navigator.clipboard.writeText(fullUrl);
                    showSuccess('Robots URL copied to clipboard: ' + fullUrl);
                  }}
                  className="px-2.5 py-1 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Copy URL
                </button>
              </div>
            </div>

            {/* Urdu & English Instructions */}
            <div className="p-3 bg-white/70 rounded-xl border border-[#DFECE2] text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-[#183925]">
                گوگل سرچ کنسول میں سائٹ ویری فائی کرنے کا طریقہ (Google Verification Guide):
              </p>
              <p className="leading-relaxed">
                1. Google Search Console میں اپنی ویب سائٹ کا ڈومین ایڈ کریں۔<br />
                2. HTML Tag ویری فکیشن سلیکٹ کر کے کوڈ کاپی کریں اور نیچے "Google Search Console Verification Tag" فیلڈ میں پیسٹ کریں۔<br />
                3. Save Settings پر کلک کرنے کے بعد Google پر Verify بٹن دبائیں۔<br />
                4. Sitemaps سیکشن میں جا کر <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">sitemap.xml</code> درج کریں اور Submit کریں۔
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Google Search Console Verification Tag</label>
              <input
                type="text"
                value={formData.googleVerificationCode}
                onChange={(e) => setFormData({ ...formData, googleVerificationCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none font-mono"
                placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXX"
              />
              <span className="text-[10px] text-slate-400">
                Pasted value will be injected as &lt;meta name="google-site-verification"&gt; in &lt;head&gt;
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bing Webmaster Tools Code</label>
              <input
                type="text"
                value={formData.bingVerificationCode || ''}
                onChange={(e) => setFormData({ ...formData, bingVerificationCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none font-mono"
                placeholder="bing-verification-code"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Organization Name (Schema.org)</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Organization Logo Path (Schema.org)</label>
              <input
                type="text"
                value={formData.organizationLogo}
                onChange={(e) => setFormData({ ...formData, organizationLogo: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#FAFDFB] border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
