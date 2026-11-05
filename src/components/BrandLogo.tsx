import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  inverted?: boolean;
  customLogoUrl?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  inverted = false,
  customLogoUrl,
}) => {
  // Dimension definitions calibrated for the 715x532 original logo ratio
  const config = {
    sm: {
      imgHeight: 'h-8 sm:h-9',
      box: 'px-2 py-1 rounded-xl',
      title: 'text-base',
      sub: 'text-[9px]',
    },
    md: {
      imgHeight: 'h-11 sm:h-12',
      box: 'px-2.5 py-1 rounded-xl',
      title: 'text-xl sm:text-2xl',
      sub: 'text-[10px]',
    },
    lg: {
      imgHeight: 'h-16 sm:h-20',
      box: 'px-3 py-2 rounded-2xl',
      title: 'text-2xl sm:text-3xl',
      sub: 'text-xs',
    },
    xl: {
      imgHeight: 'h-24 sm:h-28',
      box: 'px-4 py-3 rounded-2xl',
      title: 'text-3xl sm:text-4xl',
      sub: 'text-sm',
    },
  }[size];

  // Authentic original logo uploaded by the user, with customLogoUrl override support
  const originalLogoUrl = '/assets/aistudio/IMG-20261007-WA0000-Photoroom_407330cc.png';
  const fallbackLogoUrl = '/hmi-organics-logo.png';
  const activeLogo = customLogoUrl || originalLogoUrl;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brandmark with editable logo support and fallback to authentic original */}
      <div
        className={`relative shrink-0 bg-white rounded-xl shadow-xs border border-[#E3ECE5] flex items-center justify-center transition-transform duration-300 hover:scale-105 ${config.box}`}
      >
        <img
          src={activeLogo}
          alt="HMI Organics — Pure, Natural & Trusted Care"
          className={`${config.imgHeight} w-auto object-contain max-h-full block`}
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackLogoUrl) {
              e.currentTarget.src = fallbackLogoUrl;
            }
          }}
        />
      </div>

      {/* Brand wordmark alongside logo */}
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <span
            className={`font-display font-extrabold tracking-tight leading-none ${config.title} ${
              inverted ? 'text-white' : 'text-[#143721]'
            }`}
          >
            HMI{' '}
            <span
              className={`font-serif italic font-normal ${
                inverted ? 'text-[#98EAB0]' : 'text-[#2C5E43]'
              }`}
            >
              Organics
            </span>
          </span>
          <span
            className={`font-semibold tracking-wider uppercase mt-1 ${config.sub} ${
              inverted ? 'text-[#A0B9A5]' : 'text-[#55765F]'
            }`}
          >
            Pure · Natural · Trusted
          </span>
        </div>
      )}
    </div>
  );
};
