import React, { useState, useMemo, useEffect } from 'react';
import { PageId, Product, BrandSettings, HomePageContent, Category } from '../types';
import { BRAND_INFO, TRUST_BADGES } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import { ProductCard } from '../components/ProductCard';
import { TestimonialsSection } from '../components/TestimonialsSection';
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Droplets,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Filter
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: Set<string>;
  products: Product[];
  categories?: Category[];
  settings?: BrandSettings;
  content?: HomePageContent;
  selectedCategoryFilter?: string;
  onSelectCategoryFilter?: (catId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onQuickView,
  onAddToCart,
  cartProductIds,
  products,
  categories = [],
  settings,
  content,
  selectedCategoryFilter = 'all',
  onSelectCategoryFilter,
}) => {
  const pageData = content || DEFAULT_PAGES_CONTENT.home;
  const activeWhatsApp = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;
  const activePhone = settings?.phone || BRAND_INFO.phone;
  const activePhoneRaw = settings?.phoneRaw || BRAND_INFO.phoneRaw;

  // Active Category & Pagination state
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);

  // Sync if parent updates selectedCategoryFilter
  useEffect(() => {
    if (selectedCategoryFilter && selectedCategoryFilter !== activeCategory) {
      setActiveCategory(selectedCategoryFilter);
      setPage(1);
    }
  }, [selectedCategoryFilter]);

  // Configurable Products Per Page range set by admin (defaults to 6)
  const itemsPerPage = Math.max(1, settings?.productsPerPage || 6);

  // Default categories fallback
  const storeCategories: Category[] = categories.length > 0
    ? categories
    : [
        { id: 'personal-care', name: 'Personal Care', icon: '🌿' },
        { id: 'home-care', name: 'Home & Car Care', icon: '✨' },
      ];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.isVisible === false) return false;
      const matchesCat = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keyIngredients.some((i) => i.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Pagination computations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setPage(1);
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(catId);
    }
  };

  const handlePageChange = (newPage: number) => {
    const valid = Math.min(Math.max(1, newPage), totalPages);
    setPage(valid);
    const catalogElement = document.getElementById('products-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCatalogWithCategory = (catId: string) => {
    setActiveCategory(catId);
    setPage(1);
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Compute product counts for each category
  const allVisibleCount = products.filter((p) => p.isVisible !== false).length;

  return (
    <div className="space-y-16 pb-16">
      
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

              {/* Action Buttons - Smoothly Scroll to Products Catalog on Main Page */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToCatalogWithCategory('personal-care')}
                  className="px-6 py-3.5 bg-[#1B4D2E] hover:bg-[#153D24] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span>{pageData.heroBtnPrimaryText || 'Explore Personal Care'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToCatalogWithCategory('home-care')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-[#1B4D2E] border border-[#2C5E43] text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{pageData.heroBtnSecondaryText || 'Home & Car Cleaners'}</span>
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
                <div className="aspect-4/3 w-full overflow-hidden bg-[#EDF3EE]">
                  <img
                    src={pageData.heroImageUrl || '/hero-botanical-banner.jpg'}
                    alt="HMI Organics pure botanical products"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1F5433]">
                    <Sparkles className="w-4 h-4 text-[#2C5E43]" />
                    <span>{pageData.heroGuaranteeTitle}</span>
                  </div>
                  <p className="text-xs text-[#52705C] leading-relaxed">
                    {pageData.heroGuaranteeSubtitle}
                  </p>
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

      {/* 3. ALL PRODUCTS CATALOG WITH LIVE CATEGORY FILTER & PAGINATION (NO SEE MORE BUTTONS) */}
      <section id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E1EAE3] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
              <Leaf className="w-3.5 h-3.5 text-[#2C5E43]" />
              <span>Complete Botanical Collection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#112F1C]">
              Our Pure Handcrafted Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6F58]">
              Saare organic products yahin par browse karein — category filter select karein ya neeche pages par switch karein.
            </p>
          </div>

          {/* Search bar inside catalog */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products or ingredients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Filter Tabs (Category system retained without navigating away!) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#1B4D2E] text-white shadow-sm ring-2 ring-[#1B4D2E]/20'
                : 'bg-white text-slate-700 border border-[#D5E1D7] hover:bg-[#F3F8F4]'
            }`}
          >
            <span>🌿 All Products</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
              activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#EBF3ED] text-[#1B4D2E]'
            }`}>
              {allVisibleCount}
            </span>
          </button>

          {storeCategories.map((cat) => {
            const count = products.filter((p) => p.isVisible !== false && p.category === cat.id).length;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B4D2E] text-white shadow-sm ring-2 ring-[#1B4D2E]/20'
                    : 'bg-white text-slate-700 border border-[#D5E1D7] hover:bg-[#F3F8F4]'
                }`}
              >
                <span>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EBF3ED] text-[#1B4D2E]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
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
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#DFE7E1] space-y-3 p-8">
            <PackageOpen className="w-12 h-12 text-[#99B6A1] mx-auto" />
            <h3 className="font-bold text-base text-[#143721]">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Selected category ya search query ke mutabiq koi product available nahi hai. Filter reset karke dobara check karein.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setPage(1);
              }}
              className="px-4 py-2 bg-[#EEF5EF] text-[#1B4D2E] font-semibold text-xs rounded-xl hover:bg-[#E2EDE4] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS (Configured by Admin Range) */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-[#E1EAE3] flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Showing Range Summary */}
            <div className="text-xs text-[#4F705A]">
              Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{totalProducts}</strong> products
              <span className="text-slate-400 mx-1.5">·</span>
              <span>Page <strong>{safePage}</strong> of <strong>{totalPages}</strong></span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span className="text-[11px] text-slate-400">({itemsPerPage} products per page)</span>
            </div>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-[#D5E1D7] bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                const isActive = num === safePage;
                return (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`min-w-9 h-9 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#1B4D2E] text-white shadow-sm ring-2 ring-[#1B4D2E]/20'
                        : 'bg-white text-slate-700 border border-[#D5E1D7] hover:bg-[#F3F8F4]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-[#D5E1D7] bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Next Page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </section>

      {/* 4. TRUST BADGES & CONTACT HIGHLIGHTS */}
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

      {/* 5. VERIFIED CUSTOMER TESTIMONIALS WITH STAR RATINGS */}
      <TestimonialsSection />

    </div>
  );
};
