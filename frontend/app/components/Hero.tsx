'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThreeDPerfume from './ThreeDPerfume';

export default function Hero() {
    const router = useRouter();
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 lg:px-12 pt-20 pb-10">

            {/* Background Ambience */}
            <div className="absolute inset-0 -z-10 bg-off-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lavender/20 to-transparent blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-sage-green/10 to-transparent blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-xl space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-soft-teal/10 text-text-muted text-sm font-medium tracking-wide"
                    >
                        Reimagining Personal Scent
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] text-text-main tracking-tight">
                        A Aroma That Feels as Good as It <span className="text-soft-teal">Smells</span>
                    </h1>

                    <p className="text-xl text-text-muted leading-relaxed max-w-md">
                        Personalized fragrances designed for people with scent sensitivities. Pure, breathable, and uniquely yours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <motion.button
                            onClick={() => router.push('/chat')}
                            whileHover={{ scale: 1.02, backgroundColor: "var(--color-sage-green)" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-text-main text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Create My Perfume
                            <ArrowRight size={20} />
                        </motion.button>

                        <motion.button
                            onClick={() => router.push('/info')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-white text-text-main border border-subtle-beige rounded-full font-medium text-lg hover:bg-off-white transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <PlayCircle size={20} className="text-soft-teal group-hover:scale-110 transition-transform" />
                            How it works
                        </motion.button>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-text-muted/80">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-subtle-beige border-2 border-white flex items-center justify-center text-xs">
                                    {/* Placeholder user avatars */}
                                    <span className="opacity-50">U{i}</span>
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 10,000+ sensitive noses</p>
                    </div>
                </motion.div>

                {/* Visual Content (3D Model) */}
                <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-end">
                    <ThreeDPerfume />
                </div>
            </div>
        </section>
    );
}
