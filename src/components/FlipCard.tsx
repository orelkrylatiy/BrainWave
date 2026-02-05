import React, { useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';

interface FlipCardProps {
  title: string;
  description: string;
  icon: string;
  theme: 'light' | 'dark';
  onClick: () => void;
}

export function FlipCard({ title, description, icon, theme, onClick }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      onClick();
    }, 300);
  };

  return (
    <div className="group perspective-1000">
      <div
        className={`relative w-full h-80 transform-style-preserve-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl cursor-pointer overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-700/80 to-pink-700/80 border border-purple-400/30 hover:border-pink-400/50'
              : 'bg-gradient-to-br from-pink-200/80 to-purple-200/80 border border-pink-300/50 hover:border-purple-400/70'
          } backdrop-blur-sm shadow-2xl hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300`}
          onClick={handleClick}
        >
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="text-center">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {title}
              </h3>
            </div>
            
            <div className="text-center">
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-pink-200' : 'text-gray-600'
              }`}>
                {description}
              </p>
              
              <div className="flex justify-center">
                <RotateCcw 
                  className={`transition-all duration-300 group-hover:rotate-180 ${
                    theme === 'dark' ? 'text-pink-300' : 'text-purple-500'
                  }`} 
                  size={24} 
                />
              </div>
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
              }`}>
                Нажми, чтобы открыть секрет
              </p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl cursor-pointer overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-pink-800/90 to-red-800/90 border border-red-400/50 hover:border-pink-400/70'
              : 'bg-gradient-to-br from-red-200/90 to-pink-200/90 border border-red-300/70 hover:border-pink-400/90'
          } backdrop-blur-sm shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300`}
          onClick={handleClick}
        >
          <div className="p-6 h-full flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-6 animate-pulse">
              💖
            </div>
            
            <div className="space-y-4">
              <Heart className={`mx-auto animate-pulse ${
                theme === 'dark' ? 'text-pink-300' : 'text-red-500'
              }`} size={32} />
              
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Это правда!
              </p>
              
              <div className="flex justify-center space-x-2 text-2xl animate-bounce">
                <span>❤️</span>
                <span>💕</span>
                <span>💝</span>
              </div>
              
              <button 
                onClick={handleClick}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-pink-600/30 text-white border border-pink-400/50 hover:bg-pink-600/50'
                    : 'bg-red-500/30 text-gray-800 border border-red-400/70 hover:bg-red-500/50'
                }`}
              >
                Показать еще
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}