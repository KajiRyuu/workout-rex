import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const colors = ['#38bdf8', '#4ade80', '#facc15', '#f472b6', '#a78bfa'];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2 // seconds
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 w-3 h-3 rounded-full animate-confetti opacity-0"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};