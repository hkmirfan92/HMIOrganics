import React, { useState, useEffect } from 'react';
import { AdminUser, SubadminCreateInput } from '../../types';
import { api } from '../../services/api';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Info,
} from 'lucide-react';

interface SubadminManagementTabProps {
  onNotify?: (message: string) => void;
}

export const SubadminManagementTab: React.FC<SubadminManagementTabProps> = ({ onNotify }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Reset password modal state
  const [resetTargetUser, setResetTargetUser] = useState<AdminUser | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Delete modal state
  const [deleteTargetUser, setDeleteTargetUser] = useState<AdminUser | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadSubadmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await api.getSubadmins();
      setUsers(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load team administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubadmins();
  }, []);

  const handleCreateSubadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      setCreateSubmitting(true);
      const created = await api.createSubadmin({
        name: newName.trim(),
        username: newUsername.trim(),
        password: newPassword,
        role: 'product_manager',
      });

      setUsers((prev) => [...prev, created]);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setIsCreating(false);
      onNotify?.(`Subadmin "${created.name}" created successfully with product management access`);
    } catch (err: any) {
      alert(err?.message || 'Failed to create subadmin');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    if (resetNewPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      setResetSubmitting(true);
      await api.resetSubadminPassword(resetTargetUser.id, resetNewPassword);
      setResetTargetUser(null);
      setResetNewPassword('');
      onNotify?.(`Password for "${resetTargetUser.name}" has been updated`);
    } catch (err: any) {
      alert(err?.message || 'Failed to reset password');
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUser) return;

    try {
      setDeleteSubmitting(true);
      await api.deleteSubadmin(deleteTargetUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTargetUser.id));
      setDeleteTargetUser(null);
      onNotify?.(`Subadmin "${deleteTargetUser.name}" has been removed`);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete subadmin');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const copyCredentials = (user: AdminUser) => {
    const text = `HMI Organics Admin Portal\nUsername: ${user.username}\nRole: Product Catalog Manager (Products Only)\nLogin Link: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
    onNotify?.(`Login credentials summary for "${user.name}" copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE7E1] p-12 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-[#2C5E43] animate-spin mx-auto" />
        <p className="text-sm text-slate-600 font-medium">Loading subadmins and role permissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DFE7E1] shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
            <ShieldCheck className="w-4 h-4 text-[#2C5E43]" />
            <span>Super Admin Security Center</span>
          </div>
          <h2 className="text-xl font-bold text-[#143721]">
            Subadmin & Product Manager Accounts
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Create limited-access staff logins who can <strong>only add, edit, and delete products</strong> in the catalog. They have zero access to frontend pages, SEO, analytics, or store settings.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2C5E43] hover:bg-[#1E432F] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isCreating ? 'Close Form' : 'Create New Subadmin'}</span>
        </button>
      </div>

      {/* RBAC Security Scope Info Notice */}
      <div className="bg-[#F2F8F4] border border-[#CDE5D5] rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-[#2C5E43] shadow-2xs shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-slate-700">
          <h4 className="font-bold text-[#153D26] text-sm">Strict Role-Based Security Enforcement (RBAC)</h4>
          <p className="text-slate-600 leading-relaxed">
            Every API request is cryptographically authenticated using SHA-256 session tokens. When a subadmin logs in:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-medium">
            <li className="flex items-center gap-1.5 text-emerald-800">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full permissions to Add, Edit & Delete Products</span>
            </li>
            <li className="flex items-center gap-1.5 text-rose-700">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Blocked from Frontend Pages editing (HTTP 403 Forbidden)</span>
            </li>
            <li className="flex items-center gap-1.5 text-rose-700">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Blocked from SEO Studio & Meta settings</span>
            </li>
            <li className="flex items-center gap-1.5 text-rose-700">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Blocked from Analytics, Pixels & Subadmin management</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Create Subadmin Form Box */}
      {isCreating && (
        <div className="bg-white rounded-2xl border-2 border-[#2C5E43]/30 p-6 shadow-md space-y-5 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#2C5E43]" />
              <h3 className="text-sm font-bold text-slate-900">Add New Product Catalog Subadmin</h3>
            </div>
            <span className="text-[11px] font-semibold text-[#2C5E43] bg-[#E8F3EC] px-2.5 py-1 rounded-full">
              Role: Product Catalog Manager Only
            </span>
          </div>

          <form onSubmit={handleCreateSubadmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Tariq - Catalog Editor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Login Email or Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., catalog@hmiorganics.com"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 pr-10 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Secured via cryptographic scrypt salt</span>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                The subadmin will log in via the same Admin Portal button, but will only see the Products Catalog.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2.5 bg-[#2C5E43] hover:bg-[#1E432F] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {createSubmitting ? 'Creating Subadmin...' : 'Create Subadmin'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7E1] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2C5E43]" />
            <h3 className="text-sm font-bold text-slate-900">Active Admin & Subadmin Accounts</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {users.length} {users.length === 1 ? 'account' : 'accounts'} registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FAF8] border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Username / Email</th>
                <th className="py-3 px-4">Role & Scope</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSuper = u.role === 'super_admin';

                return (
                  <tr key={u.id} className="hover:bg-[#FBFDFB]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSuper
                              ? 'bg-[#153D26] text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {u.username}
                    </td>

                    <td className="py-3.5 px-4">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#143721] text-white">
                          <ShieldCheck className="w-3 h-3 text-[#98EAB0]" />
                          <span>Super Admin (Full Root Access)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShoppingBag className="w-3 h-3 text-emerald-600" />
                          <span>Product Catalog Manager (Products Only)</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Copy credentials button */}
                        <button
                          onClick={() => copyCredentials(u)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Copy login info"
                        >
                          {copiedId === u.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Reset password button */}
                        <button
                          onClick={() => setResetTargetUser(u)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Reset user password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button (Super admin cannot be deleted) */}
                        {!isSuper ? (
                          <button
                            onClick={() => setDeleteTargetUser(u)}
                            className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete subadmin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span
                            className="p-1.5 text-slate-300 cursor-not-allowed"
                            title="Primary super administrator account cannot be deleted"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-3">
              <KeyRound className="w-5 h-5 text-[#2C5E43]" />
              <div>
                <h3 className="text-sm font-bold">Reset Password for Subadmin</h3>
                <p className="text-xs text-slate-500">{resetTargetUser.name} ({resetTargetUser.username})</p>
              </div>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetTargetUser(null);
                    setResetNewPassword('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-[#2C5E43] hover:bg-[#1E432F] text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {resetSubmitting ? 'Updating...' : 'Set New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Revoke Subadmin Access?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete the subadmin account for <strong>{deleteTargetUser.name}</strong> (<code>{deleteTargetUser.username}</code>)?
              Their active login sessions will be terminated immediately.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
              >
                {deleteSubmitting ? 'Deleting...' : 'Yes, Delete Subadmin'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
