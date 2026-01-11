'use client';

import { X, Calendar, User, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnnouncementModal({ isOpen, onClose, announcement }) {
    if (!isOpen || !announcement) return null;

    // Logic Warna Badge (Dark Mode Ready)
    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t === 'darurat') return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/50';
        if (t === 'penting') return 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900/50';
        return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Blur */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content (Dark Mode) */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                
                {/* Header (Image or Icon) */}
                <div className="relative shrink-0">
                    {announcement.image_url ? (
                        <div className="w-full h-48 sm:h-64 bg-slate-100 dark:bg-slate-800">
                            <img 
                                src={announcement.image_url} 
                                alt={announcement.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={cn("w-full h-32 flex items-center justify-center border-b dark:border-slate-800", getTypeColor(announcement.type))}>
                            <Megaphone size={48} className="opacity-50" />
                        </div>
                    )}
                    
                    {/* Tombol Close Floating */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full shadow-sm backdrop-blur transition-all border border-slate-200 dark:border-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 sm:p-8 overflow-y-auto">
                    {/* Metadata Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={cn(
                            "text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider",
                            getTypeColor(announcement.type)
                        )}>
                            {announcement.type || 'Info'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                            <Calendar size={14} />
                            <span>{announcement.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                            <User size={14} />
                            <span>{announcement.author}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
                        {announcement.title}
                    </h2>

                    {/* Prose Invert untuk HTML Content */}
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 dark:text-slate-300 dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
                    <button 
                        onClick={onClose}
                        className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}