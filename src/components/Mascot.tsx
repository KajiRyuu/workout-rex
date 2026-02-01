import React, { useState } from 'react';
import type { StoreItem } from '../types';
import { REX_MARKET } from '../constants';
import { ShoppingBag, X, Bone, Check } from 'lucide-react';

interface MascotProps {
  quote: string;
  wallet: number;
  inventory: string[];
  equippedItems: string[];
  onBuy: (item: StoreItem) => void;
  onEquip: (item: StoreItem) => void;
}

export const Mascot: React.FC<MascotProps> = ({ quote, wallet, inventory, equippedItems, onBuy, onEquip }) => {
  const [isPetting, setIsPetting] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  const handlePet = () => {
    setIsPetting(true);
    
    // Add a floating heart
    const newHeart = { id: Date.now(), left: 20 + Math.random() * 60 };
    setHearts(prev => [...prev, newHeart]);

    // Remove heart after animation
    setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);

    // Stop wiggle
    setTimeout(() => setIsPetting(false), 500);
  };

  const handleBuyItem = (item: StoreItem) => {
      if (item.type === 'food') {
          if (wallet >= item.cost) {
              onBuy(item);
              setIsEating(true);
              setTimeout(() => setIsEating(false), 2000);
          }
      } else {
          // Check if already owned?
          // If owned, toggle equip
          if (inventory.includes(item.id)) {
              onEquip(item);
          } else {
             if (wallet >= item.cost) {
                 onBuy(item);
             }
          }
      }
  };

  // Check equipped states
  const hasBlueBandana = equippedItems.includes('blue_bandana');
  const hasGoldChain = equippedItems.includes('gold_chain');
  const hasShades = equippedItems.includes('shades');
  const hasNerdGlasses = equippedItems.includes('nerd_glasses');
  const hasPartyHat = equippedItems.includes('party_hat');
  const hasCrown = equippedItems.includes('crown');
  const hasTennisBall = equippedItems.includes('tennis_ball');
  const hasKettlebell = equippedItems.includes('kettlebell');

  return (
    <div className="flex flex-col items-center w-full mb-6 select-none relative">
      
      {/* Wallet Display */}
      <div className="absolute top-0 right-0 z-10 flex items-center gap-1 bg-amber-100 border-2 border-amber-200 text-amber-800 px-3 py-1 rounded-full shadow-sm cursor-pointer hover:bg-amber-200 transition-colors" onClick={() => setIsShopOpen(true)}>
          <span className="font-black text-lg">{wallet}</span>
          <Bone size={16} className="fill-amber-600 text-amber-800" />
      </div>

      <div className="flex items-start gap-4 w-full">
        <div 
            className="flex-shrink-0 relative cursor-pointer group"
            onClick={handlePet}
        >
            {/* Rex the Rep-triever - SVG Construction */}
            <div className={`transition-transform duration-200 ${isPetting ? 'animate-wiggle' : ''} ${isEating ? 'scale-110' : ''}`}>
                <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-md">
                
                {/* TOYS (Behind) */}
                {hasKettlebell && <text x="75" y="90" fontSize="30">🏋️</text>}

                {/* Body/Head */}
                <circle cx="50" cy="50" r="45" fill="#eab308" stroke="#a16207" strokeWidth="3" />
                
                {/* Ears */}
                <path d="M15 30 Q5 50 15 70" fill="#a16207" stroke="#a16207" strokeWidth="3" />
                <path d="M85 30 Q95 50 85 70" fill="#a16207" stroke="#a16207" strokeWidth="3" />
                
                {/* Eyes */}
                {isPetting || isEating ? (
                    <>
                        <path d="M30 45 Q35 40 40 45" stroke="#1e293b" strokeWidth="3" fill="none" />
                        <path d="M60 45 Q65 40 70 45" stroke="#1e293b" strokeWidth="3" fill="none" />
                    </>
                ) : (
                    <>
                         {/* Regular Eyes */}
                         {!hasShades && !hasNerdGlasses && (
                             <>
                                <circle cx="35" cy="45" r="6" fill="#1e293b" />
                                <circle cx="65" cy="45" r="6" fill="#1e293b" />
                                <circle cx="37" cy="43" r="2" fill="white" />
                                <circle cx="67" cy="43" r="2" fill="white" />
                             </>
                         )}
                    </>
                )}

                {/* ACCESSORIES: GLASSES */}
                {hasShades && <text x="18" y="55" fontSize="40">🕶️</text>}
                {hasNerdGlasses && <text x="18" y="55" fontSize="40">👓</text>}

                {/* Snout */}
                <ellipse cx="50" cy="65" rx="14" ry="10" fill="#fef08a" />
                <path d="M45 60 Q50 62 55 60 L50 70 Z" fill="#1e293b" /> {/* Nose */}
                <path d="M50 70 L50 75 Q40 80 40 70 M50 75 Q60 80 60 70" stroke="#1e293b" strokeWidth="2" fill="none" /> {/* Mouth */}

                {/* ACCESSORIES: NECK */}
                {/* Default Headband (Only if no hat?) Let's keep it as his signature unless overridden by bandana */}
                {!hasBlueBandana && !hasGoldChain && (
                    <path d="M15 35 Q50 15 85 35" stroke="#ef4444" strokeWidth="8" fill="none" strokeLinecap="round" />
                )}
                {hasBlueBandana && <path d="M20 75 Q50 95 80 75" stroke="#3b82f6" strokeWidth="12" fill="none" strokeLinecap="round" />}
                {hasGoldChain && <path d="M25 80 Q50 95 75 80" stroke="#eab308" strokeWidth="6" strokeDasharray="4 2" fill="none" strokeLinecap="round" />}

                {/* ACCESSORIES: HAT */}
                {hasPartyHat && <text x="25" y="30" fontSize="50" transform="rotate(-10 50 50)">🥳</text>}
                {hasCrown && <text x="25" y="35" fontSize="50">👑</text>}

                {/* TOYS (Front) */}
                {hasTennisBall && <circle cx="85" cy="85" r="10" fill="#bef264" stroke="#65a30d" strokeWidth="1" />}

                {/* Eating Animation */}
                {isEating && <text x="35" y="80" fontSize="30" className="animate-bounce">🥩</text>}

                </svg>
            </div>
            
            {/* Animated Hearts */}
            {hearts.map(heart => (
                <div 
                    key={heart.id}
                    className="absolute -top-4 text-2xl animate-heart pointer-events-none"
                    style={{ left: `${heart.left}%` }}
                >
                    ❤️
                </div>
            ))}
            
            {/* Shop Button trigger visual */}
            <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white rounded-full p-1.5 shadow-md border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setIsShopOpen(true); }}>
                <ShoppingBag size={12} />
            </div>
        </div>
        
        {/* Speech Bubble */}
        <div className="relative bg-white border-2 border-slate-200 border-b-4 rounded-2xl p-4 flex-1 mt-2 flex flex-col justify-center min-h-[80px]">
            <div className="absolute top-6 -left-2 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-200 transform rotate-45"></div>
            <p className="text-slate-700 font-bold text-sm leading-relaxed">
                {isEating ? "Yum! That was delicious! 🦴" : isPetting ? "Woof! You're doing great! 🐶❤️" : `"${quote}"`}
            </p>
        </div>
      </div>

      {/* SHOP MODAL */}
      {isShopOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsShopOpen(false)}>
              <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t-4 sm:border-4 border-slate-200 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="text-sky-500" />
                        <h2 className="text-2xl font-black text-slate-800">Rex's Market</h2>
                      </div>
                      <button onClick={() => setIsShopOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-100 flex justify-between items-center mb-6">
                      <div>
                          <p className="text-xs font-bold text-amber-600 uppercase">Your Wallet</p>
                          <p className="text-3xl font-black text-amber-800 flex items-center gap-2">{wallet} <Bone size={24} className="fill-amber-600" /></p>
                      </div>
                      <p className="text-xs text-amber-600 font-medium text-right max-w-[120px]">Earn bones by completing exercises!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      {REX_MARKET.map((item) => {
                          const isOwned = inventory.includes(item.id);
                          const isEquipped = equippedItems.includes(item.id);
                          const canAfford = wallet >= item.cost;

                          return (
                              <div key={item.id} className={`p-3 rounded-2xl border-2 border-b-4 transition-all ${isOwned ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="text-3xl">{item.icon}</span>
                                      {item.type !== 'food' && isOwned && (
                                          <span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={12} strokeWidth={4} /></span>
                                      )}
                                  </div>
                                  <h3 className="font-bold text-slate-800 leading-tight">{item.name}</h3>
                                  <p className="text-xs text-slate-400 font-medium mb-3">{item.description}</p>
                                  
                                  <button
                                    onClick={() => handleBuyItem(item)}
                                    disabled={!isOwned && !canAfford}
                                    className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                                        isEquipped
                                        ? 'bg-slate-200 text-slate-500 border-slate-300' // Equipped
                                        : isOwned 
                                            ? item.type === 'food' 
                                                ? canAfford ? 'bg-amber-500 text-white border-amber-700' : 'bg-slate-200 text-slate-400 border-slate-300'
                                                : 'bg-green-500 text-white border-green-700' // Owned, Equip it
                                            : canAfford 
                                                ? 'bg-sky-500 text-white border-sky-700' // Buy it
                                                : 'bg-slate-100 text-slate-300 border-slate-200' // Cannot afford
                                    }`}
                                  >
                                      {isEquipped ? 'Equipped' : 
                                       isOwned ? (item.type === 'food' ? `Buy (${item.cost})` : 'Equip') :
                                       `Buy ${item.cost}`}
                                       {!isEquipped && !isOwned && <Bone size={10} className="fill-current" />}
                                  </button>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};