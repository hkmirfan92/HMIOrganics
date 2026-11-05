import React from 'react';
import { PageId, AboutPageContent } from '../types';
import { BRAND_INFO } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import { BrandLogo } from '../components/BrandLogo';
import {
  Leaf,
  ShieldCheck,
  Droplets,
  Heart,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Target,
  Compass
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  content?: AboutPageContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, content }) => {
  const pageData = content || DEFAULT_PAGES_CONTENT.about;

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#EEF5F0] to-[#FBFBFA] pt-12 pb-16 border-b border-[#E3ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F5433]">
              <Leaf className="w-4 h-4" />
              <span>{pageData.headerBadge}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112F1C] tracking-tight">
              {pageData.headerTitle}
            </h1>
            <p className="text-base sm:text-lg text-[#3E5C48] leading-relaxed">
              {pageData.headerDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Story Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
              <span>{pageData.storyBadge}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143721] leading-tight">
              {pageData.storyTitle}
            </h2>
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              {pageData.storyParagraphs?.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-[#183925]">
              {pageData.storyHighlights?.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F4FAF5] p-3 rounded-xl border border-[#D8EADB]">
                  <CheckCircle2 className="w-4 h-4 text-[#2C5E43] shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#D3E4D6]">
              <img
                src={pageData.storyImageUrl || "/about-craftsmanship.jpg"}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/about-craftsmanship.jpg')) {
                    target.src = '/about-craftsmanship.jpg';
                  }
                }}
                alt="HMI Organics artisanal herbal workshop"
                className="w-full h-96 sm:h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#DFEBE2] text-xs text-[#2A4B36]">
                <span className="font-bold text-[#143721]">Small-Batch Integrity:</span> {pageData.storyImageCaption || 'Every blend is hand-tested for stability, skin-neutral pH, and natural therapeutic potency.'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#FAFDFB] rounded-3xl border border-[#E1ECE3] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#143721]">
              {pageData.missionTitle || 'Our Mission'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {pageData.missionDescription}
            </p>
          </div>

          <div className="p-8 bg-[#FAFDFB] rounded-3xl border border-[#E1ECE3] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#143721]">
              {pageData.visionTitle || 'Our Vision'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {pageData.visionDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Stats Counter Strip */}
      {pageData.stats && pageData.stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#183925] text-white rounded-3xl p-8 sm:p-10 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {pageData.stats.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#96EAB1] block">
                    {st.value}
                  </span>
                  <span className="text-xs sm:text-sm text-[#C8E4D1] font-medium block">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* 3. The 4 HMI Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFDFB] rounded-3xl border border-[#E1ECE3] p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
              Our Guiding Standards
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#143721]">
              The 4 Pillars of HMI Organics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-[#DFEAE1] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#163824]">1. Authentic Herbs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We source real botanical actives: pure neem, shikakai, reetha soapnuts, lavender, clove, and aloe vera instead of cheap synthetic fragrance oils.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFEAE1] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#163824]">2. Zero Toxic Fillers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No caustic sodas, hydrochloric acids, artificial bleaches, parabens, or heavy synthetic perfumes that irritate skin or pollute indoor air.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFEAE1] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#163824]">3. Eco Runoff Safe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our home cleaners biodegrade rapidly and break down naturally. Mop runoff water and dishwater can safely irrigate plants and garden soil.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFEAE1] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2C5E43] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#163824]">4. Direct Customer Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We pride ourselves on personal, direct relationship with our customers via WhatsApp. Every question is answered by a real herbal care advocate.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Brand Emblem Spotlight */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-block p-6 bg-white rounded-3xl border border-[#D5E5D9] shadow-sm">
          <BrandLogo size="lg" showText={false} />
          <h3 className="font-display font-bold text-xl text-[#163824] mt-4">
            The HMI Organics Seal
          </h3>
          <p className="text-xs text-[#52705D] max-w-md mx-auto mt-2 leading-relaxed">
            The three green leaves represent Earth, Body, and Home in perfect balance. The enclosing circle signifies circular, sustainable ecology and continuous renewal.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('personal-care')}
            className="px-6 py-3 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Personal Care</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('home-care')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-[#1B4D2E] border border-[#2C5E43] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Home Care</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
