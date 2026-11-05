import React from 'react';
import { PageId, Product, BrandSettings, HomePageContent } from '../types';
import { BRAND_INFO, TRUST_BADGES, PERSONAL_CARE_PRODUCTS, HOME_CARE_PRODUCTS } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import { ProductCard } from '../components/ProductCard';
import { TestimonialsSection } from '../components/TestimonialsSection';
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  CheckCircle2,
  Droplets,
  Star
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: Set<string>;
  products: Product[];
  settings?: BrandSettings;
  content?: HomePageContent;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onQuickView,
  onAddToCart,
  cartProductIds,
  products,
  settings,
  content,
}) => {
  const pageData = content || DEFAULT_PAGES_CONTENT.home;
  const activeWhatsApp = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;
  const activePhone = settings?.phone || BRAND_INFO.phone;
  const activePhoneRaw = settings?.phoneRaw || BRAND_INFO.phoneRaw;


  // Select top items from live catalog (publicly visible items only)
  const personalCare = products.filter((p) => p.category === 'personal-care' && p.isVisible !== false);
  const homeCare = products.filter((p) => p.category === 'home-care' && p.isVisible !== false);

  const featuredPersonalCare = personalCare.filter((p) => p.isBestseller).length >= 3
    ? personalCare.filter((p) => p.isBestseller).slice(0, 3)
    : personalCare.slice(0, 3);

  const featuredHomeCare = homeCare.filter((p) => p.isBestseller).length >= 3
    ? homeCare.filter((p) => p.isBestseller).slice(0, 3)
    : homeCare.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF5F0] via-[#F6FAF6] to-[#FBFBFA] pt-8 sm:pt-14 pb-16 border-b border-[#E3ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F5433]">
                <Leaf className="w-4 h-4 text-[#2C5E43]" />
                <span>{pageData.heroBadge}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#112F1C] tracking-tight leading-[1.15] text-balance">
                {pageData.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#3E5C48] leading-relaxed max-w-xl">
                {pageData.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('personal-care')}
                  className="px-6 py-3.5 bg-[#1B4D2E] hover:bg-[#153D24] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span>{pageData.heroBtnPrimaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('home-care')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-[#1B4D2E] border border-[#2C5E43] text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{pageData.heroBtnSecondaryText}</span>
                </button>

                <a
                  href={activeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F5433] hover:text-[#112F1C] transition-colors py-2 px-1"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp: {activePhone}</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#4C6B55]">
                {pageData.heroTrustBadges?.map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2C5E43]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#D5E4D8] bg-white group">
                <img
                  src={pageData.heroImageUrl || "/hero-botanical-banner.jpg"}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/hero-botanical-banner.jpg')) {
                      target.src = '/hero-botanical-banner.jpg';
                    }
                  }}
                  alt="HMI Organics pure herbal and eco-friendly products"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay card banner */}
                <div className="p-5 bg-white/95 backdrop-blur-md border-t border-[#E3ECE5] flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1B4D2E]">
                      {pageData.heroGuaranteeTitle}
                    </p>
                    <p className="text-xs text-[#52705D]">
                      {pageData.heroGuaranteeSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-xs font-semibold text-[#1B4D2E] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Our Story →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BRAND INTRO & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFDFB] rounded-3xl border border-[#E1EBE3] p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
              {pageData.introBadge}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143721]">
              {pageData.introTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#466650] leading-relaxed">
              {pageData.introDescription}
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.introPillars?.map((pillar, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E2EBE4] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
                  {idx === 0 && <Leaf className="w-5 h-5" />}
                  {idx === 1 && <Droplets className="w-5 h-5" />}
                  {idx >= 2 && <ShieldCheck className="w-5 h-5" />}
                </div>
                <h3 className="font-semibold text-base text-[#163824]">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 3. FEATURED CATEGORY 1: PERSONAL CARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-1">
              Holistic Body & Hair
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143721]">
              Personal Care Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6F58] mt-1">
              Natural tooth powder, potent hair growth oil, restorative shampoos & handcrafted soaps.
            </p>
          </div>

          <button
            onClick={() => onNavigate('personal-care')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B4D2E] hover:text-[#12331F] transition-colors cursor-pointer"
          >
            <span>View All Personal Care ({personalCare.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPersonalCare.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isInCart={cartProductIds.has(product.id)}
              whatsappPhone={activePhoneRaw}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED CATEGORY 2: HOME & CAR CARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-1">
              Eco-Conscious Cleaning
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143721]">
              Home & Car Care Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6F58] mt-1">
              Bio-enzyme dishwash, heavy kitchen degreasers, streak-free glass cleaners & pH-neutral car wash.
            </p>
          </div>

          <button
            onClick={() => onNavigate('home-care')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B4D2E] hover:text-[#12331F] transition-colors cursor-pointer"
          >
            <span>View All Home & Car Care ({homeCare.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHomeCare.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isInCart={cartProductIds.has(product.id)}
              whatsappPhone={activePhoneRaw}
            />
          ))}
        </div>
      </section>

      {/* 5. TRUST BADGES & CONTACT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#183925] text-white rounded-3xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#90E7A2]">
                {pageData.bannerHighlight || 'Nationwide Trust & Dispatch'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                {pageData.bannerTitle}
              </h2>
              <p className="text-sm text-[#C4DEC9] leading-relaxed max-w-lg">
                {pageData.bannerSubtitle}
              </p>


              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={activeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#1FB858] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp: {activePhone}</span>
                </a>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer"
                >
                  Send Inquiry Form
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} className="bg-[#122A1C] p-4 rounded-xl border border-[#234F34] space-y-1">
                  <h4 className="text-xs font-bold text-[#A5EDB5]">{badge.title}</h4>
                  <p className="text-[11px] text-[#A2B8A6] leading-relaxed">{badge.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER TESTIMONIALS WITH STAR RATINGS */}
      <TestimonialsSection />

    </div>
  );
};
