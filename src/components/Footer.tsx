import React from 'react';
import { PageId, BrandSettings, GlobalSiteContent } from '../types';
import { BrandLogo } from './BrandLogo';
import { BRAND_INFO } from '../data/products';
import { MessageCircle, Phone, Mail, MapPin, Heart, ShieldCheck, Sparkles, Leaf } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  settings?: BrandSettings;
  content?: GlobalSiteContent;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings, content }) => {

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeWhatsApp = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;
  const activePhone = settings?.phone || BRAND_INFO.phone;
  const activePhoneRaw = settings?.phoneRaw || BRAND_INFO.phoneRaw;
  const activeEmail = settings?.email || BRAND_INFO.email;
  const activeDelivery = settings?.deliveryNotice || BRAND_INFO.deliveryNotice;

  return (
    <footer className="bg-[#12241A] text-[#E0EBE2] border-t border-[#1C3829]">
      {/* Upper Footer: Value Props Strip */}
      <div className="border-b border-[#1E3B2B] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Leaf className="w-5 h-5 text-[#86D097] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">100% Herbal Botanicals</p>
                <p className="text-xs text-[#9BB1A1]">Pure cold-pressed & plant oils</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="w-5 h-5 text-[#86D097] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Safe for Family & Pets</p>
                <p className="text-xs text-[#9BB1A1]">No caustic soda or toxic fumes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Sparkles className="w-5 h-5 text-[#86D097] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Biodegradable Runoff</p>
                <p className="text-xs text-[#9BB1A1]">Non-toxic greywater safe</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MessageCircle className="w-5 h-5 text-[#86D097] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Fast WhatsApp Dispatch</p>
                <p className="text-xs text-[#9BB1A1]">Across all cities in Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Information & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#183526]/80 p-4 rounded-2xl inline-block border border-[#2B523C] shadow-inner">
              <BrandLogo size="md" showText={true} inverted={true} customLogoUrl={settings?.logoUrl} />
            </div>
            <p className="text-sm text-[#A9BFA9] max-w-sm leading-relaxed">
              {content?.footerAboutText || 'HMI Organics is committed to crafting pure, natural, and effective care products for your personal grooming and eco-conscious home. Formulated with authentic herbal extracts without compromising safety.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#7F9C86]">
              <span>Handcrafted in Pakistan</span>
              <span aria-hidden="true">·</span>
              <span>Cruelty-Free</span>
              <span aria-hidden="true">·</span>
              <span>Chemical-Conscious</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A2DCAE]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#C8D9CB]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('personal-care')} className="hover:text-white transition-colors cursor-pointer">
                  Personal Care
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home-care')} className="hover:text-white transition-colors cursor-pointer">
                  Home & Car Care
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer">
                  Our Story & Mission
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Orders
                </button>
              </li>
              <li className="pt-1">
                <button onClick={() => handleNav('admin')} className="text-xs font-semibold text-[#86D097] hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  <span>⚙ Store Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Featured Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A2DCAE]">Popular Products</h4>
            <ul className="space-y-2 text-sm text-[#C8D9CB]">
              <li>
                <button onClick={() => handleNav('personal-care')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Pure Herbal Hair Growth Oil
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('personal-care')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Herbal Tooth Powder
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home-care')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Plant-Powered Dishwash
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home-care')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Kitchen Degreaser Cleaner
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home-care')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Eco Car Wash Shampoo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A2DCAE]">Direct Contact</h4>
            <div className="space-y-2.5 text-sm text-[#C8D9CB]">
              <a
                href={activeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-[#7BD490] group-hover:scale-110 transition-transform" />
                <span>{activePhone}</span>
              </a>
              <a
                href={`tel:${activePhoneRaw}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#7BD490]" />
                <span>{activePhone}</span>
              </a>
              <a
                href={`mailto:${activeEmail}`}
                className="flex items-center gap-2 hover:text-white transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#7BD490] shrink-0" />
                <span>{activeEmail}</span>
              </a>
              <div className="flex items-start gap-2 text-xs text-[#9BB1A1] pt-1">
                <MapPin className="w-4 h-4 text-[#7BD490] shrink-0 mt-0.5" />
                <span>{activeDelivery}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={activeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#12241A] bg-[#8CE39E] hover:bg-[#A4EBAF] rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#1C3829] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F9C86]">
          <p>© {new Date().getFullYear()} HMI Organics. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with purity & nature in Pakistan</span>
            <Heart className="w-3.5 h-3.5 text-[#E67878] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
