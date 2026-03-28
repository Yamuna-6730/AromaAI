import { ArrowUp } from 'lucide-react';

export function InputBox({ 
  value, onChange, onSend, disabled 
}: { 
  value: string; 
  onChange: (v: string) => void; 
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={`w-full relative shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] rounded-2xl bg-white dark:bg-[#111] border border-subtle-beige dark:border-white/10 flex items-center p-2 focus-within:ring-2 ring-soft-teal/50 transition-all ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
      <input 
        title="Chat Input"
        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-text-main placeholder-text-muted/60"
        placeholder={disabled ? "AI is thinking..." : "Tell me about your fragrance preferences..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled) onSend();
        }}
        disabled={disabled}
      />
      <button 
        onClick={onSend}
        disabled={disabled || !value.trim()}
        title="Send Message"
        className="p-3 bg-text-main dark:bg-[#222] text-white rounded-xl hover:bg-soft-teal dark:hover:bg-soft-teal transition-colors disabled:opacity-50 disabled:hover:bg-text-main disabled:dark:hover:bg-[#222] flex-shrink-0"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
