import React, { useState } from 'react';
import { BRAND_INFO } from '../data/products';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  settings?: {
    phone: string;
    whatsAppUrl: string;
  };
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const activeUrl = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;
  const activePhone = settings?.phone || BRAND_INFO.phone;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {tooltipVisible && (
        <div className="mb-3 p-3.5 bg-white rounded-2xl shadow-xl border border-[#D9E3DC] text-xs text-[#24412E] max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-bold text-[#1B4D2E] text-sm">Need quick advice or custom order?</span>
            <button
              onClick={() => setTooltipVisible(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[#4C6654] leading-relaxed mb-2">
            Chat with HMI Organics on WhatsApp for inquiries, bulk pricing, or fast delivery booking.
          </p>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#1B4D2E] hover:underline"
          >
            Open WhatsApp ({activePhone}) →
          </a>
        </div>
      )}

      <div className="relative group">
        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setTooltipVisible(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BE5B] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30"
          aria-label="Direct Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>

        {/* Quiet badge */}
        <span className="sr-only">HMI Organics WhatsApp Assistance</span>
      </div>
    </div>
  );
};
