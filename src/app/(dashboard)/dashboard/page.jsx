'use client';

import { useEffect, useState } from 'react';
import { scheduleService } from '@/services/schedule.service';
import { 
    Calendar, Clock, MapPin, User, 
    Sun, Moon, CloudSun, BookOpen 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/Skeleton";
import AnnouncementWidget from '@/components/dashboard/AnnouncementWidget';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setGreeting('Selamat Pagi');
        else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
        else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        fetchTodaySchedule();
    }, []);

    const fetchTodaySchedule = async () => {
        try {
            const res = await scheduleService.getSchedules();
            const allSchedules = res.data || res;
            
            const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const todayName = daysMap[new Date().getDay()];

            const today = allSchedules.filter(item => item.day === todayName);
            setTodaySchedules(today);
        } catch (error) {
            console.error("Gagal load jadwal:", error);
        } finally {
            setLoading(false);
        }
    };

    const getGreetingIcon = () => {
        // Icon size responsive
        const iconClass = "w-8 h-8 md:w-12 md:h-12";
        if (greeting === 'Selamat Pagi') return <Sun className={`text-yellow-100 ${iconClass}`} />;
        if (greeting === 'Selamat Siang') return <Sun className={`text-orange-100 ${iconClass}`} />;
        if (greeting === 'Selamat Sore') return <CloudSun className={`text-orange-100 ${iconClass}`} />;
        return <Moon className={`text-blue-100 ${iconClass}`} />;
    };

    const getGradientClass = () => {
        if (greeting === 'Selamat Pagi') return 'bg-gradient-to-br from-blue-500 to-cyan-400 dark:from-blue-700 dark:to-cyan-600';
        if (greeting === 'Selamat Siang') return 'bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600';
        if (greeting === 'Selamat Sore') return 'bg-gradient-to-br from-orange-500 to-pink-500 dark:from-orange-700 dark:to-pink-700';
        return 'bg-gradient-to-br from-indigo-600 to-blue-800 dark:from-indigo-900 dark:to-blue-900';
    };

    return (
        // CLEAN WRAPPER: Tidak ada padding/margin tambahan yang merusak layout
        <div className="space-y-8 animate-slide-up">
            
            {/* 1. GREETING CARD */}
            {loading ? (
                <Skeleton className="h-40 md:h-56 w-full rounded-3xl" />
            ) : (
                <div className={`relative overflow-hidden rounded-3xl p-6 md:p-10 text-white shadow-xl ${getGradientClass()}`}>
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-blue-50/90 font-medium mb-1 text-sm md:text-lg flex items-center gap-2">
                                {greeting}
                            </p>
                            <h1 className="text-2xl md:text-4xl font-bold mb-2 truncate leading-tight">
                                {user?.name || 'Mahasiswa'}
                            </h1>
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30">
                                <span className="text-xs md:text-sm font-mono tracking-wider opacity-90">
                                    {user?.nim || user?.email || 'NIM Tidak Terbaca'}
                                </span>
                            </div>
                        </div>
                        <div className="opacity-90 shrink-0">
                            {getGreetingIcon()}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ANNOUNCEMENT WIDGET */}
            {/* Widget ini menggunakan margin negatif (-mx-4) di dalamnya.
                Karena Layout sudah memberi padding (p-4), margin negatif ini 
                akan membuat widget melebar pas ke ujung layar HP (Full Bleed),
                namun tetap rapi di dalam container. */}
            <div className="w-full">
                <AnnouncementWidget />
            </div>

            {/* 3. JADWAL HARI INI */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Calendar className="text-brand-600 dark:text-brand-400" size={24} />
                        Jadwal Hari Ini
                    </h2>
                    <span className="self-start md:self-auto text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 w-3/4">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                                <div className="pt-3 flex gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : todaySchedules.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {todaySchedules.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 dark:bg-brand-600"></div>
                                
                                <div className="flex justify-between items-start mb-4 pl-3 gap-3">
                                    <div className="flex-1 min-w-0"> 
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg md:text-xl group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-tight">
                                            {item.subject_name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium">
                                                <Clock size={14} className="text-orange-500 shrink-0"/>
                                                {item.time} WIB
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                                        <BookOpen size={24} />
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-3 border-t border-slate-50 dark:border-slate-800 pt-3 mt-auto">
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <MapPin size={16} className="text-red-400 shrink-0"/>
                                        <span className="truncate max-w-[150px]">R. {item.room}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <User size={16} className="text-blue-400 shrink-0"/>
                                        <span className="truncate max-w-[200px]">{item.lecturer}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200">Tidak ada jadwal kuliah</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-1 px-4">
                            Hari ini Anda bebas tugas akademik! 🎉
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}