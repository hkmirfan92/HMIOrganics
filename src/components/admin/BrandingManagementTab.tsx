import React, { useState } from 'react';
import { BrandSettings, SitePagesContent, SiteSeoSettings } from '../../types';
import { api } from '../../services/api';
import { BrandLogo } from '../BrandLogo';
import {
  Image,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Eye,
  Layers,
  Globe,
  Loader2,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface BrandingManagementTabProps {
  settings: BrandSettings;
  pagesContent: SitePagesContent;
  seoSettings?: SiteSeoSettings;
  onUpdateSettings: (newSettings: Partial<BrandSettings>) => Promise<void>;
  onUpdatePagesContent: (newPages: Partial<SitePagesContent>) => Promise<void>;
  onNotify?: (msg: string) => void;
}

export const BrandingManagementTab: React.FC<BrandingManagementTabProps> = ({
  settings,
  pagesContent,
  seoSettings,
  onUpdateSettings,
  onUpdatePagesContent,
  onNotify,
}) => {
  // Form States
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || '/favicon.png');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '/assets/aistudio/IMG-20261007-WA0000-Photoroom_407330cc.png');
  
  // Page Banners
  const [heroImageUrl, setHeroImageUrl] = useState(pagesContent.home.heroImageUrl || '/hero-botanical-banner.jpg');
  const [personalCareImageUrl, setPersonalCareImageUrl] = useState(pagesContent.personalCare.imageUrl || '/personal-care-banner.jpg');
  const [homeCareImageUrl, setHomeCareImageUrl] = useState(pagesContent.homeCare.imageUrl || '/home-cleaning-banner.jpg');
  const [aboutStoryImageUrl, setAboutStoryImageUrl] = useState(pagesContent.about.storyImageUrl || '/about-craftsmanship.jpg');
  const [ogImageUrl, setOgImageUrl] = useState(seoSettings?.ogImageUrl || '/hero-botanical-banner.jpg');

  // Uploading status
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File Upload Helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'favicon' | 'logo' | 'hero' | 'personalCare' | 'homeCare' | 'about' | 'ogImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingTarget(target);
      setErrorMessage(null);
      const res = await api.uploadImage(file);
      
      if (target === 'favicon') setFaviconUrl(res.url);
      if (target === 'logo') setLogoUrl(res.url);
      if (target === 'hero') setHeroImageUrl(res.url);
      if (target === 'personalCare') setPersonalCareImageUrl(res.url);
      if (target === 'homeCare') setHomeCareImageUrl(res.url);
      if (target === 'about') setAboutStoryImageUrl(res.url);
      if (target === 'ogImage') setOgImageUrl(res.url);

      onNotify?.(`Image uploaded successfully: ${res.filename}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingTarget(null);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      // 1. Save Settings (Favicon & Brand Logo)
      await onUpdateSettings({
        faviconUrl: faviconUrl.trim(),
        logoUrl: logoUrl.trim(),
      });

      // 2. Save Page Banners
      await onUpdatePagesContent({
        home: {
          ...pagesContent.home,
          heroImageUrl: heroImageUrl.trim(),
        },
        personalCare: {
          ...pagesContent.personalCare,
          imageUrl: personalCareImageUrl.trim(),
        },
        homeCare: {
          ...pagesContent.homeCare,
          imageUrl: homeCareImageUrl.trim(),
        },
        about: {
          ...pagesContent.about,
          storyImageUrl: aboutStoryImageUrl.trim(),
        },
      });

      // 3. Save SEO OG Image
      if (seoSettings) {
        await api.updateSeo({
          ...seoSettings,
          ogImageUrl: ogImageUrl.trim(),
          organizationLogo: logoUrl.trim(),
        });
      }

      setSaveSuccess(true);
      onNotify?.('All branding, favicon, logo, and page banner changes saved successfully!');
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save branding changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFE7E1] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-1">
              <FileImage className="w-4 h-4" />
              <span>Branding & Media Assets Manager</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#143721]">
              Change Website Favicon, Brand Logo & Images
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Manage all primary visual assets across the entire website. You can upload images directly from your computer or phone, or paste custom URLs with real-time live previews.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Publishing Changes...' : saveSuccess ? 'Saved & Live!' : 'Save All Branding'}</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Changes published! Favicon, logo, and image banners updated immediately across all pages.</span>
          </div>
        )}
      </div>

      {/* Grid of Branding Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ========================================================= */}
        {/* 1. WEBSITE FAVICON */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Website Favicon</h3>
                <p className="text-[11px] text-slate-500">Browser tab icon displayed to visitors</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFaviconUrl('/favicon.png')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset to Default
            </button>
          </div>

          {/* Browser Tab Simulation Preview */}
          <div className="p-4 bg-[#F2F7F3] rounded-2xl border border-[#CDE3D2] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C5E43] block">
              Browser Tab Preview
            </span>
            <div className="max-w-xs bg-white rounded-t-xl px-3 py-2 border border-slate-300 shadow-xs flex items-center gap-2.5">
              <img
                src={faviconUrl}
                alt="Favicon preview"
                className="w-4 h-4 rounded-xs object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/favicon.png';
                }}
              />
              <span className="text-xs font-semibold text-slate-700 truncate">
                HMI Organics — Pure Herbal Care
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Favicon Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="/favicon.png or https://..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] transition-colors whitespace-nowrap">
                {uploadingTarget === 'favicon' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png,image/x-icon,image/jpeg,image/svg+xml"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-400">
              Recommended: 32x32px or 64x64px square PNG or ICO file.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. BRAND LOGO */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Brand Logo</h3>
                <p className="text-[11px] text-slate-500">Rendered in header, footer, modals and schema</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLogoUrl('/assets/aistudio/IMG-20261007-WA0000-Photoroom_407330cc.png')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset to Original Logo
            </button>
          </div>

          {/* Dual Live Preview: Light & Dark */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#FAFDFB] rounded-2xl border border-[#DFE7E1] text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Header View (Light)
              </span>
              <div className="py-2 flex items-center justify-center">
                <BrandLogo size="md" customLogoUrl={logoUrl} showText={false} />
              </div>
            </div>

            <div className="p-3 bg-[#12241A] rounded-2xl border border-[#2B523C] text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Footer View (Dark)
              </span>
              <div className="py-2 flex items-center justify-center">
                <BrandLogo size="md" customLogoUrl={logoUrl} showText={false} inverted={true} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Logo Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/hmi-organics-logo.png or https://..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] transition-colors whitespace-nowrap">
                {uploadingTarget === 'logo' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-400">
              Transparent PNG or SVG with high resolution is recommended.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. HOME PAGE HERO BOTANICAL BANNER */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Image className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Home Hero Guarantee Visual</h3>
                <p className="text-[11px] text-slate-500">Banner on home page with "HMI Organics Guarantee" card</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHeroImageUrl('/hero-botanical-banner.jpg')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset Default
            </button>
          </div>

          {/* Banner Card Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-[#D5E4D8] shadow-xs">
            <img
              src={heroImageUrl}
              alt="Hero banner preview"
              className="w-full h-44 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/hero-botanical-banner.jpg';
              }}
            />
            <div className="p-3 bg-white/95 backdrop-blur-xs border-t border-[#E3ECE5] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E]">
                  HMI Organics Guarantee
                </p>
                <p className="text-[10px] text-[#52705D]">
                  Pure botanical extracts · Biodegradable formulas
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active Card
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Hero Banner Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="/hero-botanical-banner.jpg or https://..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] transition-colors whitespace-nowrap">
                {uploadingTarget === 'hero' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileUpload(e, 'hero')}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => setHeroImageUrl('/hero-botanical-banner.jpg')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 cursor-pointer"
              >
                Botanical Herbs
              </button>
              <button
                type="button"
                onClick={() => setHeroImageUrl('/about-craftsmanship.jpg')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 cursor-pointer"
              >
                Artisan Workshop
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SOCIAL MEDIA / WHATSAPP SHARE CARD (OG:IMAGE) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Social Share Card (og:image)</h3>
                <p className="text-[11px] text-slate-500">Preview image when link is shared on WhatsApp, Facebook, X</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOgImageUrl('/hero-botanical-banner.jpg')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset Default
            </button>
          </div>

          {/* Social Share Preview Card */}
          <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-xs bg-slate-50">
            <div className="h-32 bg-slate-800 relative overflow-hidden">
              <img
                src={ogImageUrl}
                alt="Social share preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/hero-botanical-banner.jpg';
                }}
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-white font-mono">
                hmiorganics.com
              </span>
            </div>
            <div className="p-3 bg-white space-y-0.5">
              <p className="font-bold text-xs text-slate-900 truncate">
                HMI Organics — Pure Herbal Care & Eco Products
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                Handcrafted herbal personal grooming and plant-powered home care in Pakistan.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Social Card Image URL (og:image)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="/hero-botanical-banner.jpg or https://..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] transition-colors whitespace-nowrap">
                {uploadingTarget === 'ogImage' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileUpload(e, 'ogImage')}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-400">
              Recommended: 1200x630px JPG or PNG for crisp WhatsApp & Facebook link unfurls.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. PERSONAL CARE COLLECTION BANNER */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Personal Care Page Banner</h3>
                <p className="text-[11px] text-slate-500">Header visual on /personal-care</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPersonalCareImageUrl('/personal-care-banner.jpg')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#D5E4D8] h-32">
            <img
              src={personalCareImageUrl}
              alt="Personal care banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/personal-care-banner.jpg';
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={personalCareImageUrl}
                onChange={(e) => setPersonalCareImageUrl(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2]">
                {uploadingTarget === 'personalCare' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'personalCare')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. HOME & CAR CARE COLLECTION BANNER */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">Home & Car Care Page Banner</h3>
                <p className="text-[11px] text-slate-500">Header visual on /home-care</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHomeCareImageUrl('/home-cleaning-banner.jpg')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#D5E4D8] h-32">
            <img
              src={homeCareImageUrl}
              alt="Home care banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/home-cleaning-banner.jpg';
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={homeCareImageUrl}
                onChange={(e) => setHomeCareImageUrl(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2]">
                {uploadingTarget === 'homeCare' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'homeCare')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. ABOUT US WORKSHOP CRAFTSMANSHIP IMAGE */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-2xs p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#F2F7F3] rounded-xl text-[#1B4D2E]">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-[#143721]">About Us Artisanal Story Visual</h3>
                <p className="text-[11px] text-slate-500">Artisanal workshop image featured on the /about story section</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAboutStoryImageUrl('/about-craftsmanship.jpg')}
              className="text-[11px] text-[#2C5E43] hover:underline font-semibold cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="rounded-2xl overflow-hidden border border-[#D5E4D8] h-44 shadow-xs">
              <img
                src={aboutStoryImageUrl}
                alt="About us craftsmanship"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/about-craftsmanship.jpg';
                }}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aboutStoryImageUrl}
                  onChange={(e) => setAboutStoryImageUrl(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] whitespace-nowrap">
                  {uploadingTarget === 'about' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'about')}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-500">
                This image represents your natural formulations, small-batch integrity, and lab-tested eco hygiene craftsmanship.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Bottom Save Action Strip */}
      <div className="sticky bottom-4 z-30 bg-[#163824]/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-[#2F6141] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8CE39E]" />
          <span className="text-xs font-semibold">
            Ready to update favicon, logo and banners across the live website?
          </span>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20BC59] text-[#143721] font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Publishing...' : 'Save All Branding Changes'}</span>
        </button>
      </div>

    </div>
  );
};
