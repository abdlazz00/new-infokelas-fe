'use client';

import { useEffect, useState } from 'react';
import { announcementService } from '@/services/announcement.service';
import { Megaphone, Calendar, User, Search, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import AnnouncementModal from '@/components/dashboard/AnnouncementModal';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await announcementService.getAnnouncements();
            const dataList = Array.isArray(data) ? data : (data?.data || []);
            setAnnouncements(dataList);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat pengumuman.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item) => {
        setSelectedAnnouncement(item);
        setIsModalOpen(true);
    };

    // Logic Warna Badge (Sama dengan Modal)
    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t === 'darurat') return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/50';
        if (t === 'penting') return 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900/50';
        return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50';
    };

    const filteredList = announcements.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-slide-up pb-20">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Papan Pengumuman</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Informasi akademik dan kegiatan kampus.</p>
                </div>
                
                {/* Search Bar Dark Mode */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari info..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition shadow-sm placeholder-slate-400"
                    />
                </div>
            </div>

            {/* --- LIST CONTENT --- */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : filteredList.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="text-slate-400 dark:text-slate-500" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Tidak ada pengumuman</h3>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredList.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleOpenModal(item)}
                            // Card Style Dark Mode
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 hover:-translate-y-0.5 transition-all group overflow-hidden cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {item.image_url ? (
                                    <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 relative">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className={cn("hidden md:flex w-16 h-16 rounded-2xl items-center justify-center shrink-0 border dark:border-slate-800", getTypeColor(item.type))}>
                                        <Megaphone size={28} />
                                    </div>
                                )}

                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border dark:border-slate-800",
                                            getTypeColor(item.type)
                                        )}>
                                            {item.type || 'Umum'}
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {item.date} 
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            {item.created_at}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    
                                    {/* Deskripsi (Line Clamp) dengan support dark mode */}
                                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 dark:text-slate-300 dark:prose-invert line-clamp-3">
                                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </div>

                                    <div className="pt-4 mt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <User size={12} />
                                            <span>{item.author}</span>
                                        </div>
                                        <span className="text-brand-600 dark:text-brand-400 font-bold group-hover:underline">Baca Selengkapnya</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnnouncementModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                announcement={selectedAnnouncement} 
            />
        </div>
    );
}