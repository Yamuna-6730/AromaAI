'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Save, RefreshCw, ShoppingBag, X, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  actions: string[];
  stage: string;
  onSendAction: (prompt: string) => void;
  onSaveProfile: (title: string) => void;
  onBuyNow: () => void;
}

export function ActionPanel({ actions, stage, onSendAction, onSaveProfile, onBuyNow }: Props) {
  const [showModifiers, setShowModifiers] = useState(false);
  const [title, setTitle] = useState("My Custom Fragrance");
  const router = useRouter();

  if (!actions || actions.length === 0) return null;

  const modifiers = [
    "Make it lighter", "Make it stronger",
    "Try citrus vibe", "Try floral vibe", "Try woody vibe",
    "Change usage context", "Add/remove allergens"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-6 w-full sm:max-w-md"
    >
      <AnimatePresence mode="wait">
        {showModifiers ? (
          <motion.div 
            key="modifiers"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 bg-white dark:bg-[#111] rounded-2xl border border-subtle-beige dark:border-white/10 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-main">How would you like to modify?</h3>
              <button onClick={() => setShowModifiers(false)}>
                <X className="w-5 h-5 text-text-muted hover:text-text-main" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {modifiers.map((mod) => (
                <button 
                  key={mod} 
                  onClick={() => {
                    onSendAction(mod);
                    setShowModifiers(false);
                  }} 
                  className="px-4 py-2 bg-off-white dark:bg-[#222] text-text-main text-sm rounded-full border border-gray-200 dark:border-white/5 hover:border-soft-teal hover:text-soft-teal transition-all shadow-sm"
                >
                  {mod}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 bg-white dark:bg-[#111] rounded-2xl border border-subtle-beige dark:border-white/10 shadow-lg text-left"
          >
            <h3 className="text-md font-medium text-text-muted mb-4">
              {stage === 'generated' ? 'Your composition is ready' : 
               stage === 'finalized' ? 'Next steps' : 
               stage === 'saved' ? 'Your fragrance is saved' : 'Recommended actions'}
            </h3>

            <div className="flex flex-col gap-3">
              {actions.includes('generate') && (
                <button 
                  onClick={() => onSendAction("Generate my fragrance composition")}
                  className="flex items-center justify-center gap-2 bg-text-main text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-lg shadow-black/5"
                >
                  <RefreshCw className="w-5 h-5" /> Generate Composition
                </button>
              )}

              {actions.includes('finalize') && (
                <button 
                  onClick={() => onSendAction("I want to finalize this fragrance")}
                  className="flex items-center justify-center gap-2 bg-text-main text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-lg shadow-black/5"
                >
                  <Check className="w-5 h-5" /> Finalize Fragrance
                </button>
              )}

              {actions.includes('save') && (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter profile title (e.g. My Gym Perfume)"
                    className="p-3 bg-off-white dark:bg-[#1A1A1A] border border-subtle-beige dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-soft-teal outline-none"
                  />
                  <button 
                    onClick={() => onSaveProfile(title)}
                    className="flex items-center justify-center gap-2 bg-soft-teal text-white py-3.5 rounded-xl font-semibold hover:bg-soft-teal/90 transition-all shadow-lg shadow-soft-teal/20"
                  >
                    <Save className="w-5 h-5" /> Save to My Dashboard
                  </button>
                </div>
              )}

              {actions.includes('buy') && (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={onBuyNow}
                    className="flex items-center justify-center gap-2 bg-text-main text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-2xl hover:scale-[1.02]"
                  >
                    <ShoppingBag className="w-6 h-6" /> Complete Purchase
                  </button>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="flex items-center justify-center gap-2 bg-off-white dark:bg-[#1A1A1A] text-text-main py-3.5 rounded-xl font-medium border border-gray-200 dark:border-white/5 hover:bg-gray-100 transition-colors"
                  >
                    <LayoutGrid className="w-5 h-5 text-soft-teal" /> Go to Collection
                  </button>
                </div>
              )}

              {actions.includes('modify') && (
                <button 
                  onClick={() => setShowModifiers(true)}
                  className="flex items-center justify-center gap-2 bg-off-white dark:bg-[#1A1A1A] text-text-main py-3.5 rounded-xl font-medium border border-gray-200 dark:border-white/5 hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-5 h-5" size={18} /> Tweak Composition
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
