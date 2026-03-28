'use client';

import { MessageSquare, Clock, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on the landing page
  if (pathname === '/') return null;

  const links = [
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
    { icon: Clock, label: 'History', href: '/history' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <motion.div 
      initial={{ width: '5rem' }}
      whileHover={{ width: '16rem' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-[#111] border-r border-subtle-beige dark:border-[#222] z-50 flex flex-col justify-between py-8 px-4 transition-all duration-300 group overflow-hidden shadow-2xl"
    >
      <div className="flex flex-col gap-8 w-full">
        {/* Logo Icon */}
        <Link href="/" className="flex items-center gap-4 px-2 w-full text-soft-teal hover:opacity-80 transition-opacity">
          <div className="min-w-8 min-h-8 rounded-full bg-soft-teal/20 flex items-center justify-center">
            <span className="font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-text-main">
            AromaAI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 w-full">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-4 px-2 py-3 rounded-xl transition-colors w-full ${
                  isActive 
                    ? 'bg-soft-teal/10 text-soft-teal dark:bg-soft-teal/20' 
                    : 'text-text-muted hover:bg-subtle-beige dark:hover:bg-[#222] hover:text-text-main'
                }`}
              >
                <link.icon size={24} className="min-w-6" />
                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.div>
  );
}
