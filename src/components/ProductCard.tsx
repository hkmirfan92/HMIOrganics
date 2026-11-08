import React from 'react';
import { Product } from '../types';
import { BRAND_INFO } from '../data/products';
import { MessageCircle, Plus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
  whatsappPhone?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isInCart = false,
  whatsappPhone,
}) => {
  const activePhone = whatsappPhone || BRAND_INFO.phoneRaw;
  const whatsappOrderUrl = `https://wa.me/${activePhone}?text=${encodeURIComponent(
    `Hi HMI Organics, I would like to order "${product.name}" (${product.volumeOrWeight}). Please share availability and delivery details.`
  )}`;

  // Product specific color accents and icon motifs
  const isPersonalCare = product.category === 'personal-care';

  const defaultEmoji = () => {
    if (product.customEmoji) return product.customEmoji;
    switch (product.id) {
      case 'tooth-powder': return '🪥';
      case 'hair-growth-oil': return '🌿';
      case 'herbal-shampoo': return '🧴';
      case 'glycerin-soap': return '🧼';
      case 'herbal-handwash': return '🫧';
      case 'dishwash-liquid': return '🍋';
      case 'car-wash': return '🚗';
      case 'kitchen-degreaser': return '✨';
      case 'glass-cleaner': return '🪟';
      case 'table-cleaner': return '🪵';
      case 'furniture-polish': return '🐝';
      case 'floor-cleaner-phenyl': return '🌲';
      case 'laundry-powder': return '🧺';
      default: return isPersonalCare ? '🌿' : '✨';
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#E3ECE5] hover:border-[#BFD8C5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image / Visual Showcase Area */}
      <div className="relative aspect-4/3 bg-gradient-to-b from-[#F7FAF7] to-[#EEF5F0] overflow-hidden flex items-center justify-center p-6 border-b border-[#E8EFE9]">
        
        {/* Subtle Organic Background Texture & Brand Motif */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2C5E43_0.75px,transparent_0.75px)] [background-size:16px_16px]" />

        {/* Artistic Product Representation Graphic or Custom Photo */}
        {product.imageUrl ? (
          <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="relative z-10 w-28 h-28 rounded-2xl bg-white/90 shadow-sm border border-[#D7E5DA] flex flex-col items-center justify-center text-center p-3 group-hover:scale-105 transition-transform duration-300">
            <span className="text-3xl mb-1 select-none">
              {defaultEmoji()}
            </span>
            <span className="text-[10px] font-bold text-[#1B4D2E] uppercase tracking-wider line-clamp-1">
              {product.volumeOrWeight}
            </span>
            <span className="text-[9px] text-slate-500 line-clamp-1">
              {isPersonalCare ? '100% Herbal' : 'Plant-Powered'}
            </span>
          </div>
        )}

        {/* Quiet Bestseller / Key Indicator (Text only, no pill sandwich) */}
        {product.isBestseller && (
          <div className="absolute top-3 left-3 text-[11px] font-semibold text-[#18482A] tracking-wider uppercase bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#D5E6D8] shadow-2xs">
            Bestseller
          </div>
        )}

        {/* Quick View Floating Action */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-[#1B4D2E] rounded-full shadow-xs border border-slate-200 opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5E43]"
          aria-label={`Quick view ${product.name}`}
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Metadata line (Clean, unboxed text per Section 1.A) */}
          <div className="flex items-center gap-2 text-xs text-[#5E7A68]">
            <span className="font-medium">{product.subCategory || (isPersonalCare ? 'Personal Care' : 'Home Care')}</span>
            <span aria-hidden="true">·</span>
            <span>{product.volumeOrWeight || 'Standard Pack'}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-semibold text-[#163824] text-base leading-snug group-hover:text-[#255C39] transition-colors">
            {product.name || 'HMI Herbal Care'}
          </h3>

          {/* Product Brief Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description || 'Crafted with pure herbal extracts and plant-powered care.'}
          </p>

          {/* Key Ingredients Snippet */}
          <p className="text-[11px] text-[#486B52] line-clamp-1 pt-1 font-medium">
            <span className="text-slate-400 font-normal">Active: </span>
            {Array.isArray(product.keyIngredients) && product.keyIngredients.length > 0
              ? product.keyIngredients.filter(Boolean).slice(0, 3).join(', ')
              : 'Pure Botanical Extracts'}
          </p>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Retail Price</span>
              <span className="text-base font-bold text-[#163824] tabular-nums">
                Rs. {(typeof product.pricePkr === 'number' ? product.pricePkr : 500).toLocaleString()}
              </span>
            </div>

            {/* Add to Basket button */}
            <button
              onClick={() => onAddToCart(product)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isInCart
                  ? 'bg-[#E3EFE5] text-[#1B4D2E] border border-[#BFD9C4]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Add to WhatsApp Order Basket"
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1B4D2E]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Order</span>
                </>
              )}
            </button>
          </div>

          {/* Direct WhatsApp Order CTA */}
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#1B4D2E] hover:bg-[#153D24] rounded-xl shadow-xs hover:shadow transition-all group/btn"
          >
            <MessageCircle className="w-4 h-4 text-[#8CE39E] group-hover/btn:scale-110 transition-transform" />
            <span>Order via WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};
