import React, { useState } from 'react';
import { Product } from '../types';
import { BRAND_INFO } from '../data/products';
import { X, MessageCircle, Check, Plus, Minus, Leaf, Sparkles, Shield } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  whatsappPhone?: string;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  whatsappPhone,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const total = (product.pricePkr || 0) * quantity;
  const activePhone = whatsappPhone || BRAND_INFO.phoneRaw;

  const whatsappUrl = `https://wa.me/${activePhone}?text=${encodeURIComponent(
    `Hi HMI Organics, I want to order ${quantity}x "${product.name}" (${product.volumeOrWeight}) for Rs. ${total.toLocaleString()}. Please provide delivery details.`
  )}`;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E1E8E2] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#F8FAF8] border-b border-[#E3EDE5] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#52705D] mb-1">
              <span className="font-semibold uppercase tracking-wider">{product.category.replace('-', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>{product.subCategory}</span>
              <span aria-hidden="true">·</span>
              <span>{product.volumeOrWeight}</span>
            </div>
            <h2 className="font-display font-bold text-xl text-[#163824]">
              {product.name}
            </h2>
            <p className="text-xs text-[#4C6654] mt-0.5">{product.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          
          {/* Main Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Description & Formula
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {product.description}
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Key Benefits
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(product.benefits || ['Safe, pure & eco-friendly formulation']).map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-[#F7FAF7] p-2.5 rounded-xl border border-[#E4ECE5]">
                  <Check className="w-3.5 h-3.5 text-[#2C5E43] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Ingredients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C5E43] mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Active Herbal & Pure Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(product.keyIngredients || ['Natural Botanical Extracts']).map((item, i) => (
                <span
                  key={i}
                  className="text-xs text-[#234A32] bg-[#EAF2EC] px-2.5 py-1 rounded-md border border-[#D0E2D4]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* How to use */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE8DD] text-xs">
            <span className="font-bold text-[#8C6D2B] uppercase tracking-wider block mb-1">
              Recommended Usage
            </span>
            <p className="text-[#594B30] leading-relaxed">
              {product.howToUse || 'Apply as directed on the packaging.'}
            </p>
          </div>

          {/* Eco Highlights */}
          <div className="flex items-center gap-3 text-[11px] text-[#557762] pt-1">
            {(product.ecoHighlights || ['100% Herbal', 'Cruelty-Free']).map((eco, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D7C58]" />
                {eco}
              </span>
            ))}
          </div>

        </div>

        {/* Purchase Footer Bar */}
        <div className="p-5 bg-[#F6FAF6] border-t border-[#E2EBE3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Quantity */}
            <div className="flex items-center border border-[#CCDCD0] rounded-xl bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl transition-colors cursor-pointer"
                aria-label="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-bold text-slate-800 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl transition-colors cursor-pointer"
                aria-label="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Price */}
            <div>
              <span className="text-[10px] text-slate-500 block">Total</span>
              <span className="text-base font-bold text-[#163824] tabular-nums">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleAdd}
              className="flex-1 sm:flex-initial px-4 py-3 bg-white hover:bg-slate-50 border border-[#2C5E43] text-[#2C5E43] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              {added ? '✓ Added to Basket' : '+ Add to Basket'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1FB858] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
