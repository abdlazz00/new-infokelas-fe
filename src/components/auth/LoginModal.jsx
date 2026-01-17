'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { X, User, Lock, Loader2, LogIn, Eye, EyeOff, Shield, CheckSquare, Square } from 'lucide-react'; 
import toast from 'react-hot-toast';

export default function LoginModal({ isOpen, onClose }) {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // 1. Tambah State Remember Me (Default: True agar user senang)
    const [rememberMe, setRememberMe] = useState(true);

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authService.login(identifier, password);
            
            if (res.data) {
                // 2. Logika Penyimpanan Berdasarkan Remember Me
                const storage = rememberMe ? localStorage : sessionStorage;
                
                storage.setItem('token', res.data.token);
                storage.setItem('user', JSON.stringify(res.data.user));
            }

            toast.success(`Selamat datang kembali, ${res.data?.user?.name || 'User'}!`);
            
            router.push('/dashboard');
            onClose(); 
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "NIM/Email atau password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={!loading ? onClose : undefined}
            ></div>

            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <LogIn size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                        <p className="text-slate-500 text-sm mt-1">Masuk untuk mengakses dashboard akademik.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email / NIM</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    placeholder="Masukkan Email atau NIM"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* 3. CHECKBOX INGAT SAYA & LUPA PASSWORD */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${rememberMe ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300 group-hover:border-brand-400'}`}>
                                        <CheckSquare size={14} className={`text-white ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                </div>
                                <span className="ml-2 text-sm text-slate-600 font-medium select-none group-hover:text-brand-600 transition-colors">Ingat Saya</span>
                            </label>
                            
                            <a href="#" className="text-xs text-slate-400 hover:text-brand-600 font-bold transition-colors">
                                Lupa Password?
                            </a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Masuk Sekarang'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <a 
                            href="https://admin.infokelas.com" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            <Shield size={14} /> Login Sebagai Admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}