'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { classroomService } from '@/services/classroom.service';
import { 
    BookOpen, Users, Search, Plus, 
    MoreVertical, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const CARD_THEMES = [
    'from-blue-500 to-cyan-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-amber-400',
    'from-purple-600 to-pink-500',
    'from-indigo-600 to-blue-600',
    'from-rose-500 to-orange-400',
];

export default function MyClassesPage() {
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredClasses(classes);
        } else {
            const lower = searchQuery.toLowerCase();
            const filtered = classes.filter(c => 
                c.name.toLowerCase().includes(lower) || 
                (c.description && c.description.toLowerCase().includes(lower))
            );
            setFilteredClasses(filtered);
        }
    }, [searchQuery, classes]);

    const fetchClasses = async () => {
        try {
            const response = await classroomService.getMyClasses();
            const data = response.data || response;
            setClasses(data);
            setFilteredClasses(data);
        } catch (error) {
            console.error("Fetch classes error:", error);
            toast.error("Gagal memuat data kelas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-slide-up pb-10">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Dafter Kelas</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Akses materi dan tugas kelas Anda di sini.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                            placeholder="Cari kelas..."
                        />
                    </div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
                </div>
            ) : filteredClasses.length === 0 ? (
                <EmptyState searchQuery={searchQuery} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((item, index) => {
                        const themeClass = CARD_THEMES[index % CARD_THEMES.length];
                        
                        return (
                            <Link 
                                href={`/classes/${item.id}`} 
                                key={item.id}
                                className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
                            >
                                {/* Bagian Atas: Gradient Cover */}
                                <div className={`h-24 bg-gradient-to-r ${themeClass} relative p-6`}>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute -bottom-6 right-6 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 z-10 group-hover:scale-110 transition-transform duration-300">
                                        <BookOpen size={24} className={themeClass.split(' ')[1].replace('to-', 'text-')} />
                                    </div>
                                </div>

                                {/* Bagian Isi */}
                                <div className="p-6 pt-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                                            {item.code || 'CODE'}
                                        </span>
                                        <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                        {item.name}
                                    </h3>
                                    
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                                        {item.description || 'Tidak ada deskripsi untuk kelas ini.'}
                                    </p>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4 mt-auto">
                                        {/* Fake Stacked Avatars */}
                                        <div className="flex items-center -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500 overflow-hidden`}>
                                                    <UserAvatarPlaceholder index={i} />
                                                </div>
                                            ))}
                                            <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-500 dark:text-slate-400">
                                                +{item.students_count || 0}
                                            </div>
                                        </div>

                                        <span className="flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Masuk <ArrowRight size={16} className="ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// --- SUB COMPONENTS ---

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-pulse">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4"></div>
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-2/3"></div>
            <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between">
                <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            </div>
        </div>
    );
}

function EmptyState({ searchQuery }) {
    return (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {searchQuery ? `Tidak ditemukan "${searchQuery}"` : "Belum ada kelas"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery 
                    ? "Coba gunakan kata kunci lain atau pastikan ejaan benar." 
                    : "Anda belum terdaftar di kelas manapun. Yuk gabung kelas baru!"}
            </p>
        </div>
    );
}

function UserAvatarPlaceholder({ index }) {
    const colors = ['bg-red-200 dark:bg-red-900', 'bg-blue-200 dark:bg-blue-900', 'bg-green-200 dark:bg-green-900'];
    return <div className={`w-full h-full ${colors[index % 3]}`}></div>;
}