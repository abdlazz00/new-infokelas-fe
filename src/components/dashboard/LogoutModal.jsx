'use client';

import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={!loading ? onClose : undefined}
            ></div>

            {/* Update: bg-white -> dark:bg-slate-900, border */}
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    {/* Icon Box */}
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-sm">
                        <LogOut size={32} className="ml-1" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        Yakin ingin keluar?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Sesi Anda akan berakhir dan Anda harus login kembali untuk mengakses aplikasi.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Ya, Keluar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}