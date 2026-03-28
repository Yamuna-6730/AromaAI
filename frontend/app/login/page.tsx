'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white px-4">
      {/* Background ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lavender/20 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-sage-green/10 to-transparent blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-text-main text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
             <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Welcome Back</h1>
          <p className="text-text-muted mt-2 font-medium">Continue your sensory journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-subtle-beige rounded-2xl focus:ring-2 focus:ring-soft-teal/30 focus:border-soft-teal outline-none transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-subtle-beige rounded-2xl focus:ring-2 focus:ring-soft-teal/30 focus:border-soft-teal outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-text-main hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm font-medium">
            New to AromaAI? {' '}
            <Link href="/register" className="text-soft-teal font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
