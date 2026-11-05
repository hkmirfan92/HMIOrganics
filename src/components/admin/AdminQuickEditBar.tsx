import React from 'react';
import { PageId } from '../../types';
import { api } from '../../services/api';
import { Edit3, Settings, ShieldCheck, LogOut, ExternalLink, Sparkles } from 'lucide-react';

interface AdminQuickEditBarProps {
  isAdmin: boolean;
  currentPage: PageId;
  onOpenPageEditor: () => void;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

export const AdminQuickEditBar: React.FC<AdminQuickEditBarProps> = ({
  isAdmin,
  currentPage,
  onOpenPageEditor,
  onNavigate,
  onLogout,
}) => {
  // If not logged in as admin or already in admin portal, don't show
  if (!isAdmin || currentPage === 'admin') return null;

  const pageNames: Record<PageId, string> = {
    home: 'Home Page',
    'personal-care': 'Personal Care Page',
    'home-care': 'Home & Car Care Page',
    about: 'About Us Page',
    contact: 'Contact Us Page',
    admin: 'Admin Portal',
  };

  const currentPageName = pageNames[currentPage] || 'This Page';
  const isSuperAdmin = api.getRole() === 'super_admin';

  return (
    <aside
      aria-label="Admin live edit toolbar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-fit px-4 py-2.5 bg-[#143721]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-[#2B6340] flex items-center gap-3 text-xs animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-[#2C5E43]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-[#A7F3D0] hidden sm:inline">
          {isSuperAdmin ? 'Super Admin' : 'Subadmin'}
        </span>
        <span className="text-[#C8E4D1] text-[11px] truncate max-w-[130px] sm:max-w-none">
          {currentPageName}
        </span>
      </div>

      {/* Edit This Page Button (Super Admin Only) */}
      {isSuperAdmin && (
        <button
          onClick={onOpenPageEditor}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20BC59] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer text-xs"
          title="Edit text, banners, and sections on this page"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit {currentPageName}</span>
        </button>
      )}

      {/* Switch to Admin Portal */}
      <button
        onClick={() => onNavigate('admin')}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#D8EADB] rounded-xl transition-all cursor-pointer text-xs"
        title="Open full catalog and store settings"
      >
        <Settings className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Catalog & Settings</span>
      </button>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="inline-flex items-center gap-1 p-1.5 text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-lg transition-colors cursor-pointer"
        title="Logout from Admin"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
