'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Edit3, Beaker, ShieldCheck, Zap } from 'lucide-react';
import { CompoundProfile, UserProfile } from '@/lib/api';

interface Props {
  title: string;
  composition: CompoundProfile;
  profile: UserProfile;
  confidence: number;
  onBuy: () => void;
  onEdit: () => void;
}

export function ProfileCard({ title, composition, profile, confidence, onBuy, onEdit }: Props) {
  // Map compounds to readable labels and colors
  const ingredients = [
    { key: 'iso_e_super', label: 'Woody (Iso E Super)', color: 'bg-amber-200' },
    { key: 'hedione', label: 'Floral (Hedione)', color: 'bg-emerald-200' },
    { key: 'galaxolide', label: 'Musk (Galaxolide)', color: 'bg-purple-200' },
    { key: 'ambroxan', label: 'Amber (Ambroxan)', color: 'bg-orange-200' },
    { key: 'vanillin', label: 'Sweet (Vanillin)', color: 'bg-yellow-200' },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white dark:bg-[#111] rounded-[32px] border border-subtle-beige dark:border-white/10 p-6 shadow-sm hover:shadow-2xl hover:border-soft-teal/30 transition-all duration-500 overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-soft-teal/10 to-transparent rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-main mb-1 group-hover:text-soft-teal transition-colors">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Grounded reasoning
            </span>
          </div>
        </div>
        <div className="px-3 py-1 bg-soft-teal/10 rounded-full border border-soft-teal/20">
          <span className="text-[10px] font-extrabold text-soft-teal uppercase tracking-tighter">
            {Math.round(confidence * 100)}% Match
          </span>
        </div>
      </div>

      {/* Scent Balance visualization */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1 px-1">
          <span>Scent Balance</span>
          <span>{profile.intensity}</span>
        </div>
        <div className="space-y-3">
          {ingredients.map((ing) => {
            const value = (composition as any)[ing.key] || 0;
            if (value === 0) return null;
            return (
              <div key={ing.key} className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-text-main/70">
                  <span>{ing.label}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-off-white dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${ing.color} opacity-80 rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symptoms / Notes pills */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {profile.symptoms.slice(0, 3).map(s => (
          <span key={s} className="px-2.5 py-1 bg-off-white dark:bg-[#1A1A1A] text-[10px] font-bold text-text-muted uppercase rounded-lg border border-gray-200 dark:border-white/5">
            {s}
          </span>
        ))}
        {profile.preferences.slice(0, 2).map(p => (
            <span key={p} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                {p}
            </span>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-subtle-beige dark:border-white/5">
        <button 
          onClick={onEdit} 
          className="flex items-center justify-center gap-2 py-3 bg-off-white dark:bg-white/5 text-text-main rounded-2xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Tweak
        </button>
        <button 
          onClick={onBuy} 
          className="flex items-center justify-center gap-2 py-3 bg-text-main text-white rounded-2xl text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-black/5"
        >
          <ShoppingBag className="w-4 h-4" /> Shop
        </button>
      </div>

      {/* Hover Overlay Icon */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-10 scale-50 group-hover:scale-100 transition-all duration-500">
        <Beaker className="w-12 h-12 text-text-main" />
      </div>
    </motion.div>
  );
}
