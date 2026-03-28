'use client';

import { motion } from 'framer-motion';

interface StrengthSliderProps {
    value: string;
    onChange: (value: string) => void;
}

const steps = ['Light', 'Medium', 'Strong'];

export default function StrengthSlider({ value, onChange }: StrengthSliderProps) {
    const currentIndex = steps.indexOf(value);

    return (
        <div className="w-full max-w-md mx-auto relative px-4 py-8">
            <div className="flex justify-between mb-4 text-sm font-medium text-text-muted">
                {steps.map((step) => (
                    <span
                        key={step}
                        className={`cursor-pointer transition-colors ${value === step ? 'text-soft-teal' : ''}`}
                        onClick={() => onChange(step)}
                    >
                        {step}
                    </span>
                ))}
            </div>

            {/* Track */}
            <div className="absolute top-1/2 left-0 w-full h-2 bg-subtle-beige rounded-full -translate-y-1/2 -z-10" />

            {/* Active Track (optional, simplistic) */}
            <motion.div
                className="absolute top-1/2 left-0 h-2 bg-soft-teal/30 rounded-full -translate-y-1/2 -z-10"
                animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <div className="relative w-full h-8 flex items-center justify-between">
                {/* Invisible click targets for steps */}
                {steps.map((step, index) => (
                    <div
                        key={step}
                        onClick={() => onChange(step)}
                        className="w-4 h-4 rounded-full bg-soft-teal/20 cursor-pointer flex items-center justify-center -ml-2 first:ml-0 last:mr-0"
                    >
                        {/* Visual pip */}
                        <div className="w-2 h-2 bg-soft-teal rounded-full" />
                    </div>
                ))}

                {/* Draggable Thumb */}
                <motion.div
                    className="absolute top-1/2 w-8 h-8 bg-white border-2 border-soft-teal rounded-full shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center"
                    animate={{
                        left: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 16px)`
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="w-2 h-2 bg-soft-teal rounded-full" />
                </motion.div>
            </div>
        </div>
    );
}
