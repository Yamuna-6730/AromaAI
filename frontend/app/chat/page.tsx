'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ChatUI from '../components/ChatUI';

export default function ChatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-off-white dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soft-teal"></div>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-4rem)] mt-10 bg-off-white dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      <ChatUI />
    </main>
  );
}
