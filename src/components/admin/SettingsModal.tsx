import React, { useState, useEffect } from 'react';
import { BrandSettings } from '../../types';
import { X, Save, MessageCircle, Phone, Mail, MapPin, Bell, HardDriveDownload, SlidersHorizontal } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrandSettings;
  onSaveSettings: (settings: Partial<BrandSettings>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [phone, setPhone] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [email, setEmail] = useState('');
  const [topBannerNotice, setTopBannerNotice] = useState('');
  const [deliveryNotice, setDeliveryNotice] = useState('');
  const [address, setAddress] = useState('');
  const [productsPerPage, setProductsPerPage] = useState<number>(6);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPhone(settings.phone || '+92 305 2211093');
      setPhoneRaw(settings.phoneRaw || '923052211093');
      setEmail(settings.email || 'hmiorganicspk@gmail.com');
      setAddress(settings.address || 'C 65/29, 2nd Floor, Street 2, Punjab Colony, Karachi.');
      setProductsPerPage(settings.productsPerPage || 6);
      setTopBannerNotice(
        settings.topBannerNotice ||
          '🌿 Handcrafted Pure Herbal & Eco-Friendly Care · Fast Delivery Across All Cities in Pakistan'
      );
      setDeliveryNotice(
        settings.deliveryNotice ||
          'Delivering across Karachi, Lahore, Islamabad, Faisalabad, Peshawar, and all of Pakistan'
      );
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const cleanRaw = phoneRaw.replace(/[^0-9]/g, '');
      await onSaveSettings({
        phone: phone.trim(),
        phoneRaw: cleanRaw,
        email: email.trim(),
        address: address.trim(),
        productsPerPage: Math.max(1, Math.min(60, Number(productsPerPage) || 6)),
        topBannerNotice: topBannerNotice.trim(),
        deliveryNotice: deliveryNotice.trim(),
        whatsAppUrl: `https://wa.me/${cleanRaw}`,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D5E1D7] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#F6FAF6] border-b border-[#E2EBE3] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-[#163824]">
              Store & WhatsApp Contact Settings
            </h3>
            <p className="text-xs text-[#5D7A68]">
              Manage phone coordinates, order routing, and delivery notices
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2C5E43]" /> Display Phone / WhatsApp
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 305 2211093"
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#2C5E43]" /> WhatsApp Raw Number (Numbers only, with Country Code)
            </label>
            <input
              type="text"
              required
              value={phoneRaw}
              onChange={(e) => setPhoneRaw(e.target.value)}
              placeholder="923052211093"
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Generates WhatsApp links (https://wa.me/923052211093)
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2C5E43]" /> Official Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hmiorganicspk@gmail.com"
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#2C5E43]" /> Top Header Announcement Banner
            </label>
            <textarea
              rows={2}
              value={topBannerNotice}
              onChange={(e) => setTopBannerNotice(e.target.value)}
              placeholder="Notice shown at the very top of the website"
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2C5E43]" /> Office & Studio Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. C 65/29, 2nd Floor, Street 2, Punjab Colony, Karachi."
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#2C5E43]" /> Products Per Page (Pagination Range)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="60"
                value={productsPerPage}
                onChange={(e) => setProductsPerPage(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-xs font-bold px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <span className="text-[11px] text-slate-500">
                Itne products ke baad main page par Page 2, Page 3 show honge
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2C5E43]" /> Delivery Coverage Text
            </label>
            <input
              type="text"
              value={deliveryNotice}
              onChange={(e) => setDeliveryNotice(e.target.value)}
              placeholder="Delivering across all cities in Pakistan"
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Download Website Backup Card */}
          <div className="p-4 bg-[#F2F7F3] rounded-2xl border border-[#CCE2D1] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#143721] text-xs flex items-center gap-1.5">
                <HardDriveDownload className="w-4 h-4 text-[#1B4D2E]" />
                Download Entire Website (.ZIP)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Complete Backup
              </span>
            </div>
            <p className="text-[11px] text-[#446650] leading-relaxed">
              Save the full website codebase, products catalog, pages content, and backend to your computer. Extract the ZIP and run <code className="font-mono bg-white px-1 py-0.5 rounded text-[#143721]">npm install</code> then <code className="font-mono bg-white px-1 py-0.5 rounded text-[#143721]">npm run dev</code>.
            </p>
            <a
              href="/api/system/download-backup"
              download="hmi-organics-website-codebase.zip"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-emerald-200" />
              <span>Download Website Backup (.ZIP)</span>
            </a>
          </div>

          {/* Footer Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
