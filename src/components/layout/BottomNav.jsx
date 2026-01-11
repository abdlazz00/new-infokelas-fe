'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, User, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Kelas', path: '/classes', icon: BookOpen },
    { name: 'Info', path: '/announcements', icon: Megaphone },
    { name: 'Jadwal', path: '/schedule', icon: Calendar },
    { name: 'Akun', path: '/profile', icon: User },
  ];

  // Logic active state (sedikit disesuaikan agar dashboard tidak selalu aktif jika ada sub-route lain)
  const isActive = (path) => pathname === path || (path !== '/dashboard' && pathname.startsWith(`${path}/`));

  return (
    // Update Container: Background & Border Dark Mode
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive(item.path)
                // Update Active State: Brand Color lebih terang di Dark Mode
                ? "text-brand-600 dark:text-brand-400"
                // Update Inactive State: Slate Color disesuaikan
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <item.icon
              size={22}
              strokeWidth={isActive(item.path) ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}