import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = false,
  className = '' 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Hex-Node Mark */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Glow */}
        <div className="absolute inset-0 bg-emerald-500/25 rounded-xl blur-sm transform group-hover:scale-110 transition-transform"></div>
        
        {/* Hexagon/Node Icon */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#0e1d2d] to-[#09131e] border border-emerald-500/40 p-1.5 shadow-lg flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full text-emerald-400"
          >
            {/* Geometric nodes and lines */}
            <path 
              d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinejoin="round" 
              className="text-emerald-500"
            />
            <path 
              d="M12 6L17 9V15L12 18L7 15V9L12 6Z" 
              stroke="#34d399" 
              strokeWidth="1.4" 
              strokeLinejoin="round"
              fill="rgba(16, 185, 129, 0.15)"
            />
            <circle cx="12" cy="12" r="2" fill="#10B981" />
            <path d="M12 2V6M20.66 7L17 9M20.66 17L17 15M12 22V18M3.34 17L7 15M3.34 7L7 9" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-center tracking-tight font-extrabold text-slate-100">
          <span className={`tracking-wider ${titleSizes[size]}`}>
            BIT <span className="text-emerald-400 font-black">TRADE</span> NET
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400/90 mt-0.5">
            Trade Smarter. Move Faster.
          </span>
        )}
      </div>
    </div>
  );
};
