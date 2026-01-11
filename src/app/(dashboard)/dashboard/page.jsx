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
        if (greeting === 'Selamat Pagi') return <Sun className="text-yellow-100" size={48} />;
        if (greeting === 'Selamat Siang') return <Sun className="text-orange-100" size={48} />;
        if (greeting === 'Selamat Sore') return <CloudSun className="text-orange-100" size={48} />;
        return <Moon className="text-blue-100" size={48} />;
    };

    const getGradientClass = () => {
        if (greeting === 'Selamat Pagi') return 'bg-gradient-to-br from-blue-500 to-cyan-400 dark:from-blue-700 dark:to-cyan-600';
        if (greeting === 'Selamat Siang') return 'bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600';
        if (greeting === 'Selamat Sore') return 'bg-gradient-to-br from-orange-500 to-pink-500 dark:from-orange-700 dark:to-pink-700';
        return 'bg-gradient-to-br from-indigo-600 to-blue-800 dark:from-indigo-900 dark:to-blue-900';
    };

    return (
        <div className="space-y-8 animate-slide-up pb-20">
            
            {/* 1. GREETING CARD */}
            {loading ? (
                <Skeleton className="h-48 w-full rounded-3xl" />
            ) : (
                <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl ${getGradientClass()}`}>
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-50/90 font-medium mb-1 text-lg flex items-center gap-2">
                                {greeting}, User! 👋
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {user?.name || 'Mahasiswa'}
                            </h1>
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30">
                                <span className="text-sm font-mono tracking-wider opacity-90">
                                    {user?.nim || user?.email || 'NIM Tidak Terbaca'}
                                </span>
                            </div>
                        </div>
                        <div className="hidden md:block opacity-90">
                            {getGreetingIcon()}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ANNOUNCEMENT WIDGET */}
            <AnnouncementWidget />

            {/* 3. JADWAL HARI INI */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Calendar className="text-brand-600 dark:text-brand-400" size={24} />
                        Jadwal Hari Ini
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2 w-3/4">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                                <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : todaySchedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {todaySchedules.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 dark:bg-brand-600"></div>
                                
                                <div className="flex justify-between items-start mb-3 pl-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                            {item.subject_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                                            <Clock size={14} className="text-orange-500"/>
                                            <span className="font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded text-xs">
                                                {item.time} WIB
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 pl-3 border-t border-slate-50 dark:border-slate-800 pt-3">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <MapPin size={14} className="text-red-400"/>
                                        R. {item.room}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <User size={14} className="text-blue-400"/>
                                        {item.lecturer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Tidak ada jadwal kuliah</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hari ini Anda bebas tugas akademik! 🎉</p>
                    </div>
                )}
            </div>

        </div>
    );
}