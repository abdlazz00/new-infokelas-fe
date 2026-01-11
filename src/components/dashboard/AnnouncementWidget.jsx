'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { announcementService } from '@/services/announcement.service';
import { Megaphone, Calendar, ArrowRight, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import AnnouncementModal from './AnnouncementModal';

export default function AnnouncementWidget() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await announcementService.getLatest(5);
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal load pengumuman:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item) => {
        setSelectedAnnouncement(item);
        setIsModalOpen(true);
    };

    // --- LOGIC WARNA TIPE (UPDATED DARK MODE) ---
    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t === 'darurat') return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/50';
        if (t === 'penting') return 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900/50';
        return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50';
    };

    if (loading) return <Skeleton className="w-full h-40 rounded-3xl" />;

    if (announcements.length === 0) {
        return (
            // Update Empty State
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-3xl p-6 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Bell size={24} className="text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold">Tidak ada pengumuman</h3>
                    <p className="text-sm text-slate-400">Belum ada informasi baru.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    {/* Header Text Dark Mode */}
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Megaphone className="text-brand-600 dark:text-brand-400" size={24} />
                        Info Terbaru
                    </h2>
                    <Link href="/announcements" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center">
                        Lihat Semua <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar snap-x">
                    {announcements.map((item, idx) => (
                        <div 
                            key={idx} 
                            // Card Background & Border Dark Mode
                            className="snap-center shrink-0 w-80 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide",
                                        getTypeColor(item.type)
                                    )}>
                                        {item.type || 'Info'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
                                        <Calendar size={10} />
                                        {item.date} 
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-snug mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                    {item.content}
                                </p>
                            </div>

                            <div className="relative z-10 pt-2 border-t border-slate-50 dark:border-slate-800 mt-auto flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 italic">
                                    {item.created_at} 
                                </span>
                                <button 
                                    onClick={() => handleOpenModal(item)}
                                    className="inline-flex text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors cursor-pointer"
                                >
                                    Baca Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnnouncementModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                announcement={selectedAnnouncement} 
            />
        </>
    );
}