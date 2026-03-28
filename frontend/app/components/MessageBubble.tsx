import { motion } from 'framer-motion';

export function MessageBubble({ isUser, message }: { isUser: boolean; message: string | React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-soft-teal/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
          <span className="text-soft-teal text-xs font-bold">A</span>
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl ${
        isUser 
          ? 'bg-text-main text-white rounded-br-none shadow-md' 
          : 'bg-white dark:bg-[#1A1A1A] text-text-main border border-subtle-beige dark:border-white/10 shadow-sm rounded-bl-none'
      }`}>
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </motion.div>
  );
}
