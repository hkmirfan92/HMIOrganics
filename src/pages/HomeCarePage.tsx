import React, { useState, useMemo } from 'react';
import { Product, BrandSettings, CategoryPageContent } from '../types';
import { BRAND_INFO } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import { ProductCard } from '../components/ProductCard';
import { Search, Sparkles, ShieldCheck, MessageCircle, Droplets } from 'lucide-react';

interface HomeCarePageProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: Set<string>;
  products: Product[];
  settings?: BrandSettings;
  content?: CategoryPageContent;
}

export const HomeCarePage: React.FC<HomeCarePageProps> = ({
  onQuickView,
  onAddToCart,
  cartProductIds,
  products,
  settings,
  content,
}) => {
  const pageData = content || DEFAULT_PAGES_CONTENT.homeCare;
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeWhatsApp = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;

  const activePhoneRaw = settings?.phoneRaw || BRAND_INFO.phoneRaw;

  const homeCareList = useMemo(() => {
    return products.filter((p) => p.category === 'home-care' && p.isVisible !== false);
  }, [products]);

  const subCategories = useMemo(() => {
    const subs = Array.from(new Set(homeCareList.map((p) => p.subCategory).filter(Boolean)));
    return ['All', ...subs];
  }, [homeCareList]);

  const filteredProducts = useMemo(() => {
    return homeCareList.filter((product) => {
      const matchesCategory =
        selectedSubCategory === 'All' || product.subCategory === selectedSubCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const pName = (product.name || '').toLowerCase();
      const pDesc = (product.description || '').toLowerCase();
      const pTag = (product.tagline || '').toLowerCase();
      const pIngredients = Array.isArray(product.keyIngredients) ? product.keyIngredients : [];

      const matchesSearch =
        pName.includes(q) ||
        pDesc.includes(q) ||
        pTag.includes(q) ||
        pIngredients.some((i) => (i || '').toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [homeCareList, selectedSubCategory, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Category Hero Banner */}
      <section className="bg-gradient-to-r from-[#17382B] via-[#1E4A35] to-[#255C41] text-white py-12 md:py-16 border-b border-[#2C6346]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#98EAB0]">
                <Droplets className="w-4 h-4" />
                <span>{pageData.badge}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {pageData.title}
              </h1>
              <p className="text-sm sm:text-base text-[#D0EADB] leading-relaxed max-w-xl">
                {pageData.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#A8D3B8]">
                {pageData.highlights?.map((hl, idx) => (
                  <React.Fragment key={idx}>
                    <span>{hl}</span>
                    {idx < pageData.highlights.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#3E7C58]">
                <img
                  src={pageData.imageUrl || "/home-cleaning-banner.jpg"}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/home-cleaning-banner.jpg')) {
                      target.src = '/home-cleaning-banner.jpg';
                    }
                  }}
                  alt="HMI Organics Eco Home and Car Care Collection"
                  className="w-full h-64 sm:h-72 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#DFE7E1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Segmented SubCategory Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F2F6F3] rounded-xl overflow-x-auto max-w-full">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-white text-[#1B4D2E] shadow-2xs font-bold'
                    : 'text-[#4A6854] hover:text-[#1B4D2E]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cleaners, polish, wash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#DFE7E1] space-y-3">
            <p className="font-semibold text-slate-700">No home care products found</p>
            <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords</p>
            <button
              onClick={() => {
                setSelectedSubCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#1B4D2E] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
        )}

        {/* Household Bundle Offer Banner */}
        <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-[#EBE4D8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8C6D2B] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Household & Kitchen Cleaning Kits</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[#2B2314]">
              Equip Your Entire Home with HMI Organics
            </h3>
            <p className="text-xs text-[#635742] max-w-xl">
              Order our popular 5-in-1 Eco Home Starter Bundle (Dishwash + Kitchen Degreaser + Floor Phenyl + Glass Cleaner + Laundry Pack) with custom discount via WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/${activePhoneRaw}?text=${encodeURIComponent(
              'Hi HMI Organics, I am interested in inquiring about your Complete Eco Home Bundle Pack. Please share pricing and details.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#8AE09B]" />
            <span>Inquire Bundle on WhatsApp</span>
          </a>
        </div>

      </section>

    </div>
  );
};
