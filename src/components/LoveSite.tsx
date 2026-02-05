import React, { useState, useEffect } from 'react';
import { Heart, Star, Sparkles, Music, Gift } from 'lucide-react';
import { FlipCard } from './FlipCard';
import { FloatingHearts } from './FloatingHearts';
import { SecretButton } from './SecretButton';

const loveReasons = [
  {
    title: "Твоя улыбка",
    description: "Каждый раз, когда ты улыбаешься, весь мир становится ярче",
    icon: "😊",
    surprise: "Твоя улыбка - это солнце, которое согревает моё сердце каждый день!"
  },
  {
    title: "Твоя доброта", 
    description: "Ты всегда думаешь о других и делаешь мир лучше",
    icon: "🌟",
    surprise: "Твоя доброта вдохновляет меня становиться лучше каждый день!"
  },
  {
    title: "Твои глаза",
    description: "В них я вижу всю вселенную и своё счастье",
    icon: "👀",
    surprise: "Когда смотрю в твои глаза, забываю обо всем на свете!"
  },
  {
    title: "Твое чувство юмора",
    description: "Ты умеешь рассмешить меня в любой ситуации",
    icon: "😄",
    surprise: "С тобой я смеюсь так, как не смеялся уже очень давно!"
  },
  {
    title: "Твоя поддержка",
    description: "Ты всегда рядом, когда мне нужна помощь",
    icon: "🤗",
    surprise: "Зная, что ты есть, я чувствую себя непобедимым!"
  },
  {
    title: "Твоя красота",
    description: "Внутри и снаружи - ты самое прекрасное существо",
    icon: "💎",
    surprise: "Твоя красота завораживает меня снова и снова!"
  }
];

export function LoveSite() {
  const [isLoaded] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSurprise, setShowSurprise] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleCardClick = (surprise: string) => {
    setShowSurprise(surprise);
  };

  const closeSurprise = () => {
    setShowSurprise(null);
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-purple-900 via-pink-900 to-red-900' 
        : 'bg-gradient-to-br from-pink-100 via-purple-50 to-red-100'
    }`}>
      <FloatingHearts />
      
      {/* Header */}
      <header className="relative z-10 p-6 text-center">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              theme === 'dark' 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-gray-800/20 text-gray-800 hover:bg-gray-800/30'
            }`}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          
          <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent animate-pulse`}>
            Reasons I Love You
          </h1>
          
          <SecretButton onClick={() => handleCardClick("🎉 Сюрприз! Ты замечательная девушка! 🎉")} />
        </div>
        
        <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-pink-200' : 'text-gray-700'} mb-8`}>
          Каждая карточка - это особенная причина, почему я тебя люблю ❤️
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loveReasons.map((reason, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 hover:scale-105 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <FlipCard
                title={reason.title}
                description={reason.description}
                icon={reason.icon}
                theme={theme}
                onClick={() => handleCardClick(reason.surprise)}
              />
            </div>
          ))}
        </div>

        {/* Interactive Section */}
        <div className={`text-center p-8 rounded-3xl backdrop-blur-sm ${
          theme === 'dark' 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-white/50 border border-white/30'
        }`}>
          <div className="flex justify-center items-center gap-4 mb-6">
            <Sparkles className="text-yellow-400 animate-bounce" size={24} />
            <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Интерактивная зона любви
            </h2>
            <Heart className="text-red-500 animate-pulse" size={24} />
          </div>
          
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-pink-200' : 'text-gray-600'}`}>
            Нажимай на элементы и открывай секретные сюрпризы! 🎁
          </p>
          
          <div className="flex justify-center gap-4">
            <SecretButton 
              icon={<Music size={24} />}
              onClick={() => handleCardClick("🎵 Музыка нашей любви играет для тебя! 🎵")}
              variant="purple"
            />
            <SecretButton 
              icon={<Gift size={24} />}
              onClick={() => handleCardClick("🎁 Этот подарок - мое сердце! Береги его! 🎁")}
              variant="red"
            />
            <SecretButton 
              icon={<Star size={24} />}
              onClick={() => handleCardClick("⭐ Ты - самая яркая звезда в моей жизни! ⭐")}
              variant="yellow"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6">
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
          theme === 'dark' 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-800/20 text-gray-800'
        }`}>
          <Heart className="text-red-500 animate-bounce" size={20} />
          <span className="text-lg font-medium">Создано с любовью специально для тебя</span>
          <Heart className="text-red-500 animate-bounce" size={20} />
        </div>
      </footer>

      {/* Surprise Modal */}
      {showSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSurprise}
          />
          <div className={`relative p-8 rounded-3xl text-center max-w-md mx-auto transform animate-scaleIn ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-purple-800 to-pink-800 border border-white/30' 
              : 'bg-gradient-to-br from-pink-200 to-purple-200 border border-white/50'
          }`}>
            <button
              onClick={closeSurprise}
              className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <div className="text-6xl mb-4 animate-bounce">💝</div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Сюрприз! 🎉
            </h3>
            <p className={`text-lg ${theme === 'dark' ? 'text-pink-200' : 'text-gray-700'}`}>
              {showSurprise}
            </p>
            <div className="mt-6 text-4xl animate-pulse">
              ❤️ 💕 ❤️ 💕 ❤️
            </div>
          </div>
        </div>
      )}
    </div>
  );
}