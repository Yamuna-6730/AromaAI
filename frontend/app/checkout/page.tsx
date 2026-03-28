'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Zap, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getProfilesAPI, ChatResponse } from '../../lib/api';
import { supabase } from '@/lib/supabase';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ChatResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Priority: sessionId from URL vs sessionId from Auth
      const effectiveSessionId = sessionId || session.user.id;
      
      try {
        const data = await getProfilesAPI(effectiveSessionId);
        if (data && data.length > 0) {
          // Get the latest one
          setProfile(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionId, router]);

  const ingredients = [
    { key: 'iso_e_super', label: 'Woody (Iso E Super)', color: 'bg-amber-400' },
    { key: 'hedione', label: 'Floral (Hedione)', color: 'bg-emerald-400' },
    { key: 'galaxolide', label: 'Musk (Galaxolide)', color: 'bg-indigo-400' },
    { key: 'ambroxan', label: 'Amber (Ambroxan)', color: 'bg-orange-400' },
    { key: 'vanillin', label: 'Sweet (Vanillin)', color: 'bg-yellow-400' },
  ] as const;

  return (
    <main className="min-h-screen bg-[#FDFCF9] dark:bg-[#080808] flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="px-6 h-20 flex items-center border-b border-subtle-beige dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-all font-bold text-sm">
          <ArrowLeft className="w-5 h-5" /> Return to Consultant
        </Link>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-16">
        
        {/* Left: Product Deep Dive */}
        <div className="space-y-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-text-main mb-4">Finalize your <span className="text-soft-teal">Signature</span></h1>
            <p className="text-text-muted font-medium">Review your personalized botanical formulation before we start the extraction process.</p>
          </motion.div>

          {/* Visual Breakdown Card */}
          <div className="bg-white dark:bg-[#111] rounded-[40px] p-8 border border-subtle-beige dark:border-white/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-soft-teal/5 rounded-full blur-[80px] group-hover:bg-soft-teal/10 transition-colors"></div>
            
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-subtle-beige dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-soft-teal/10 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-soft-teal" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main">Custom Formulation</h3>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Grounded in RAG Reasoning</p>
                    </div>
                </div>
                {profile?.confidence_score && (
                    <div className="text-right">
                        <span className="text-[10px] font-extrabold text-soft-teal uppercase tracking-widest block mb-1">Match Quality</span>
                        <span className="text-2xl font-black text-text-main">{Math.round(profile.confidence_score * 100)}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(n => <div key={n} className="h-4 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />)}
                </div>
              ) : profile?.composition ? (
                ingredients.map(ing => {
                  const val = (profile.composition as any)[ing.key] || 0;
                  if (val === 0) return null;
                  return (
                    <div key={ing.key} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-text-main/80 uppercase tracking-wide">
                            <span>{ing.label}</span>
                            <span>{val}%</span>
                        </div>
                        <div className="h-2 w-full bg-off-white dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${ing.color} rounded-full opacity-80 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                        </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-text-muted italic text-sm">No active composition found. Please return to the consultant.</div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-subtle-beige dark:border-white/5 flex justify-between items-end">
                <div>
                   <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Concentration</p>
                   <p className="text-lg font-bold text-text-main">Extrait de Parfum (22%)</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-text-main">$145<span className="text-lg font-bold">.00</span></p>
                </div>
            </div>
          </div>
        </div>

        {/* Right: Modern Checkout Form */}
        <div className="bg-white dark:bg-[#111] rounded-[40px] p-8 lg:p-12 border border-subtle-beige dark:border-white/10 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-text-main mb-8 flex items-center gap-3">
                <Truck className="w-6 h-6 text-soft-teal" /> Shipping & Delivery
            </h2>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Order Successful! We are now hand-blending your unique fragrance."); router.push('/profile'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-off-white dark:bg-black/20 p-4 rounded-2xl border border-transparent focus:border-soft-teal focus:ring-4 focus:ring-soft-teal/10 outline-none transition-all font-medium" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Email</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-off-white dark:bg-black/20 p-4 rounded-2xl border border-transparent focus:border-soft-teal focus:ring-4 focus:ring-soft-teal/10 outline-none transition-all font-medium" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Delivery Address</label>
                    <input type="text" placeholder="123 Aroma Street, Botanical City" className="w-full bg-off-white dark:bg-black/20 p-4 rounded-2xl border border-transparent focus:border-soft-teal focus:ring-4 focus:ring-soft-teal/10 outline-none transition-all font-medium" required />
                </div>

                <div className="pt-6">
                    <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-3 lowercase italic opacity-80">
                        <CreditCard className="w-5 h-5" /> Secured by Stripe
                    </h3>
                    <div className="p-4 bg-off-white dark:bg-black/20 rounded-2xl border border-dashed border-subtle-beige dark:border-white/10 text-center text-xs font-bold text-text-muted uppercase tracking-widest">
                        Payment encryption active
                    </div>
                </div>

                <button type="submit" disabled={!profile} className="w-full bg-text-main text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group disabled:opacity-50">
                    <ShoppingBag className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    Place Order
                </button>

                <div className="flex items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-soft-teal" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-soft-teal" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Free Ship</span>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-off-white animate-pulse font-bold text-soft-teal">Aligning botanical compounds...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
