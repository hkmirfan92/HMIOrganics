import React, { useState } from 'react';
import { CartItem } from '../types';
import { BRAND_INFO } from '../data/products';
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface WhatsAppCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBrowseProducts: () => void;
  whatsappPhone?: string;
}

export const WhatsAppCartModal: React.FC<WhatsAppCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseProducts,
  whatsappPhone,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  if (!isOpen) return null;

  const totalPkr = items.reduce(
    (sum, item) => sum + (item.product.pricePkr || 0) * item.quantity,
    0
  );

  const handleSendToWhatsApp = () => {
    let message = `🌿 *HMI Organics — New Order Inquiry*\n\n`;
    
    if (customerName.trim()) {
      message += `👤 *Customer Name:* ${customerName.trim()}\n`;
    }
    if (deliveryCity.trim()) {
      message += `📍 *City / Region:* ${deliveryCity.trim()}\n`;
    }
    if (deliveryAddress.trim()) {
      message += `🏠 *Delivery Address:* ${deliveryAddress.trim()}\n`;
    }
    message += `\n📦 *Order Items:*\n`;

    items.forEach((item, index) => {
      const itemTotal = (item.product.pricePkr || 0) * item.quantity;
      message += `${index + 1}. *${item.product.name}* (${item.product.volumeOrWeight})\n`;
      message += `   Qty: ${item.quantity} x Rs. ${item.product.pricePkr} = Rs. ${itemTotal.toLocaleString()}\n`;
    });

    message += `\n💰 *Estimated Total:* Rs. ${totalPkr.toLocaleString()}\n`;
    if (customerNotes.trim()) {
      message += `📝 *Notes/Special Request:* ${customerNotes.trim()}\n`;
    }
    message += `\nPlease confirm availability and payment/delivery details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const activePhone = whatsappPhone || BRAND_INFO.phoneRaw;
    const targetUrl = `https://wa.me/${activePhone}?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E1E8E2] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#F6FAF6] border-b border-[#E2EBE3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2C5E43] text-white rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#163824]">Your WhatsApp Order Basket</h3>
              <p className="text-xs text-[#5D7A68]">
                {items.length === 0 ? 'Basket is currently empty' : `${items.length} item${items.length > 1 ? 's' : ''} ready to dispatch`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Close basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#EEF5EF] text-[#2C5E43] rounded-full mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Your basket is empty</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our organic personal care and eco-friendly home cleaning collections.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C5E43] hover:bg-[#204933] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-[#1B3A27] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.product.volumeOrWeight} · Rs. {item.product.pricePkr} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-[#D5E1D7] rounded-lg bg-[#FAFDFB]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-l-lg transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-r-lg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1B3A27] w-18 text-right tabular-nums">
                        Rs. {((item.product.pricePkr || 0) * item.quantity).toLocaleString()}
                      </span>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total & clear */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear all items
                </button>
                <div className="text-right">
                  <span className="text-xs text-slate-500 mr-2">Subtotal:</span>
                  <span className="text-lg font-bold text-[#1B3A27] tabular-nums">
                    Rs. {totalPkr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Optional Quick Customer Details for WhatsApp prefill */}
              <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-[#E3EDE5] space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
                  Quick Delivery Information (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Fatima / Imran"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#D5E1D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Karachi / Lahore"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#D5E1D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Delivery Address or Notes</label>
                  <input
                    type="text"
                    placeholder="Area, Street address, or special notes"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5E1D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-5 bg-[#F6FAF6] border-t border-[#E2EBE3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#52705D]">
              Direct connection with HMI Organics support on WhatsApp.
            </p>
            <button
              onClick={handleSendToWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#25D366] hover:bg-[#20BC59] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Send Order to WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
