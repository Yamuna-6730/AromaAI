'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { PerfumeBottle } from '@/app/components/info/PerfumeBottle';
import { ScentParticles } from '@/app/components/info/ScentParticles';
import { Sparkles, ChevronLeft, ChevronRight, Activity, Zap, ShieldCheck, Heart } from 'lucide-react';

const SCENT_MODES = [
  { id: 'floral', label: 'Floral', title: 'Floral', colors: { bg: '#FFD6E0', text: '#ec4458' } },
  { id: 'fresh', label: 'Fresh', title: 'Fresh', colors: { bg: '#CFF7F0', text: '#03403f' } },
  { id: 'woody', label: 'Woody', title: 'Woody', colors: { bg: '#E6D3B3', text: '#644421' } },
  { id: 'fruity', label: 'Fruity', title: 'Fruity', colors: { bg: '#FFE5B4', text: '#f2675a' } },
] as const;

export default function InfoPage() {
  const [index, setIndex] = useState(0);
  const currentMode = SCENT_MODES[index];
  const [direction, setDirection] = useState(0);

  const nextMode = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SCENT_MODES.length);
  };

  const prevMode = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SCENT_MODES.length) % SCENT_MODES.length);
  };

  useEffect(() => {
    // GSAP background and text transition
    gsap.fromTo('.bg-text', 
      { y: direction * 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, [index, direction]);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-white text-text-main scroll-smooth">
      
      {/* 🧴 SECTION 1: INTERACTIVE STUDIO (FRUITY STYLE) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000" style={{ backgroundColor: currentMode.colors.bg }}>
        
        {/* BIG BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentMode.title}
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[25vw] md:text-[350px] font-black text-white/40 uppercase tracking-tighter leading-none"
            >
              {currentMode.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* 3D BOTTLE (THE HERO) */}
        <div className="absolute inset-0 z-10">
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }}>
            <ambientLight intensity={1.5} />
            <PresentationControls
              global
              snap
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <PerfumeBottle scentMode={currentMode.id} />
            </PresentationControls>
            <ScentParticles scentMode={currentMode.id} />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
            <Environment preset="studio" />
          </Canvas>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-between px-24 md:px-32 z-40 pointer-events-none">
          
          <button 
            onClick={prevMode}
            className="pointer-events-auto w-12 h-12 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-90"
          >
            <ChevronLeft 
              className="w-5 h-5 md:w-6 md:h-6" 
              style={{ color: currentMode.colors.text }} 
            />
          </button>

          <button 
            onClick={nextMode}
            className="pointer-events-auto w-12 h-12 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-90"
          >
            <ChevronRight 
              className="w-5 h-5 md:w-6 md:h-6" 
              style={{ color: currentMode.colors.text }} 
            />
          </button>

        </div>

        {/* INFO OVERLAY */}
        <div className="absolute top-24 z-20 text-center pointer-events-none">
          <motion.div
            key={currentMode.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-xl"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: currentMode.colors.text }}>
              {currentMode.label} Atmosphere
            </span>
          </motion.div>
        </div>
      </section>

      {/* 🧴 SECTION 2: THE PROCESS (COMPACT) */}
      <section className="bg-[#FAF9F6] py-24 px-6 md:px-12 relative z-30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter mb-4">Scientific <span className="text-soft-teal">Storytelling</span></h2>
            <p className="text-text-muted font-medium max-w-2xl mx-auto">From sensory data to botanical extraction — how we craft your unique identity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Activity, 
                title: 'Data Extraction', 
                desc: 'Our AI parses your words to extract scent families, intensity preferences, and sensitivities.' 
              },
              { 
                icon: Zap, 
                title: 'Note Prediction', 
                desc: 'A custom ML model predicts the ideal ratio of botanical compounds to match your sensory profile.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Safety Check', 
                desc: 'Every formulation is cross-checked against our database of potential allergens and comfort rules.' 
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-white rounded-[40px] border border-subtle-beige shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-off-white rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-soft-teal" />
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-3">{step.title}</h3>
                <p className="text-text-muted font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* FINAL CTA */}
          <div className="mt-20 text-center">
            <button 
              onClick={() => window.location.href='/chat'}
              className="px-12 py-5 bg-text-main text-white rounded-[32px] font-bold text-xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto hover:scale-105 active:scale-95"
            >
              Start Your Creation <Sparkles className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER DECOR */}
      <div className="bg-[#FAF9F6] pt-20 pb-10 text-center border-t border-subtle-beige">
         <p className="text-[10px] font-bold text-text-muted opacity-40 uppercase tracking-[0.5em]">Comfort-First Personalized Perfume — AromaAI 2024</p>
      </div>
    </div>
  );
}