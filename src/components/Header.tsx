import React, { useState } from 'react';
import { PageId, BrandSettings, Category } from '../types';
import { BrandLogo } from './BrandLogo';
import { BRAND_INFO } from '../data/products';
import { MessageCircle, Menu, X, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
  settings?: BrandSettings;
  isAdminAuthenticated?: boolean;
  categories?: Category[];
  onSelectCategoryFilter?: (catId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  settings,
  isAdminAuthenticated = false,
  categories = [],
  onSelectCategoryFilter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeWhatsAppUrl = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;

  const navLinks: { id: PageId; label: string; isAdmin?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'personal-care', label: 'Personal Care' },
    { id: 'home-care', label: 'Home & Car Care' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
    {
      id: 'admin',
      label: isAdminAuthenticated ? '⚙ Admin Panel' : '⚙ Admin Login',
      isAdmin: true,
    },
  ];

  const handleLinkClick = (pageId: PageId | string) => {
    setMobileMenuOpen(false);

    if (pageId === 'home') {
      if (onSelectCategoryFilter) onSelectCategoryFilter('all');
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (pageId === 'personal-care' || pageId === 'home-care') {
      // Direct category filtering on Main page without kicking user to separate page
      if (onSelectCategoryFilter) onSelectCategoryFilter(pageId);
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('products-catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    onNavigate(pageId as PageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E3E8E3] transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark / Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5E43] rounded-lg"
          aria-label="HMI Organics Home"
        >
          <BrandLogo size="md" customLogoUrl={settings?.logoUrl} />
        </button>

        {/* Zone 2: clean single-line text links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#374A3D]">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            if (link.isAdmin) {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`cursor-pointer whitespace-nowrap shrink-0 transition-all px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#1B4D2E] text-white shadow-xs'
                      : 'bg-[#EEF5EF] text-[#1B4D2E] hover:bg-[#E2EDE4]'
                  }`}
                >
                  ⚙ Store Admin
                </button>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#1B4D2E] font-semibold'
                    : 'hover:text-[#1B4D2E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C5E43] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Cart Affordance */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart / WhatsApp Basket Drawer Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View Order Basket"
            className="cursor-pointer relative p-2.5 rounded-full text-[#24412E] hover:bg-[#EEF4EE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5E43]"
            title="Order Basket"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2C5E43] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <a
            href={activeWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1B4D2E] hover:bg-[#153D24] active:scale-[0.98] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#8DE29E]" />
            <span>Order on WhatsApp</span>
          </a>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#24412E] hover:bg-[#EEF4EE] rounded-lg transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBFBFA] border-b border-[#E3E8E3] px-5 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-[#EEF4EE] text-[#1B4D2E] font-semibold'
                  : 'text-[#374A3D] hover:bg-slate-100'
              }`}
            >
              {link.isAdmin ? '⚙ ' + link.label : link.label}
            </button>
          ))}
          <div className="pt-2">
            <a
              href={activeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-semibold text-white bg-[#1B4D2E] hover:bg-[#153D24] rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#8DE29E]" />
              <span>Direct WhatsApp Order ({settings?.phone || BRAND_INFO.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
