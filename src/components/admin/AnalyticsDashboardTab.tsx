import React, { useState, useEffect } from 'react';
import { AnalyticsSettings, AnalyticsSummary } from '../../types';
import { api } from '../../services/api';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  MessageCircle,
  Smartphone,
  Monitor,
  RotateCcw,
  Settings2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsDashboardTabProps {
  onNotify?: (message: string) => void;
}

export const AnalyticsDashboardTab: React.FC<AnalyticsDashboardTabProps> = ({ onNotify }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ settings: AnalyticsSettings; summary: AnalyticsSummary } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Editable tracking IDs
  const [gaId, setGaId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAnalytics();
      setData(res);
      setGaId(res.settings.gaMeasurementId || '');
      setMetaPixelId(res.settings.metaPixelId || '');
      setGtmId(res.settings.gtmContainerId || '');
      setTrackingEnabled(res.settings.enableInternalTracker ?? true);
    } catch (err: any) {
      setError(err?.message || 'Failed to load store analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      const updated = await api.updateAnalyticsSettings({
        gaMeasurementId: gaId.trim(),
        metaPixelId: metaPixelId.trim(),
        gtmContainerId: gtmId.trim(),
        enableInternalTracker: trackingEnabled,
      });
      if (data) {
        setData({ ...data, settings: updated });
      }
      onNotify?.('Analytics settings and tracking IDs saved successfully');
    } catch (err: any) {
      setError(err?.message || 'Failed to update analytics settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetData = async () => {
    try {
      const res = await api.resetAnalytics();
      setData(res);
      setIsResetConfirmOpen(false);
      onNotify?.('Analytics metrics have been reset to fresh counters');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset analytics');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE7E1] p-12 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-[#2C5E43] animate-spin mx-auto" />
        <p className="text-sm text-slate-600 font-medium">Loading store analytics and customer conversion metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Unable to Load Analytics</h3>
        <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-[#2C5E43] text-white text-xs font-semibold rounded-xl hover:bg-[#1E432F] transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, settings } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DFE7E1] shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-[#143721] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2C5E43]" />
            Store Analytics & Customer Insights
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of visitor traffic, WhatsApp order conversions, top organic products, and marketing tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAnalytics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F6F3] hover:bg-[#E3EBE5] text-[#2C5E43] text-xs font-semibold rounded-xl border border-[#DFE7E1] transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-all cursor-pointer"
            title="Reset counters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Counters</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Visitors</span>
            <Users className="w-4 h-4 text-[#2C5E43]" />
          </div>
          <div className="text-2xl font-extrabold text-[#143721] tabular-nums">
            {summary.totalVisitors.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">All time store traffic</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pageviews</span>
            <Eye className="w-4 h-4 text-[#355B42]" />
          </div>
          <div className="text-2xl font-extrabold text-[#143721] tabular-nums">
            {summary.totalPageViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">Catalog browsing</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1F6E3B] uppercase tracking-wider">WhatsApp Clicks</span>
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1F6E3B] tabular-nums">
            {summary.totalWhatsAppClicks.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">Direct WhatsApp orders</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C6D2B] uppercase tracking-wider">Est. Revenue</span>
            <span className="text-xs font-bold text-[#8C6D2B]">PKR</span>
          </div>
          <div className="text-2xl font-extrabold text-[#8C6D2B] tabular-nums">
            Rs. {summary.estimatedRevenuePkr.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-700 block">From order intents</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#2C5E43] uppercase tracking-wider">Conversion</span>
            <TrendingUp className="w-4 h-4 text-[#2C5E43]" />
          </div>
          <div className="text-2xl font-extrabold text-[#2C5E43] tabular-nums">
            {summary.conversionRate}%
          </div>
          <span className="text-[10px] text-emerald-600 block">Visitors to WhatsApp orders</span>
        </div>

      </div>

      {/* Daily Activity Visual Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Daily Traffic & Conversion Trend (Recent 7 Days)</h3>
          <span className="text-xs text-slate-400">Pageviews vs WhatsApp Orders</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4">
          {summary.dailyViews.map((day) => {
            const maxViews = Math.max(...summary.dailyViews.map((d) => d.views), 1);
            const heightPercent = Math.min(Math.round((day.views / maxViews) * 100), 100);

            return (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <div className="w-full bg-slate-50 h-32 rounded-xl flex flex-col justify-end p-1 border border-slate-100 relative group">
                  <div
                    className="w-full bg-gradient-to-t from-[#2C5E43] to-[#4A8564] rounded-lg transition-all"
                    style={{ height: `${Math.max(heightPercent, 12)}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {day.views} views · {day.conversions} orders
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    {day.date.slice(5)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    {day.conversions} ord
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Top Products & Channels/Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Performing Products (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DFE7E1] shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#2C5E43]" />
              Top Products by Demand & Orders
            </h3>
            <span className="text-xs text-slate-400">{summary.topProducts.length} tracked items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF8] text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4 text-center">Cart Adds</th>
                  <th className="py-3 px-4 text-center">WhatsApp Orders</th>
                  <th className="py-3 px-4 text-right">Est. Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {summary.topProducts.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#FBFDFB]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#E8F0EC] text-[#2C5E43] font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium tabular-nums">{p.views}</td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium tabular-nums">{p.cartAdds}</td>
                    <td className="py-3 px-4 text-center font-bold text-[#2C5E43] tabular-nums">{p.orders}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#8C6D2B] tabular-nums">
                      Rs. {p.revenuePkr.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Channels & Device Split (1 Col) */}
        <div className="space-y-6">
          
          {/* Channel breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Traffic Acquisition Channels</h3>
            <div className="space-y-3">
              {summary.channelBreakdown.map((ch) => (
                <div key={ch.channel} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{ch.channel}</span>
                    <span className="font-bold text-[#2C5E43]">{ch.percentage}% ({ch.visitors})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#2C5E43] h-full rounded-full transition-all"
                      style={{ width: `${ch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Split */}
          <div className="bg-white p-5 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Device Breakdown</h3>
            <div className="grid grid-cols-2 gap-3">
              {summary.deviceBreakdown.map((d) => (
                <div key={d.device} className="p-3 bg-[#F8FAF8] rounded-xl border border-slate-100 text-center space-y-1">
                  {d.device === 'mobile' ? (
                    <Smartphone className="w-4 h-4 text-[#2C5E43] mx-auto" />
                  ) : (
                    <Monitor className="w-4 h-4 text-slate-500 mx-auto" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 capitalize block">{d.device}</span>
                  <span className="text-sm font-extrabold text-[#2C5E43] block">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Real-Time Live Activity Stream */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Customer Activity Stream
          </h3>
          <span className="text-xs text-slate-400">Last 50 recorded store interactions</span>
        </div>

        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
          {summary.recentEvents && summary.recentEvents.length > 0 ? (
            summary.recentEvents.map((ev) => (
              <div key={ev.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  {ev.type === 'whatsapp_click' ? (
                    <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </span>
                  ) : ev.type === 'cart_add' ? (
                    <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-md bg-slate-100 text-slate-600">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div>
                    <span className="font-semibold text-slate-800">
                      {ev.type === 'whatsapp_click'
                        ? 'Initiated WhatsApp Order'
                        : ev.type === 'cart_add'
                        ? 'Added to WhatsApp Cart'
                        : 'Viewed Page / Product'}
                    </span>
                    {ev.productName && (
                      <span className="text-slate-500 ml-1.5 font-medium">({ev.productName})</span>
                    )}
                    <span className="text-[11px] text-slate-400 ml-2">from {ev.city || 'Pakistan'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {ev.valuePkr ? (
                    <span className="font-bold text-[#8C6D2B]">Rs. {ev.valuePkr}</span>
                  ) : null}
                  <span className="text-[10px] text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No customer events recorded yet.</p>
          )}
        </div>
      </div>

      {/* External Analytics & Pixels Configuration Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFE7E1] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings2 className="w-5 h-5 text-[#2C5E43]" />
            <div>
              <h3 className="text-sm font-bold">Google Analytics 4 & Marketing Tracking Integration</h3>
              <p className="text-xs text-slate-500">
                Connect official Google Analytics 4 (GA4), Google Tag Manager, and Meta Pixel for real-time tracking
              </p>
            </div>
          </div>

          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F2F7F3] hover:bg-[#E3EDE5] text-[#1B4D2E] text-xs font-bold rounded-xl border border-[#CDE3D2] transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Open Google Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Google Analytics Setup Guide Box */}
        <div className="p-4 bg-[#F6FAF7] rounded-2xl border border-[#CCE2D1] text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#143721] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              گوگل اینالیٹکس (GA4) سیٹ اپ گائیڈ (Google Analytics Setup):
            </span>
            {gaId.trim().startsWith('G-') ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ● GA4 Configured ({gaId.trim()})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                ○ Setup Required
              </span>
            )}
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#3D5E48] leading-relaxed">
            <li><strong>analytics.google.com</strong> پر لاگ ان کریں اور اپنی ویب سائٹ کا نیا اکاؤنٹ / پراپرٹی بنائیں۔</li>
            <li><strong>Admin &gt; Data Streams &gt; Web</strong> پر کلک کر کے اپنی سائٹ کا ایڈریس درج کریں۔</li>
            <li>وہاں سے اپنا <strong>Measurement ID</strong> (مثلاً <code className="bg-white px-1 py-0.5 rounded border border-[#CDE3D2] font-mono text-[#183925]">G-XXXXXXXXXX</code>) کاپی کریں۔</li>
            <li>نیچے دیے گئے "Google Analytics 4 ID" باکس میں پیسٹ کریں اور <strong>"Save Analytics Configuration"</strong> دبائیں۔</li>
            <li>سائٹ کے تمام پیجز پر گوگل ٹیگ (gtag.js) خود بخود ایکٹو ہو جائے گا اور واٹس ایپ آرڈر کلکس بھی ٹریک ہوں گے۔</li>
          </ol>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Analytics 4 ID (GA4)
              </label>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43] font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Starts with 'G-', e.g. G-9H768XXXXX</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Tag Manager Container ID
              </label>
              <input
                type="text"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43] font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Optional container tag, e.g. GTM-N5KXXXX</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta Pixel ID (Facebook / Instagram)
              </label>
              <input
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="123456789012345"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FBFDFB] border border-[#D5E1D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">For Meta Ads conversion tracking</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={trackingEnabled}
                onChange={(e) => setTrackingEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2C5E43] rounded focus:ring-[#2C5E43]"
              />
              <span>Enable internal zero-cookie privacy-compliant analytics</span>
            </label>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingSettings ? 'Saving...' : 'Save Analytics Configuration'}
            </button>
          </div>

        </form>
      </div>

      {/* Confirmation Modal for Resetting Analytics */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Reset Analytics Counters?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will reset the total visitors, pageviews, and WhatsApp conversion counters to fresh state. Your third-party pixel IDs will not be affected.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm cursor-pointer"
              >
                Yes, Reset Counters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
