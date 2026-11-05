import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, Category } from '../../types';
import { X, Save, Leaf, Sparkles, Check, AlertCircle, Eye, EyeOff, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  productToEdit?: Product | null;
  categories?: Category[];
}

const EMOJI_OPTIONS = ['🌿', '🧴', '🧼', '🪥', '🫧', '🍋', '🚗', '✨', '🪟', '🪵', '🐝', '🌲', '🧺', '🌸', '🍃', '💧', '🌾', '🌱'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories = [],
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('personal-care');
  const [subCategory, setSubCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [volumeOrWeight, setVolumeOrWeight] = useState('');
  const [pricePkr, setPricePkr] = useState<number | string>(500);
  const [keyIngredientsText, setKeyIngredientsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [isBestseller, setIsBestseller] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [ecoHighlightsText, setEcoHighlightsText] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🌿');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      setError(null);
      const res = await api.uploadImage(file);
      setImageUrl(res.url);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image file');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'personal-care');
      setSubCategory(productToEdit.subCategory || '');
      setTagline(productToEdit.tagline || '');
      setDescription(productToEdit.description || '');
      setVolumeOrWeight(productToEdit.volumeOrWeight || '');
      setPricePkr(productToEdit.pricePkr || 500);
      setKeyIngredientsText((productToEdit.keyIngredients || []).join(', '));
      setBenefitsText((productToEdit.benefits || []).join('\n'));
      setHowToUse(productToEdit.howToUse || '');
      setIsBestseller(Boolean(productToEdit.isBestseller));
      setIsVisible(productToEdit.isVisible !== undefined ? productToEdit.isVisible : true);
      setEcoHighlightsText((productToEdit.ecoHighlights || []).join(', '));
      setCustomEmoji(productToEdit.customEmoji || (productToEdit.category === 'personal-care' ? '🌿' : '✨'));
      setImageUrl(productToEdit.imageUrl || '');
    } else {
      // Defaults for new product
      setName('');
      setCategory('personal-care');
      setSubCategory('Skin Care');
      setTagline('');
      setDescription('');
      setVolumeOrWeight('250ml Bottle');
      setPricePkr(550);
      setKeyIngredientsText('Pure Botanical Extract, Cold-Pressed Essential Oil');
      setBenefitsText('Hydrates and nourishes naturally\n100% chemical free\nGentle on sensitive skin');
      setHowToUse('Apply evenly and massage gently.');
      setIsBestseller(false);
      setIsVisible(true);
      setEcoHighlightsText('100% Herbal, Sulfate-Free, Cruelty-Free');
      setCustomEmoji('🌿');
      setImageUrl('');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const ingredients = keyIngredientsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const benefits = benefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const eco = ecoHighlightsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Partial<Product> = {
        name: name.trim(),
        category,
        subCategory: subCategory.trim() || (category === 'personal-care' ? 'General Care' : 'General Cleaner'),
        tagline: tagline.trim(),
        description: description.trim(),
        volumeOrWeight: volumeOrWeight.trim() || 'Standard Pack',
        pricePkr: Number(pricePkr) || 0,
        keyIngredients: ingredients.length ? ingredients : ['Natural Botanical Extracts'],
        benefits: benefits.length ? benefits : ['Safe, pure & eco-friendly formulation'],
        howToUse: howToUse.trim(),
        isBestseller,
        isVisible,
        ecoHighlights: eco.length ? eco : ['Zero Toxic Fillers', 'Eco-Friendly'],
        customEmoji,
        imageUrl: imageUrl.trim() || undefined,
      };

      if (productToEdit) {
        payload.id = productToEdit.id;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D5E1D7] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#F6FAF6] border-b border-[#E2EBE3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1B4D2E] text-white rounded-xl">
              {productToEdit ? <Sparkles className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#163824]">
                {productToEdit ? 'Edit Product Details' : 'Add New Product to Store'}
              </h3>
              <p className="text-xs text-[#5D7A68]">
                {productToEdit
                  ? `Updating: ${productToEdit.name}`
                  : 'Add a new herbal or eco cleaning product with instant WhatsApp ordering'}
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Herbal Rose Water & Aloe Toner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as ProductCategory;
                  setCategory(newCat);
                  const matched = categories.find((c) => c.id === newCat);
                  if (matched?.icon) {
                    setCustomEmoji(matched.icon);
                  } else if (newCat === 'personal-care') {
                    setSubCategory('Skin Care');
                    setCustomEmoji('🌿');
                  } else {
                    setSubCategory('Kitchen Care');
                    setCustomEmoji('✨');
                  }
                }}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ''}{c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="personal-care">🌿 Personal Care (Hair, Skin, Teeth)</option>
                    <option value="home-care">✨ Home & Car Care (Cleaners, Polish, Laundry)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* SubCategory, Volume & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                placeholder={category === 'personal-care' ? 'e.g. Hair Care, Skin Care' : 'e.g. Kitchen, Auto, Floors'}
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Size / Volume / Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 200ml, 500ml, 1kg"
                value={volumeOrWeight}
                onChange={(e) => setVolumeOrWeight(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price (PKR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 750"
                value={pricePkr}
                onChange={(e) => setPricePkr(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Short Tagline / Catchphrase
            </label>
            <input
              type="text"
              placeholder="e.g. Pure Botanical Refreshment & Enamel Shield"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the product formula, effectiveness, and why customers will love it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Key Ingredients */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Key Ingredients (Separate with commas)
            </label>
            <input
              type="text"
              placeholder="e.g. Clove Oil, Cold-Pressed Almond Oil, Aloe Vera, Peppermint"
              value={keyIngredientsText}
              onChange={(e) => setKeyIngredientsText(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Key Benefits */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Key Benefits (One benefit per line)
            </label>
            <textarea
              rows={3}
              placeholder="Hydrates deeply without greasiness&#10;Removes 99% stubborn residue naturally&#10;Safe for sensitive skin & children"
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* How To Use */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              How To Use Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Apply 2-3 drops to clean skin or dilute 1 cap in 5L of mop water"
              value={howToUse}
              onChange={(e) => setHowToUse(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Eco Highlights */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Eco & Safety Highlights (Separate with commas)
            </label>
            <input
              type="text"
              placeholder="e.g. 100% Biodegradable, Sulfate-Free, Cruelty-Free, Non-Corrosive"
              value={ecoHighlightsText}
              onChange={(e) => setEcoHighlightsText(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
            />
          </div>

          {/* Product Photo / Image Upload */}
          <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-[#E1EDE4] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-4 h-4 text-[#2C5E43]" />
                Product Photo / Custom Image
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Photo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {imageUrl ? (
                <div className="w-16 h-16 rounded-xl border border-slate-300 overflow-hidden shrink-0 bg-white">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/hero-botanical-banner.jpg';
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-white">
                  <ImageIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px]">No photo</span>
                </div>
              )}

              <div className="flex-1 w-full space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (https://... or /uploads/...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 bg-[#EEF5EF] hover:bg-[#E2EDE4] text-[#1B4D2E] text-xs font-bold rounded-xl cursor-pointer border border-[#CDE3D2] shrink-0 transition-colors">
                    {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400">
                  Upload bottle / pack photo from your device, or leave blank to use the icon below.
                </p>
              </div>
            </div>
          </div>

          {/* Product Icon & Bestseller Toggle */}
          <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-[#E1EDE4] space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Product Representation Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setCustomEmoji(emoji)}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      customEmoji === emoji
                        ? 'bg-white border-[#2C5E43] shadow-xs scale-110'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Feature as Bestseller</span>
                <span className="text-[11px] text-slate-500">Highlights this item with a bestseller tag on product cards</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2C5E43]"></div>
              </label>
            </div>

            {/* Public Listing Visibility Toggle (Show / Hide) */}
            <div className="pt-3 border-t border-[#E1EDE4] flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>Show Product in Public Listing</span>
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {isVisible
                    ? 'Visible to public shoppers across store catalog and category pages'
                    : 'Hidden from public store listings (remains editable in admin portal)'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
