'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, PlusCircle, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { ProfileCard } from '@/app/components/ProfileCard';
import { getProfilesAPI, ChatResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ChatResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      fetchProfiles(session.user.id);
    };

    const fetchProfiles = async (userId: string) => {
      try {
        const data = await getProfilesAPI(userId);
        setProfiles(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const filteredProfiles = profiles.filter(p => 
    p.message.toLowerCase().includes(search.toLowerCase()) || 
    p.profile_summary?.preferences.some(pref => pref.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FDFCF9] dark:bg-[#080808] transition-colors duration-500 pb-20">
      {/* Premium Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-subtle-beige dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-text-main text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-text-main">Back to Consultant</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="p-3 bg-soft-teal text-white rounded-2xl hover:bg-soft-teal/90 shadow-lg shadow-soft-teal/20 transition-all hover:scale-105 active:scale-95">
              <PlusCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title & Stats */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-text-main tracking-tighter mb-4"
          >
            My Fragrance <span className="text-soft-teal">Collections</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted font-medium"
          >
            {profiles.length} Personalized botanical formulations
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by title or ingredient (e.g. Lavender)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-3xl border border-subtle-beige dark:border-white/10 shadow-sm focus:ring-2 focus:ring-soft-teal/30 outline-none transition-all font-medium text-sm"
            />
          </div>
          <button className="px-6 py-4 bg-white dark:bg-[#111] text-text-main rounded-3xl border border-subtle-beige dark:border-white/10 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-bold">Sort by Latest</span>
          </button>
        </div>

        {/* Profiles Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-[400px] bg-white dark:bg-[#111] rounded-[32px] border border-subtle-beige dark:border-white/10 animate-pulse flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-gray-200 dark:text-gray-800" />
                </div>
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProfiles.map((p, i) => (
                <ProfileCard 
                  key={i}
                  title={p.message.replace("Saved fragrance: ", "")}
                  composition={p.composition!}
                  profile={p.profile_summary!}
                  confidence={p.confidence_score}
                  onEdit={() => router.push(`/?editSession=${localStorage.getItem('aroma_session_id')}`)}
                  onBuy={() => router.push(`/checkout?sessionId=${localStorage.getItem('aroma_session_id')}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 bg-white/40 dark:bg-white/5 rounded-[40px] border border-dashed border-subtle-beige dark:border-white/10"
            >
              <div className="w-20 h-20 bg-soft-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-soft-teal/5">
                <PlusCircle className="w-10 h-10 text-soft-teal" />
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">No fragrances yet</h2>
              <p className="text-text-muted mb-8 text-sm">Start a conversation to craft your first masterpiece.</p>
              <Link href="/" className="px-10 py-4 bg-text-main text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10">
                Craft Fragrance
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-soft-teal/5 to-transparent pointer-events-none -z-10 blur-3xl opacity-50"></div>
      <div className="fixed top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-amber-200/5 to-transparent pointer-events-none -z-10 blur-3xl opacity-50"></div>
    </div>
  );
}
