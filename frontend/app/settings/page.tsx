'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { User, Monitor, Lock, Info, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-off-white dark:bg-[#0a0a0a] pl-20 p-8 transition-colors duration-300">
       <div className="max-w-4xl mx-auto space-y-12 pb-24 pt-4">
         <div>
           <h1 className="text-4xl font-bold mb-2 text-text-main tracking-tight">Settings</h1>
           <p className="text-text-muted text-lg">Manage your account settings and preferences.</p>
         </div>

         {/* Profile */}
         <section>
           <h2 className="text-xl font-semibold mb-4 text-text-main flex items-center gap-2">
             <User className="text-soft-teal" /> Profile
           </h2>
           <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-subtle-beige dark:border-white/10 shadow-sm space-y-5">
             <div>
               <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
               <input type="text" defaultValue="Alex Rivera" className="w-full bg-off-white dark:bg-[#1a1a1a] border border-subtle-beige dark:border-white/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 ring-soft-teal/50 transition-all" />
             </div>
             <div>
               <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
               <input type="email" defaultValue="alex@sensitive-scents.com" className="w-full bg-off-white dark:bg-[#1a1a1a] border border-subtle-beige dark:border-white/10 rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 ring-soft-teal/50 transition-all" />
             </div>
             <button className="px-6 py-3 bg-text-main dark:bg-[#222] text-white rounded-xl hover:bg-soft-teal dark:hover:bg-soft-teal transition-colors font-medium shadow-sm">Save Changes</button>
           </div>
         </section>

         {/* Preferences */}
         <section>
           <h2 className="text-xl font-semibold mb-4 text-text-main flex items-center gap-2">
             <Monitor className="text-soft-teal" /> Preferences
           </h2>
           <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-subtle-beige dark:border-white/10 shadow-sm space-y-6">
             
             {/* Theme Toggle */}
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-medium text-text-main">Appearance</h3>
                 <p className="text-sm text-text-muted">Switch between light and dark modes</p>
               </div>
               {mounted && (
                 <div className="flex items-center bg-off-white dark:bg-[#1a1a1a] p-1.5 rounded-xl border border-subtle-beige dark:border-white/10 shadow-inner">
                   <button 
                     onClick={() => setTheme('light')}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${theme === 'light' ? 'bg-white dark:bg-[#333] shadow-sm text-text-main' : 'text-text-muted hover:text-text-main'}`}
                   >
                     <Sun size={18} /> Light
                   </button>
                   <button 
                     onClick={() => setTheme('dark')}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${theme === 'dark' ? 'bg-[#222] text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                   >
                     <Moon size={18} /> Dark
                   </button>
                 </div>
               )}
             </div>

             <hr className="border-subtle-beige dark:border-white/10" />

             {/* Notifications */}
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-medium text-text-main">Push Notifications</h3>
                 <p className="text-sm text-text-muted">Receive updates about your formulations</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" defaultChecked />
                 <div className="w-14 h-7 bg-subtle-beige dark:bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-subtle-beige after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-soft-teal shadow-inner"></div>
               </label>
             </div>

           </div>
         </section>

         {/* Security */}
         <section>
           <h2 className="text-xl font-semibold mb-4 text-text-main flex items-center gap-2">
             <Lock className="text-soft-teal" /> Security
           </h2>
           <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-subtle-beige dark:border-white/10 shadow-sm">
             <button className="px-6 py-3 bg-off-white dark:bg-[#1a1a1a] text-text-main border border-subtle-beige dark:border-white/10 rounded-xl hover:bg-subtle-beige dark:hover:bg-[#222] transition-colors font-medium w-full sm:w-auto shadow-sm tracking-wide">
               Change Password
             </button>
           </div>
         </section>

         {/* About */}
         <section>
           <h2 className="text-xl font-semibold mb-4 text-text-main flex items-center gap-2">
             <Info className="text-soft-teal" /> About
           </h2>
           <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-subtle-beige dark:border-white/10 shadow-sm">
             <div className="flex items-center gap-4 mb-5">
               <div className="w-14 h-14 rounded-full bg-soft-teal/20 flex items-center justify-center shadow-inner">
                 <span className="text-soft-teal font-bold text-2xl">A</span>
               </div>
               <div>
                 <h3 className="font-bold text-text-main text-xl">AromaAI</h3>
                 <p className="text-sm text-text-muted font-medium">Version 1.0.0 (Production Ready)</p>
               </div>
             </div>
             <p className="text-text-muted leading-relaxed max-w-2xl text-[15px]">
               Designed carefully for those with sensitive noses. We combine the precision of artificial intelligence with the artistry of perfumery to create compositions that feel as good as they smell.
             </p>
           </div>
         </section>
       </div>
    </main>
  );
}
