'use client';

import { useEffect, useState } from 'react';
import { scheduleService } from '@/services/schedule.service';
import { 
    Calendar, Clock, MapPin, User, BookOpen, 
    MoreVertical, ArrowRight 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

// Helper untuk nama hari Indonesia
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function SchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await scheduleService.getSchedules();
            const data = res.data || res;
            setSchedules(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal load jadwal:", error);
            toast.error("Gagal memuat jadwal.");
        } finally {
            setLoading(false);
        }
    };

    // Grouping jadwal berdasarkan hari
    const groupedSchedules = DAYS.map(day => ({
        day,
        items: schedules.filter(s => s.day === day)
    })).filter(group => group.items.length > 0);

    if (loading) {
        return (
            <div className="space-y-6 pb-20">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-40 rounded-lg" />
                </div>

                {[1, 2, 3].map((day) => (
                    <div key={day} className="pl-4 md:pl-0">
                        <Skeleton className="h-6 w-24 mb-4" /> 
                        <div className="space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 pl-6 pb-6">
                            {[1, 2].map((item) => (
                                <div key={item} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <div className="flex-1 space-y-2 w-full">
                                        <Skeleton className="h-6 w-3/4" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-5 w-20" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto md:pl-6 space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up pb-20">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Jadwal Kuliah</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola waktu dan jangan lewatkan kelas Anda.</p>
                </div>
            </div>

            {/* --- CONTENT LIST --- */}
            {schedules.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-2">
                    {groupedSchedules.map((group) => (
                        <div key={group.day} className="relative pl-4 md:pl-0">
                            {/* Label Hari */}
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-brand-500 block"></span>
                                {group.day}
                            </h2>

                            {/* Timeline Line */}
                            <div className="border-l-2 border-slate-200 dark:border-slate-800 ml-1.5 pl-6 pb-6 space-y-4">
                                {group.items.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            
                                            {/* Kiri: Info Utama */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                        {item.subject_name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                                            <Clock size={14} className="mr-1.5 text-orange-500" />
                                                            {item.time} WIB
                                                        </span>
                                                        <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                                            <MapPin size={14} className="mr-1.5 text-red-500" />
                                                            R. {item.room}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kanan: Dosen Info */}
                                            <div className="flex items-center gap-3 pl-0 md:pl-6 md:border-l border-slate-100 dark:border-slate-800 w-full md:w-auto">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                    <User size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Dosen Pengampu</span>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                                                        {item.lecturer}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- SUB COMPONENT ---
function EmptyState() {
    return (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Jadwal Kosong
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Belum ada jadwal kuliah yang tersedia untuk semester ini.
            </p>
        </div>
    );
}