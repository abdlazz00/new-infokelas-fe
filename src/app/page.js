'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Calendar, Bell, Shield, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoginModal from '@/components/auth/LoginModal'; // <--- 1. Import Modal

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false); // <--- 2. State untuk Modal

    // Efek Navbar Transparan ke Solid saat scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500/30">
            
            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
                scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-4' : 'bg-transparent py-6'
            }`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-800">
                            InfoKelas<span className="text-brand-600">.</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 3. Ubah Tombol Masuk: Dari Link menjadi Button dengan onClick */}
                        <button 
                            onClick={() => setIsLoginOpen(true)}
                            className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors hidden sm:block"
                        >
                            Masuk
                        </button>
                        
                        <Link 
                            href="/register" 
                            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Daftar Sekarang <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-slide-up">
                        <Zap size={14} className="fill-brand-500" /> Platform Akademik Modern
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
                        Kelola Kuliah Jadi Lebih <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">
                            Mudah & Terorganisir
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                        Akses jadwal, materi, tugas, dan pengumuman kampus dalam satu platform terintegrasi. Tidak ada lagi info yang terlewat.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
                        {/* 4. Update CTA Utama: "Mulai Sekarang" memicu Login Modal */}
                        <button 
                            onClick={() => setIsLoginOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 transition-all hover:-translate-y-1"
                        >
                            Mulai Sekarang
                        </button>
                        <Link 
                            href="#features" 
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-lg transition-all"
                        >
                            Pelajari Fitur
                        </Link>
                    </div>

                    {/* Mockup Preview */}
                    <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl animate-slide-up" style={{animationDelay: '0.5s'}}>
                        <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-[16/9] relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                                    <p className="font-bold text-xl">Dashboard Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="py-20 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Lengkap Mahasiswa</h2>
                        <p className="text-slate-500 text-lg">Semua yang Anda butuhkan untuk menunjang produktivitas akademik ada di sini.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Calendar} 
                            color="bg-blue-50 text-blue-600"
                            title="Jadwal Otomatis" 
                            desc="Pantau jadwal kuliah harian dengan tampilan timeline yang rapi dan notifikasi pengingat."
                        />
                        <FeatureCard 
                            icon={Bell} 
                            color="bg-orange-50 text-orange-600"
                            title="Pusat Pengumuman" 
                            desc="Jangan ketinggalan info penting kampus. Pengumuman akademik, darurat, dan event tersentralisasi."
                        />
                        <FeatureCard 
                            icon={BookOpen} 
                            color="bg-brand-50 text-brand-600"
                            title="Manajemen Kelas" 
                            desc="Akses materi pelajaran (PDF/Video) dan kumpulkan tugas langsung dari satu dashboard."
                        />
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatItem value="1000+" label="Mahasiswa Aktif" />
                        <StatItem value="50+" label="Dosen Pengajar" />
                        <StatItem value="1200+" label="Materi Uploaded" />
                        <StatItem value="24/7" label="Akses Sistem" />
                    </div>
                </div>
            </section>

            {/* --- CTA BOTTOM --- */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-brand-600 to-blue-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-500/30">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-10 -mt-10 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mb-10 blur-3xl"></div>
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Mengatur Akademik Anda?</h2>
                            <p className="text-brand-100 text-lg mb-8">Bergabunglah dengan ribuan mahasiswa lainnya yang telah beralih ke cara belajar yang lebih cerdas.</p>
                            <Link 
                                href="/register" 
                                className="inline-block bg-white text-brand-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-colors shadow-lg"
                            >
                                Daftar Gratis Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                                <BookOpen size={16} />
                            </div>
                            <span className="text-lg font-bold text-white">
                                InfoKelas<span className="text-brand-500">.</span>
                            </span>
                        </div>
                        
                        <div className="flex gap-8 text-sm font-medium">
                            <a href="#" className="hover:text-white transition-colors">Tentang Kami</a>
                            <a href="#" className="hover:text-white transition-colors">Fitur</a>
                            <a href="#" className="hover:text-white transition-colors">Bantuan</a>
                            <a href="#" className="hover:text-white transition-colors">Privasi</a>
                        </div>

                        <div className="text-xs">
                            &copy; {new Date().getFullYear()} InfoKelas SaaS. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* 5. Render Modal Component */}
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
            />

        </div>
    );
}

// --- SUB COMPONENTS ---

function FeatureCard({ icon: Icon, title, desc, color }) {
    return (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${color}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function StatItem({ value, label }) {
    return (
        <div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">{value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        </div>
    );
}