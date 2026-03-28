'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, BarChart3, Settings, Info } from 'lucide-react';
import ThreeDPerfume from './ThreeDPerfume';
import { sendChatMessage, saveProfileAPI, ChatResponse, CompoundProfile, UserProfile as UserProfileType } from '@/lib/api';
import { ActionPanel } from './ActionPanel';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  message: string;
  stage?: string;
  actions?: string[];
  composition?: CompoundProfile;
  profile_summary?: UserProfileType;
  confidence_score?: number;
  rag_matches?: any[];
}

export default function ChatUI() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', message: "Welcome to AromaAI. I'll help you craft a fragrance that matches your symptoms and style. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSessionId(session.user.id);
        localStorage.setItem('aroma_session_id', session.user.id);
      } else {
        let sid = localStorage.getItem('aroma_session_id');
        if (!sid) {
          sid = Math.random().toString(36).substring(2, 15);
          localStorage.setItem('aroma_session_id', sid);
        }
        setSessionId(sid);
      }
    };

    getSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', message: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data: ChatResponse = await sendChatMessage(messageText, sessionId);
      
      const assistantMsg: Message = {
        role: 'assistant',
        message: data.message,
        stage: data.stage,
        actions: data.actions,
        composition: data.composition,
        profile_summary: data.profile_summary,
        confidence_score: data.confidence_score,
        rag_matches: data.rag_matches
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', message: "I'm having a bit of trouble connecting. Let's try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (title: string) => {
    try {
      const res = await saveProfileAPI(sessionId, title);
      if (res.success) {
        handleSendMessage(`System: Saved fragrance as "${title}"`);
      }
    } catch (e) {
      console.error('Save error:', e);
      alert("Failed to save profile. Please try again.");
    }
  };

  const latestMessage = messages[messages.length - 1];
  const showActions = latestMessage?.role === 'assistant' && latestMessage.actions && latestMessage.actions.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-4xl mx-auto bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-subtle-beige dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-soft-teal/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-soft-teal" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-main">AromaAI Consultant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Stage: {latestMessage?.stage || 'Chatting'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {latestMessage?.confidence_score !== undefined && (
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-off-white dark:bg-white/5 rounded-lg border border-subtle-beige dark:border-white/10">
              <BarChart3 className="w-4 h-4 text-text-muted" />
              <span className="text-xs font-medium text-text-muted">{Math.round(latestMessage.confidence_score * 100)}% Confidence</span>
            </div>
          )}
          <button
        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-muted transition-colors"
        onClick={() => router.push("/settings")}
      >
        <Settings className="w-5 h-5" />
      </button>

      <button
        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-muted transition-colors"
        onClick={() => router.push("/info")}
      >
        <Info className="w-5 h-5" />
      </button>
      
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-text-main text-white' : 'bg-white dark:bg-[#1A1A1A] border border-subtle-beige dark:border-white/10'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-soft-teal" />}
                </div>
                
                <div className="flex flex-col gap-3 grow">
                  <div className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-text-main text-white rounded-tr-none' 
                      : 'bg-white dark:bg-[#1A1A1A] text-text-main border border-subtle-beige dark:border-white/10 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                  
                  {msg.role === 'assistant' && i === messages.length - 1 && showActions && (
                    <ActionPanel 
                      actions={msg.actions!} 
                      stage={msg.stage!} 
                      onSendAction={handleSendMessage}
                      onSaveProfile={handleSaveProfile}
                      onBuyNow={() => router.push(`/checkout?sessionId=${sessionId}`)}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-start w-full pl-14"
            >
              <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 py-2 px-4 rounded-full border border-subtle-beige dark:border-white/10">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-soft-teal/10">
                  <ThreeDPerfume isThinking={true} />
                </div>
                <span className="text-[13px] font-medium text-text-muted">Analyzing profile...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/50 dark:bg-white/5 border-t border-subtle-beige dark:border-white/10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="relative flex items-center bg-white dark:bg-[#1A1A1A] rounded-2xl border border-subtle-beige dark:border-white/10 shadow-xl p-1.5 focus-within:ring-2 focus-within:ring-soft-teal/30 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk about smells, allergies, or mood..."
            className="flex-1 bg-transparent px-4 py-3 text-text-main placeholder-text-muted outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-text-main dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
