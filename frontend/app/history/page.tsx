'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, ChevronRight, Sparkles, User, Calendar } from 'lucide-react';
import { getSessionsAPI, getMessagesAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = localStorage.getItem('aroma_session_id');
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      const data = await getSessionsAPI(sessionId);
      setSessions(data);
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  const handleSessionClick = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    const msgs = await getMessagesAPI(sessionId);
    setMessages(msgs);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-text-muted">
        <Clock className="animate-spin mr-2" />
        Loading your history...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-soft-teal/20 flex items-center justify-center">
          <Clock className="w-6 h-6 text-soft-teal" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-main">Consultation History</h1>
          <p className="text-text-muted">Revisit your past fragrance journeys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sessions List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider px-2">Recent Sessions</h3>
          {sessions.length === 0 ? (
            <div className="p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-subtle-beige text-center">
              <p className="text-text-muted text-sm">No sessions found yet. Start a chat to begin!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedSessionId === session.id
                    ? 'bg-soft-teal/10 border-soft-teal text-soft-teal shadow-lg'
                    : 'bg-white/40 dark:bg-white/5 border-subtle-beige dark:border-white/10 hover:border-soft-teal/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm block">{session.title}</span>
                  <ChevronRight size={16} />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <Calendar size={12} />
                  {new Date(session.created_at).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Messages Detail */}
        <div className="lg:col-span-2">
          {!selectedSessionId ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 rounded-4xl border border-subtle-beige dark:border-white/10 border-dashed p-12 text-center">
              <MessageSquare className="w-12 h-12 text-subtle-beige mb-4" />
              <h3 className="font-bold text-text-main mb-2">Select a session</h3>
              <p className="text-text-muted text-sm max-w-xs">Pick a past consultation from the list to view the full message history and compositions.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 dark:bg-[#111]/60 backdrop-blur-xl rounded-4xl border border-subtle-beige dark:border-white/10 overflow-hidden shadow-2xl h-[70vh] flex flex-col"
            >
               <div className="p-6 border-b border-subtle-beige dark:border-white/10 bg-white/50 dark:bg-white/5">
                <h3 className="font-bold text-text-main">Message History</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                    <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-text-main text-white' : 'bg-soft-teal/20 text-soft-teal'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-text-main text-white' 
                          : 'bg-white dark:bg-[#1A1A1A] text-text-main border border-subtle-beige dark:border-white/10'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-white/50 dark:bg-white/5 border-t border-subtle-beige dark:border-white/10 flex justify-end">
                <button 
                  onClick={() => router.push('/chat')}
                  className="bg-text-main text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                >
                  Return to Chat
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
