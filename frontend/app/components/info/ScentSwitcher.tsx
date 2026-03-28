'use client';

import { motion } from 'framer-motion';
import { Milk, Leaf, TreePine, Cherry } from 'lucide-react';

interface Props {
  activeMode: 'floral' | 'fresh' | 'woody' | 'fruity';
  onModeChange: (mode: 'floral' | 'fresh' | 'woody' | 'fruity') => void;
}

const MODES = [
  { id: 'floral', label: 'Floral', icon: Milk, color: '#FFD6E0' },
  { id: 'fresh', label: 'Fresh', icon: Leaf, color: '#CFF7F0' },
  { id: 'woody', label: 'Woody', icon: TreePine, color: '#E6D3B3' },
  { id: 'fruity', label: 'Fruity', icon: Cherry, color: '#FFE5B4' },
] as const;

export function ScentSwitcher({ activeMode, onModeChange }: Props) {
  return (
    <div className="flex bg-white/40 backdrop-blur-2xl p-2 rounded-[28px] border border-white/40 shadow-xl gap-2">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`relative px-6 py-3 rounded-2xl flex items-center gap-2 transition-all group ${
            activeMode === mode.id ? 'text-black' : 'text-gray-500 hover:text-black'
          }`}
        >
          {activeMode === mode.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-2xl shadow-sm -z-10"
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          )}
          <mode.icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
          <span className="text-xs font-bold uppercase tracking-widest">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
