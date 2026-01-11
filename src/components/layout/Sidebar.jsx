'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, User, Megaphone } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Kelas Saya', path: '/classes', icon: BookOpen },
        { name: 'Jadwal', path: '/schedule', icon: Calendar },
        { name: 'Pengumuman', path: '/announcements', icon: Megaphone },
        { name: 'Profil', path: '/profile', icon: User },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 z-40 transition-colors duration-300">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
                    InfoKelas<span className="text-slate-800 dark:text-white">.</span>
                </h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link 
                            key={item.path} 
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive 
                                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Sidebar (Hanya Info Versi) */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-600">
                    v1.0.0 • InfoKelas SaaS
                </p>
            </div>
        </aside>
    );
}