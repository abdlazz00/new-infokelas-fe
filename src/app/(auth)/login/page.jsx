'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Pengganti useHistory/window.location
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    
    // --- STATE ---
    const [view, setView] = useState('login'); 
    const [loading, setLoading] = useState(false);

    // --- FORM INPUTS ---
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const adminUrl = "https://admin.infokelas.com/admin/login";

    // 1. LOGIC LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login(identifier, password);
            const { token, user } = res.data; 

            // Simpan Token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success(`Selamat datang, ${user.name}!`);
            
            // Redirect ke Dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error("Login Error:", error);
            const pesan = error.response?.data?.message || 'Gagal login. Periksa Email/NIM dan Password.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    // 2. LOGIC REQUEST OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.requestOtp(identifier);
            toast.success('Kode OTP terkirim ke WhatsApp!');
            setView('reset-password');
        } catch (error) {
            const pesan = error.response?.data?.message || 'Gagal mengirim OTP.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    // 3. LOGIC RESET PASSWORD
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.resetPassword(identifier, otp, newPassword);
            toast.success('Password berhasil diubah! Silakan login.');
            setPassword(''); 
            setView('login'); 
        } catch (error) {
            const pesan = error.response?.data?.message || 'Kode OTP salah/kadaluarsa.';
            toast.error(pesan);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
            
            {/* Background Decorations */}
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* --- CARD UTAMA --- */}
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-white/50 relative z-10 overflow-hidden">
                
                {/* HEADER */}
                <div className="pt-10 pb-6 px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-4 shadow-sm">
                        {view === 'login' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>}
                        {view === 'request-otp' && <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                        {view === 'reset-password' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
                    </div>
                    
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {view === 'login' && 'Infokelas.'}
                        {view === 'request-otp' && 'Lupa Password?'}
                        {view === 'reset-password' && 'Reset Password'}
                    </h1>
                    
                    <p className="text-slate-500 text-sm mt-2">
                        {view === 'login' && 'Masuk menggunakan Email atau NIM'}
                        {view === 'request-otp' && 'Masukkan NIM/Email, kami akan kirim OTP ke WhatsApp.'}
                        {view === 'reset-password' && 'Masukkan Kode OTP dan Password Baru.'}
                    </p>
                </div>

                {/* === VIEW 1: LOGIN === */}
                {view === 'login' && (
                    <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email / NIM</label>
                            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="Contoh: 12345678" required />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={() => setView('request-otp')} className="text-xs font-semibold text-brand-600 hover:underline">
                                Lupa Password?
                            </button>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : 'Login'}
                        </button>
                    </form>
                )}

                {/* === VIEW 2: REQUEST OTP === */}
                {view === 'request-otp' && (
                    <form onSubmit={handleRequestOtp} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email / NIM</label>
                            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none" placeholder="Masukkan NIM/Email" required />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : 'Kirim OTP WA'}
                        </button>

                        <button type="button" onClick={() => setView('login')} className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">
                            Batal
                        </button>
                    </form>
                )}

                {/* === VIEW 3: RESET PASSWORD === */}
                {view === 'reset-password' && (
                    <form onSubmit={handleResetPassword} className="px-8 pb-10 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Kode OTP</label>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-mono outline-none" placeholder="XXXXXX" required />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password Baru</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Min. 6 Karakter" required />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : 'Ubah Password'}
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="bg-slate-50 py-4 px-8 text-center border-t border-slate-100">
                    <div className="pt-2">
                        <a href={adminUrl} target="_blank" className="text-[10px] font-medium text-slate-400 hover:text-brand-500 uppercase tracking-widest">
                            Masuk sebagai Admin?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}