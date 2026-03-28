import { motion } from 'framer-motion';

export function Suggestions({ onSend }: { onSend: (text: string) => void }) {
  const chips = [
    "Explain my fragrance",
    "Adjust intensity",
    "Try citrus",
    "Make it lighter"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 mt-2 mb-6 ml-12"
    >
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSend(chip)}
          className="px-4 py-2 rounded-full bg-white dark:bg-[#1a1a1a] border border-soft-teal/30 hover:border-soft-teal text-text-main hover:bg-soft-teal/5 transition-all text-sm font-medium shadow-sm"
        >
          {chip}
        </button>
      ))}
    </motion.div>
  );
}
