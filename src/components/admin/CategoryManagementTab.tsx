import React, { useState } from 'react';
import { Category, Product, BrandSettings } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FolderPlus,
  Save,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';

interface CategoryManagementTabProps {
  categories: Category[];
  products: Product[];
  settings: BrandSettings;
  onAddCategory: (category: Partial<Category>) => Promise<void>;
  onUpdateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onUpdateSettings: (settings: Partial<BrandSettings>) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const CategoryManagementTab: React.FC<CategoryManagementTabProps> = ({
  categories,
  products,
  settings,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSettings,
  onShowToast,
}) => {
  // Products per page range state
  const [rangeInput, setRangeInput] = useState<number>(settings?.productsPerPage || 12);
  const [isSavingRange, setIsSavingRange] = useState(false);

  // Category Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slugId, setSlugId] = useState('');
  const [icon, setIcon] = useState('🌿');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle saving the products-per-page range
  const handleSaveRange = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(rangeInput);
    if (isNaN(val) || val < 1) {
      onShowToast('Please enter a valid number (minimum 1 product per page)');
      return;
    }

    try {
      setIsSavingRange(true);
      await onUpdateSettings({ productsPerPage: Math.max(1, Math.min(60, val)) });
      onShowToast(`Pagination range saved: ${val} products per page!`);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update range');
    } finally {
      setIsSavingRange(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlugId('');
    setIcon('🌿');
    setDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlugId(cat.id);
    setIcon(cat.icon || '🌿');
    setDescription(cat.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, {
          name: name.trim(),
          icon: icon.trim() || '🌿',
          description: description.trim(),
        });
        onShowToast(`Category "${name}" updated successfully!`);
      } else {
        const generatedId = (slugId.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
          .toLowerCase();
        await onAddCategory({
          id: generatedId,
          name: name.trim(),
          icon: icon.trim() || '🌿',
          description: description.trim(),
        });
        onShowToast(`New Category "${name}" created successfully!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await onDeleteCategory(categoryToDelete.id);
      onShowToast(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const EMOJI_PRESETS = ['🌿', '✨', '🧴', '🚗', '🧼', '🌸', '💧', '🍃', '🍵', '🛁', '🏡', '⭐'];

  return (
    <div className="space-y-8">
      {/* SECTION 1: PAGINATION & PRODUCTS PER PAGE RANGE CONFIGURATION */}
      <div className="bg-gradient-to-br from-[#F5FAF6] to-white rounded-3xl p-6 sm:p-8 border border-[#D5EADB] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C5E43] uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Products Per Page (Pagination Range)</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[#143721]">
              Main Page Products Display Range
            </h3>
            <p className="text-xs text-[#4F705A] max-w-2xl leading-relaxed">
              Main page par aik page me kitne products show hon? Jab products is number se zyada honge to neeche 
              <strong> Page 1, Page 2, Page 3</strong> ke buttons automatically display honge.
            </p>
          </div>

          <form onSubmit={handleSaveRange} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#CCE2D1] shadow-2xs">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                Products Per Page:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-sm font-bold px-2 py-2 bg-[#FAFDFB] border border-[#B6D6BE] rounded-xl text-[#143721] focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
                <button
                  type="submit"
                  disabled={isSavingRange}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B4D2E] hover:bg-[#143A22] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingRange ? 'Saving...' : 'Save Range'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Range Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-medium text-slate-500">Quick Range Presets:</span>
          {[4, 6, 8, 10, 12, 16].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => {
                setRangeInput(num);
                onUpdateSettings({ productsPerPage: num })
                  .then(() => onShowToast(`Pagination range updated to ${num} products per page!`))
                  .catch(() => {});
              }}
              className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                settings?.productsPerPage === num || rangeInput === num
                  ? 'bg-[#1B4D2E] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-[#D5E1D7] hover:bg-slate-100'
              }`}
            >
              {num} Products
            </button>
          ))}
          <span className="text-[11px] text-[#2C5E43] font-medium ml-2">
            ✓ Currently Active: <strong>{settings?.productsPerPage || 12} items per page</strong>
          </span>
        </div>
      </div>

      {/* SECTION 2: CATEGORY MANAGEMENT */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-[#143721] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2C5E43]" />
              <span>Store Product Categories</span>
            </h3>
            <p className="text-xs text-slate-500">
              Nayi categories banayein ya purani delete karein. Main page par har category ka filter tab hoga.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Categories Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const prodCount = products.filter((p) => p.category === cat.id).length;
            const isProtected = categories.length <= 1;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-[#DFE7E1] shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-[#F3F8F4] rounded-xl border border-[#D5E5D8]">
                        {cat.icon || '🌿'}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-[#143721]">{cat.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">id: {cat.id}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#EBF5EE] text-[#1B4D2E] border border-[#CFE7D5]">
                      {prodCount} Products
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Category Filter Tab Active
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-slate-500 hover:text-[#1B4D2E] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      disabled={isProtected}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isProtected
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title={isProtected ? 'Cannot delete the only remaining category' : 'Delete Category'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#D5E1D7] overflow-hidden">
            <div className="px-6 py-5 bg-[#F6FAF6] border-b border-[#E2EBE3] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[#163824]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#5D7A68]">
                  Store products ko organize karne ke liye category define karein
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Care / Hair Care / Home Polish"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlugId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
              </div>

              {!editingCategory && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Slug ID (Auto-generated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. skin-care"
                    value={slugId}
                    onChange={(e) => setSlugId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full text-xs font-mono px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category Icon / Emoji
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="🌿"
                    className="w-16 text-center text-lg p-2 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                  <span className="text-[11px] text-slate-500">Pick from common icons:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_PRESETS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                        icon === em ? 'bg-emerald-100 border border-emerald-400' : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short explanation of products included in this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#143B23] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Delete Category "{categoryToDelete.name}"?
                </h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this category?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed">
              <strong>Notice:</strong> Is category ke under mojood products delete <strong>nahi honge</strong>. Wo automatically default category me safely reassign ho jayenge taake koi product miss na ho.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
