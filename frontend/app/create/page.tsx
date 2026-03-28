'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Flower, Trees, Leaf, Droplets } from 'lucide-react';
import ScentCard from '../components/ScentCard';
import StrengthSlider from '../components/StrengthSlider';

const scentFamilies = [
    { id: 'citrus', label: 'Citrus', icon: Sun },
    { id: 'floral', label: 'Floral', icon: Flower },
    { id: 'woody', label: 'Woody', icon: Trees },
    { id: 'herbal', label: 'Herbal', icon: Leaf },
    { id: 'fresh', label: 'Fresh / Aquatic', icon: Droplets },
];

export default function CreatePerfumePage() {
    const [selectedScents, setSelectedScents] = useState<string[]>([]);
    const [strength, setStrength] = useState('Medium');

    const toggleScent = (id: string) => {
        setSelectedScents((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">

            {/* Background Ambience similar to Hero but subtle */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-soft-teal/5 blur-3xl opacity-60 rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-lavender/10 blur-3xl opacity-50 rounded-full" />
            </div>

            <div className="max-w-5xl w-full space-y-12 text-center z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-text-main mb-4">
                        Which scent families do you enjoy?
                    </h1>
                    <p className="text-text-muted text-lg">
                        Select as many as you like. We'll blend them perfectly.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {scentFamilies.map((family) => (
                        <ScentCard
                            key={family.id}
                            label={family.label}
                            icon={family.icon}
                            selected={selectedScents.includes(family.id)}
                            onClick={() => toggleScent(family.id)}
                        />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-full max-w-xl mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-subtle-beige/50"
                >
                    <h2 className="text-xl font-medium text-text-main">
                        Preferred scent strength
                    </h2>
                    <StrengthSlider value={strength} onChange={setStrength} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <button
                        disabled={selectedScents.length === 0}
                        className="px-10 py-4 bg-text-main text-white rounded-full font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all transform hover:scale-105"
                    >
                        Continue to Personalization
                    </button>
                </motion.div>

            </div>
        </main>
    );
}
