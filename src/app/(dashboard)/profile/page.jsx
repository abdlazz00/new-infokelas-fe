'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User, Mail, Phone, Camera, Lock, Save, LogOut, Loader2, Moon } from 'lucide-react'; // Import Icon Moon
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import LogoutModal from '@/components/dashboard/LogoutModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // <--- IMPORT THEME TOGGLE

export default function ProfilePage() {
    // ... (STATE DAN LOGIC LAIN TETAP SAMA, TIDAK PERLU DIUBAH) ...
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [activeTab, setActiveTab] = useState('profile');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authService.getProfile();
            const userData = res.data || res;
            setUser(userData);

            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            setPreviewAvatar(userData.avatar_url || '');
        } catch (error) {
            console.error("Gagal load profile:", error);
            toast.error("Gagal memuat profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);

            if (avatar) {
                formData.append('avatar', avatar);
            }
            const res = await authService.updateProfile(formData);

            const updatedUser = res.data || res;
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUser = { ...currentUser, ...updatedUser };

            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);

            if (newUser.avatar_url) {
                setPreviewAvatar(newUser.avatar_url);
            }

            toast.success("Profil berhasil diperbarui!");
        } catch (error) {
            console.error("Update error FULL:", error.response?.data);

            let errorMessage = "Gagal update profil.";

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstField = Object.keys(errors)[0];
                errorMessage = `${firstField}: ${errors[firstField][0]}`;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authService.updatePassword(currentPassword, newPassword);
            toast.success("Password berhasil diubah!");
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error("Password error:", error);
            toast.error(error.response?.data?.message || "Gagal ubah password.");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const executeLogout = async () => {
        setSaving(true);
        try {
            await authService.logout();
            localStorage.clear();
            router.push('/login');
            toast.success("Berhasil logout.");
        } catch (error) {
            localStorage.clear();
            router.push('/login');
        } finally {
            setSaving(false);
            setShowLogoutModal(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center space-y-4">
                            <Skeleton className="w-24 h-24 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up pb-20">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Akun</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* --- CARD KIRI (MENU & FOTO) --- */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto overflow-hidden border-4 border-white dark:border-slate-900 shadow-md">
                                {previewAvatar ? (
                                    <img src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-full h-full p-4 text-slate-300 dark:text-slate-600" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition shadow-sm border border-white dark:border-slate-900" title="Ganti Foto">
                                <Camera size={14} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <h2 className="mt-4 font-bold text-slate-800 dark:text-slate-100">{user?.name}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === 'profile'
                                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-l-4 border-brand-600 dark:border-brand-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <User size={18} /> Edit Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === 'password'
                                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-l-4 border-brand-600 dark:border-brand-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Lock size={18} /> Ganti Password
                        </button>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                        {/* --- BAGIAN TOGGLE TEMA BARU --- */}
                        <div className="px-5 py-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-3">
                                <Moon size={18} /> Tampilan
                            </span>
                            {/* Theme Toggle Component */}
                            <ThemeToggle />
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                        <button
                            onClick={handleLogoutClick}
                            className="w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut size={18} /> Keluar Aplikasi
                        </button>
                    </div>
                </div>

                {/* --- CARD KANAN (FORM) --- */}
                {/* (Isi Card Kanan Tetap Sama dengan sebelumnya) */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

                        {/* TAB 1: EDIT PROFILE */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-5 animate-slide-up">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Edit Profil</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Perbarui informasi pribadi Anda.</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nama Lengkap</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">No. WhatsApp</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="Contoh: 08123456789"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-70">
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: GANTI PASSWORD */}
                        {activeTab === 'password' && (
                            <form onSubmit={handleChangePassword} className="space-y-5 animate-slide-up">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Ganti Password</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Amankan akun Anda dengan password yang kuat.</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password Saat Ini</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password Baru</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="Min. 8 Karakter"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-70">
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={executeLogout}
                loading={saving}
            />
        </div>
    );
}