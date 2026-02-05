import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  emoji: string;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const heartEmojis = useCallback(() => ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '💟'], []);
  const colors = useCallback(() => [
    'text-pink-400',
    'text-red-400', 
    'text-purple-400',
    'text-pink-500',
    'text-red-500',
    'text-purple-500'
  ], []);

  const createHeart = useCallback((id: number): Heart => {
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50,
      size: Math.random() * 30 + 20,
      color: colors()[Math.floor(Math.random() * colors().length)],
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      emoji: heartEmojis()[Math.floor(Math.random() * heartEmojis().length)]
    };
  }, [heartEmojis, colors]);

  // Initialize hearts in useMemo to avoid setState in effect
  const initialHearts = useMemo(() => Array.from({ length: 15 }, (_, i) => createHeart(i)), [createHeart]);
  
  useEffect(() => {
    setHearts(initialHearts);
  }, [initialHearts]);

  // Animation loop
  useEffect(() => {
    const animateHearts = () => {
      setHearts(prev => prev.map(heart => {
        const newY = heart.y - heart.speed;
        const newOpacity = heart.opacity - 0.002;
        
        // Reset heart when it goes off screen
        if (newY < -50 || newOpacity <= 0) {
          return createHeart(heart.id);
        }
        
        return {
          ...heart,
          y: newY,
          opacity: newOpacity,
          x: heart.x + Math.sin(Date.now() * 0.001 + heart.id) * 0.5 // Add floating motion
        };
      }));
    };

    const interval = setInterval(animateHearts, 50);
    return () => clearInterval(interval);
  }, [createHeart]);

  const getRandomBurstEmoji = useCallback(() => {
    const burstEmojis = ['✨', '💫', '⭐', '🌟'];
    return burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
  }, []);

  const handleHeartClick = (heartId: number) => {
    // Add temporary burst effect
    const burst = {
      id: `burst-${heartId}`,
      x: hearts.find(h => h.id === heartId)?.x || 0,
      y: hearts.find(h => h.id === heartId)?.y || 0,
      emoji: getRandomBurstEmoji(),
      opacity: 1,
      size: 40,
      speed: 0,
      color: 'text-yellow-400'
    };

    // Add burst to temporary state
    setHearts(prev => [...prev, burst]);

    // Remove burst after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== burst.id));
    }, 1000);

    // Make the clicked heart pulse
    setHearts(prev => prev.map(heart => 
      heart.id === heartId 
        ? { ...heart, size: heart.size * 1.5 }
        : heart
    ));

    // Reset size after pulse
    setTimeout(() => {
      setHearts(prev => prev.map(heart => 
        heart.id === heartId 
          ? { ...heart, size: heart.size / 1.5 }
          : heart
      ));
    }, 500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`absolute pointer-events-auto cursor-pointer transform-gpu transition-all duration-300 hover:scale-110`}
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animation: heart.speed > 0 ? 'float 3s ease-in-out infinite' : 'none'
          }}
          onClick={() => handleHeartClick(heart.id)}
        >
          {heart.emoji}
        </div>
      ))}
      
      {/* Additional decorative floating elements */}
      <div className="absolute top-20 left-10 text-pink-300 opacity-30 animate-pulse">
        <div className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>💖</div>
      </div>
      <div className="absolute top-40 right-20 text-purple-300 opacity-40 animate-pulse">
        <div className="text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💜</div>
      </div>
      <div className="absolute bottom-40 left-20 text-red-300 opacity-50 animate-pulse">
        <div className="text-4xl animate-bounce" style={{ animationDelay: '2s' }}>❤️</div>
      </div>
      <div className="absolute bottom-20 right-40 text-pink-400 opacity-60 animate-pulse">
        <div className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>💝</div>
      </div>
    </div>
  );
}