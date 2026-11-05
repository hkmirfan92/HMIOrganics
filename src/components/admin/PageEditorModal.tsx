import React, { useState, useEffect } from 'react';
import { SitePagesContent, PageId } from '../../types';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  FileText,
  Eye,
  Info
} from 'lucide-react';

interface PageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPage: PageId | 'global';
  pagesContent: SitePagesContent;
  onSave: (updated: Partial<SitePagesContent>) => Promise<void>;
  onResetToDefault: () => Promise<void>;
}

export const PageEditorModal: React.FC<PageEditorModalProps> = ({
  isOpen,
  onClose,
  targetPage,
  pagesContent,
  onSave,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<PageId | 'global'>(targetPage === 'admin' ? 'home' : targetPage);
  const [formData, setFormData] = useState<SitePagesContent>(pagesContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when props change
  useEffect(() => {
    setFormData(pagesContent);
  }, [pagesContent]);

  useEffect(() => {
    if (targetPage !== 'admin') {
      setActiveTab(targetPage);
    }
  }, [targetPage, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to restore all website pages to default original brand content?')) {
      return;
    }
    setIsSaving(true);
    try {
      await onResetToDefault();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#DFE7E1] flex flex-col overflow-hidden text-[#183925]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-modal-title"
      >
        {/* Modal Header */}
        <div className="bg-[#183925] text-white px-6 py-4 flex items-center justify-between border-b border-[#255C3A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#96EAB1]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="editor-modal-title" className="font-display font-bold text-base sm:text-lg text-white">
                Frontend Pages Live Editor
              </h2>
              <p className="text-xs text-[#C8E4D1]">
                Changes update the live website immediately for all visitors
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Page Switcher Tabs */}
        <div className="bg-[#F4FAF5] px-6 py-2.5 border-b border-[#DFE7E1] flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">
            Select Page:
          </span>
          {[
            { id: 'home', label: 'Home Page' },
            { id: 'personal-care', label: 'Personal Care' },
            { id: 'home-care', label: 'Home & Car Care' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'global', label: 'Banner & Footer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#183925] text-white shadow-xs font-bold'
                  : 'bg-white text-[#2C5E43] hover:bg-[#E3ECE5] border border-[#DFE7E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Status feedback */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Page content saved and published to live website!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* 1. HOME PAGE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">Hero Section Copy</h3>
                <p className="text-[11px] text-slate-500">The main banner at the very top of the homepage</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Hero Badge Tagline</label>
                  <input
                    type="text"
                    value={formData.home.heroBadge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    placeholder="e.g. 100% Herbal & Eco-Friendly Formulations"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Primary Headline (Main Title)</label>
                  <input
                    type="text"
                    value={formData.home.heroTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    placeholder="e.g. Pure, Natural & Effective Care for Home and Body"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Hero Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={formData.home.heroSubtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroSubtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Primary Button Label</label>
                  <input
                    type="text"
                    value={formData.home.heroBtnPrimaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroBtnPrimaryText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Secondary Button Label</label>
                  <input
                    type="text"
                    value={formData.home.heroBtnSecondaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroBtnSecondaryText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Hero Guarantee Badge Title</label>
                  <input
                    type="text"
                    value={formData.home.heroGuaranteeTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroGuaranteeTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Hero Guarantee Subtitle</label>
                  <input
                    type="text"
                    value={formData.home.heroGuaranteeSubtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        home: { ...formData.home, heroGuaranteeSubtitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* Brand Distinction Section */}
              <div className="border-t border-[#DFE7E1] pt-4 space-y-4">
                <div className="border-b border-[#DFE7E1] pb-2">
                  <h3 className="font-display font-bold text-sm text-[#183925]">Brand Intro & Distinction Section</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Section Small Tag</label>
                    <input
                      type="text"
                      value={formData.home.introBadge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, introBadge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Section Headline</label>
                    <input
                      type="text"
                      value={formData.home.introTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, introTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-semibold text-slate-700">Intro Philosophy Paragraph</label>
                    <textarea
                      rows={3}
                      value={formData.home.introDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          home: { ...formData.home, introDescription: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    />
                  </div>
                </div>

                {/* 3 Pillars */}
                <div className="space-y-3 pt-2">
                  <label className="font-semibold text-slate-700 block">3 Brand Pillars (Features)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {formData.home.introPillars.map((pillar, idx) => (
                      <div key={idx} className="p-3 bg-[#FAFDFB] border border-[#DFE7E1] rounded-xl space-y-2">
                        <span className="font-bold text-[11px] text-[#2C5E43] block">Pillar {idx + 1}</span>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const newPillars = [...formData.home.introPillars];
                            newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                            setFormData({
                              ...formData,
                              home: { ...formData.home, introPillars: newPillars },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                          placeholder="Pillar Title"
                        />
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const newPillars = [...formData.home.introPillars];
                            newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                            setFormData({
                              ...formData,
                              home: { ...formData.home, introPillars: newPillars },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                          placeholder="Pillar Description"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promotional Bottom Banner */}
                <div className="border-t border-[#DFE7E1] pt-4 space-y-3">
                  <h4 className="font-semibold text-slate-800">Bottom Call-to-Action Banner</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Banner Title</label>
                      <input
                        type="text"
                        value={formData.home.bannerTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            home: { ...formData.home, bannerTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Free Delivery Highlight Tag</label>
                      <input
                        type="text"
                        value={formData.home.bannerHighlight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            home: { ...formData.home, bannerHighlight: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700">Banner Description</label>
                      <textarea
                        rows={2}
                        value={formData.home.bannerSubtitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            home: { ...formData.home, bannerSubtitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. PERSONAL CARE PAGE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'personal-care' && (
            <div className="space-y-5">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">Personal Care Page Banner & Header</h3>
                <p className="text-[11px] text-slate-500">Edit the top banner displayed on the Personal Care catalog</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Badge / Category Tag</label>
                  <input
                    type="text"
                    value={formData.personalCare.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalCare: { ...formData.personalCare, badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Page Headline (Main Title)</label>
                  <input
                    type="text"
                    value={formData.personalCare.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalCare: { ...formData.personalCare, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Category Description</label>
                  <textarea
                    rows={3}
                    value={formData.personalCare.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalCare: { ...formData.personalCare, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Banner Image URL / Asset Path</label>
                  <input
                    type="text"
                    value={formData.personalCare.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalCare: { ...formData.personalCare, imageUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* Highlights bullets */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-slate-700 block">Category Key Highlights (Bullets)</label>
                <div className="grid grid-cols-2 gap-2">
                  {formData.personalCare.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => {
                          const newHighlights = [...formData.personalCare.highlights];
                          newHighlights[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            personalCare: { ...formData.personalCare, highlights: newHighlights },
                          });
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newHighlights = formData.personalCare.highlights.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            personalCare: { ...formData.personalCare, highlights: newHighlights },
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      personalCare: {
                        ...formData.personalCare,
                        highlights: [...formData.personalCare.highlights, 'New Benefit Highlight'],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF5EF] hover:bg-[#E3ECE5] text-[#2C5E43] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight Tag</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. HOME & CAR CARE PAGE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'home-care' && (
            <div className="space-y-5">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">Home & Car Care Page Banner</h3>
                <p className="text-[11px] text-slate-500">Edit the top banner and eco-cleaning philosophy displayed on the Home Care catalog</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Badge / Category Tag</label>
                  <input
                    type="text"
                    value={formData.homeCare.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeCare: { ...formData.homeCare, badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Page Headline (Main Title)</label>
                  <input
                    type="text"
                    value={formData.homeCare.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeCare: { ...formData.homeCare, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Category Description</label>
                  <textarea
                    rows={3}
                    value={formData.homeCare.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeCare: { ...formData.homeCare, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Banner Image URL / Asset Path</label>
                  <input
                    type="text"
                    value={formData.homeCare.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeCare: { ...formData.homeCare, imageUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* Highlights bullets */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-slate-700 block">Category Key Highlights (Bullets)</label>
                <div className="grid grid-cols-2 gap-2">
                  {formData.homeCare.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => {
                          const newHighlights = [...formData.homeCare.highlights];
                          newHighlights[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            homeCare: { ...formData.homeCare, highlights: newHighlights },
                          });
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newHighlights = formData.homeCare.highlights.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            homeCare: { ...formData.homeCare, highlights: newHighlights },
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      homeCare: {
                        ...formData.homeCare,
                        highlights: [...formData.homeCare.highlights, 'Eco-Friendly Safe Clean'],
                      },
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF5EF] hover:bg-[#E3ECE5] text-[#2C5E43] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight Tag</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. ABOUT US PAGE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">About Us Page Story & Mission</h3>
                <p className="text-[11px] text-slate-500">Edit the brand story, founders' philosophy, and company statistics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Top Header Tagline</label>
                  <input
                    type="text"
                    value={formData.about.headerBadge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, headerBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Page Headline</label>
                  <input
                    type="text"
                    value={formData.about.headerTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, headerTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Header Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.about.headerDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, headerDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Story Section Tag</label>
                  <input
                    type="text"
                    value={formData.about.storyBadge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, storyBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Story Section Title</label>
                  <input
                    type="text"
                    value={formData.about.storyTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, storyTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* Story Paragraphs */}
              <div className="space-y-2 pt-2">
                <label className="font-semibold text-slate-700 block">Brand Story Paragraphs</label>
                {formData.about.storyParagraphs.map((para, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold">Paragraph {idx + 1}</span>
                    <textarea
                      rows={2}
                      value={para}
                      onChange={(e) => {
                        const newParas = [...formData.about.storyParagraphs];
                        newParas[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          about: { ...formData.about, storyParagraphs: newParas },
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#DFE7E1]">
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Our Mission</label>
                  <input
                    type="text"
                    value={formData.about.missionTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, missionTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    placeholder="Mission Title"
                  />
                  <textarea
                    rows={2}
                    value={formData.about.missionDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, missionDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700">Our Vision</label>
                  <input
                    type="text"
                    value={formData.about.visionTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, visionTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    placeholder="Vision Title"
                  />
                  <textarea
                    rows={2}
                    value={formData.about.visionDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, visionDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="space-y-2 pt-2 border-t border-[#DFE7E1]">
                <label className="font-semibold text-slate-700 block">Trust & Quality Stats</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.about.stats.map((st, idx) => (
                    <div key={idx} className="p-2.5 bg-[#FAFDFB] border border-[#DFE7E1] rounded-xl space-y-1">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const newStats = [...formData.about.stats];
                          newStats[idx] = { ...newStats[idx], value: e.target.value };
                          setFormData({
                            ...formData,
                            about: { ...formData.about, stats: newStats },
                          });
                        }}
                        className="w-full px-2 py-1 bg-white border border-[#CDDCD1] rounded-md text-xs font-bold text-[#1B4D2E]"
                        placeholder="e.g. 100%"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const newStats = [...formData.about.stats];
                          newStats[idx] = { ...newStats[idx], label: e.target.value };
                          setFormData({
                            ...formData,
                            about: { ...formData.about, stats: newStats },
                          });
                        }}
                        className="w-full px-2 py-1 bg-white border border-[#CDDCD1] rounded-md text-[11px] text-slate-600"
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. CONTACT US PAGE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">Contact Us Page & FAQs</h3>
                <p className="text-[11px] text-slate-500">Edit contact details, operating hours, and frequently asked questions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Top Header Tagline</label>
                  <input
                    type="text"
                    value={formData.contact.headerBadge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, headerBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Page Headline</label>
                  <input
                    type="text"
                    value={formData.contact.headerTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, headerTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-slate-700">Header Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.contact.headerDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, headerDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Operating Hours</label>
                  <input
                    type="text"
                    value={formData.contact.operatingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, operatingHours: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Dispatch / Warehouse Centers</label>
                  <input
                    type="text"
                    value={formData.contact.dispatchWarehouse}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, dispatchWarehouse: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>

              {/* FAQs List */}
              <div className="space-y-3 pt-3 border-t border-[#DFE7E1]">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 block">Frequently Asked Questions (FAQs)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        contact: {
                          ...formData.contact,
                          faqs: [
                            ...formData.contact.faqs,
                            { q: 'New Question?', a: 'Answer to this question.' },
                          ],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF5EF] hover:bg-[#E3ECE5] text-[#2C5E43] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.contact.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 bg-[#FAFDFB] border border-[#DFE7E1] rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[11px] text-[#2C5E43]">Question #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = formData.contact.faqs.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, faqs: newFaqs },
                            });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const newFaqs = [...formData.contact.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, faqs: newFaqs },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                        placeholder="Question text"
                      />
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const newFaqs = [...formData.contact.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                          setFormData({
                            ...formData,
                            contact: { ...formData.contact, faqs: newFaqs },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#CDDCD1] rounded-lg text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                        placeholder="Detailed answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 6. BANNER & FOOTER / GLOBAL SITE EDITOR */}
          {/* ============================================================ */}
          {activeTab === 'global' && (
            <div className="space-y-5">
              <div className="border-b border-[#DFE7E1] pb-3">
                <h3 className="font-display font-bold text-sm text-[#183925]">Global Announcement & Footer</h3>
                <p className="text-[11px] text-slate-500">Edit the top announcement bar ticker and footer statements seen across all pages</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={formData.global.topAnnouncement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        global: { ...formData.global, topAnnouncement: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                    placeholder="🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across Pakistan"
                  />
                  <p className="text-[10px] text-slate-400">Displayed at the very top of every page with quick WhatsApp direct link</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Footer Tagline</label>
                  <input
                    type="text"
                    value={formData.global.footerTagline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        global: { ...formData.global, footerTagline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Footer About Summary</label>
                  <textarea
                    rows={3}
                    value={formData.global.footerAboutText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        global: { ...formData.global, footerAboutText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#CDDCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#1B4D2E] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#FAFDFB] px-6 py-4 border-t border-[#DFE7E1] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-[#DFE7E1] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
