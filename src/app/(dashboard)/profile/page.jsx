'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { User, Mail, Phone, Camera, Lock, Save, LogOut, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import LogoutModal from '@/components/dashboard/LogoutModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; 

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [activeTab, setActiveTab] = useState('profile');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState('');

    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authService.getProfile();
            // Handle jika response dibungkus { data: ... } atau langsung object
            const userData = res.data || res; 
            
            setUser(userData);
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || ''); 
            setPreviewAvatar(userData.avatar_url || '');
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Gagal memuat profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Validasi Tipe File
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error("Format file harus gambar (JPG/PNG/WEBP)");
            return;
        }

        // 2. Validasi Ukuran File (MAX 10MB)
        // Backend sudah diupdate menerima 10MB dan melakukan kompresi otomatis
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error("Ukuran file terlalu besar! Maksimal 10MB.");
            return;
        }

        // Set state untuk preview
        setAvatar(file);
        setPreviewAvatar(URL.createObjectURL(file));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading("Menyimpan perubahan...");

        try {
            // Gunakan FormData agar file binary bisa terkirim
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            
            // Kirim phone jika backend support (opsional)
            formData.append('phone', phone); 

            // Append avatar hanya jika user memilih file baru
            if (avatar) {
                formData.append('avatar', avatar);
            }

            // Panggil service (pastikan service support FormData)
            await authService.updateProfile(formData);
            
            toast.success("Profil berhasil diperbarui!", { id: toastId });
            
            // Refresh data user agar tampilan sinkron dengan server
            await fetchProfile();
            setAvatar(null); // Reset input file state
            
        } catch (error) {
            console.error("Update error:", error);
            const msg = error.response?.data?.message || "Gagal memperbarui profil";
            toast.error(msg, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        // Placeholder: Sesuaikan dengan endpoint backend jika fitur ganti password sudah ada
        toast.error("Fitur update password belum tersedia di server saat ini.");
    };

    const executeLogout = async () => {
        setSaving(true);
        try {
            await authService.logout();
            // Bersihkan storage lokal
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            toast.success("Berhasil logout");
            router.replace('/login');
        } catch (error) {
            console.error("Logout error:", error);
            // Tetap paksa logout di client side jika server error
            localStorage.removeItem('token');
            router.replace('/login');
        } finally {
            setSaving(false);
            setShowLogoutModal(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Akun</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola informasi profil dan keamanan akun Anda</p>
                </div>
                <div className="flex items-center gap-3">
                     {/* Theme Toggle Button */}
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <ThemeToggle />
                    </div>
                    
                    <button 
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-semibold border border-red-100 dark:border-red-800"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'profile'
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        <User size={18} />
                        Profil Saya
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'password'
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        <Lock size={18} />
                        Ganti Password
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                        
                        {/* TAB PROFILE */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-md">
                                            {previewAvatar ? (
                                                <img 
                                                    src={previewAvatar} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <User size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <label 
                                            htmlFor="avatar-upload" 
                                            className="absolute bottom-1 right-1 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition-colors shadow-sm"
                                        >
                                            <Camera size={16} />
                                        </label>
                                        <input 
                                            type="file" 
                                            id="avatar-upload" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="text-center sm:text-left space-y-1">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Foto Profil</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                                            Format: JPG, PNG, WEBP (Max. 10MB) <br/>
                                            <span className="text-xs text-brand-600 dark:text-brand-400">Otomatis dikompresi oleh sistem</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="Nama Lengkap Anda"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor Telepon</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="tel" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="0812..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-70"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB PASSWORD */}
                        {activeTab === 'password' && (
                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm rounded-xl border border-yellow-100 dark:border-yellow-800">
                                    Untuk keamanan, pastikan password Anda kuat dan tidak digunakan di situs lain.
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password Saat Ini</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="password" 
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="Masukkan password lama"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="password" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-colors"
                                                placeholder="Min. 8 Karakter"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-70"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                                        Update Password
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