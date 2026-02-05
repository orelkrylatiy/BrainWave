import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SecretButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'purple' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

export function SecretButton({ 
  children, 
  icon, 
  onClick, 
  variant = 'default',
  size = 'md' 
}: SecretButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    
    // Reset clicked state after animation
    setTimeout(() => setIsClicked(false), 300);
  };

  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden backdrop-blur-sm border transition-all duration-300";
    
    switch (variant) {
      case 'purple':
        return {
          button: `${baseStyles} bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/70 text-white hover:shadow-lg hover:shadow-purple-500/25`,
          glow: "bg-gradient-to-r from-purple-400 to-pink-400"
        };
      case 'red':
        return {
          button: `${baseStyles} bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/70 text-white hover:shadow-lg hover:shadow-red-500/25`,
          glow: "bg-gradient-to-r from-red-400 to-pink-400"
        };
      case 'yellow':
        return {
          button: `${baseStyles} bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-400/70 text-white hover:shadow-lg hover:shadow-yellow-500/25`,
          glow: "bg-gradient-to-r from-yellow-400 to-orange-400"
        };
      default:
        return {
          button: `${baseStyles} bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/50 hover:from-pink-500/30 hover:to-purple-500/30 hover:border-pink-400/70 text-white hover:shadow-lg hover:shadow-pink-500/25`,
          glow: "bg-gradient-to-r from-pink-400 to-purple-400"
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-full';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-full';
      default:
        return 'px-6 py-3 text-base rounded-full';
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${styles.button}
          ${getSizeStyles()}
          font-semibold
          transform transition-all duration-300
          hover:scale-105 active:scale-95
          ${isClicked ? 'scale-95' : ''}
          flex items-center gap-2
        `}
      >
        {/* Shimmer effect on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          transform -skew-x-12 -translate-x-full
          transition-transform duration-700
          ${isHovered ? 'translate-x-full' : ''}
        `} />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {icon && (
            <span className={`transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
              {icon}
            </span>
          )}
          {children && <span>{children}</span>}
          {!icon && !children && (
            <>
              <Sparkles 
                size={16} 
                className={`transition-all duration-300 ${isHovered ? 'scale-110 animate-spin' : ''}`} 
              />
              <span>Сюрприз</span>
            </>
          )}
        </div>
        
        {/* Pulse effect */}
        {isClicked && (
          <div className={`
            absolute inset-0 rounded-full ${styles.glow}
            animate-ping opacity-30
          `} />
        )}
      </button>
      
      {/* Floating particles effect */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full ${styles.glow}
                opacity-60 animate-ping
              `}
              style={{
                left: `${20 + i * 10}%`,
                top: `${20 + (i % 2) * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}