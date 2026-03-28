'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ScentCardProps {
    label: string;
    icon: LucideIcon;
    selected: boolean;
    onClick: () => void;
}

export default function ScentCard({ label, icon: Icon, selected, onClick }: ScentCardProps) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
                scale: selected ? 1.05 : 1,
                backgroundColor: selected ? 'var(--off-white)' : 'var(--white)',
                borderColor: selected ? 'var(--soft-teal)' : 'transparent',
                boxShadow: selected ? '0 10px 30px -10px rgba(153, 184, 184, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
            transition={{ duration: 0.3 }}
            className={`
        cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-colors h-40 w-full
        ${selected ? 'border-soft-teal' : 'border-transparent bg-white'}
      `}
        >
            <div className={`p-3 rounded-full mb-3 ${selected ? 'bg-soft-teal/20 text-soft-teal' : 'bg-subtle-beige/50 text-text-muted'}`}>
                <Icon size={28} strokeWidth={1.5} />
            </div>
            <span className={`font-medium text-lg ${selected ? 'text-text-main' : 'text-text-muted'}`}>
                {label}
            </span>
        </motion.div>
    );
}
