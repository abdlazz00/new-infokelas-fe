'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assignmentService } from '@/services/assignment.service';
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchDetail();
    }, [params.id]);

    const fetchDetail = async () => {
        try {
            const res = await assignmentService.getDetail(params.id);
            // Handle variasi response backend
            setTask(res.data?.assignment || res.data || res);
        } catch (error) {
            console.error("Gagal load tugas:", error);
            toast.error("Tugas tidak ditemukan");
        } finally {
            setLoading(false);
        }
    };

    // --- LOADING SKELETON (Sudah Support Dark Mode) ---
    if (loading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen -m-4 md:-m-8 p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-8 w-40 rounded-lg" />
                                <Skeleton className="h-8 w-32 rounded-lg" />
                            </div>
                        </div>
                        <div className="p-6 md:p-8 space-y-4">
                            <Skeleton className="h-4 w-32 mb-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="mt-8 pt-4">
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!task) return <div className="p-10 text-center dark:text-slate-200">Tugas tidak ditemukan.</div>;

    const deadlineDate = new Date(task.deadline);
    const isOverdue = new Date() > deadlineDate;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen -m-4 md:-m-8 p-4 md:p-8 animate-slide-up">
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Tombol Kembali */}
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition font-medium text-sm"
                >
                    <ArrowLeft size={18} className="mr-2" /> Kembali ke Kelas
                </button>

                {/* KARTU TUGAS */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {task.title}
                            </h1>
                            
                            {/* Status Badge */}
                            <span className={`self-start px-3 py-1 rounded-full text-xs font-bold border ${
                                isOverdue 
                                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50' 
                                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
                            }`}>
                                {isOverdue ? 'Deadline Lewat' : 'Sedang Aktif'}
                            </span>
                        </div>
                        
                        {/* Info Deadline */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <Calendar size={16} className="mr-2 text-brand-500 dark:text-brand-400" />
                                {deadlineDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <Clock size={16} className="mr-2 text-orange-500 dark:text-orange-400" />
                                {deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="p-6 md:p-8">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm uppercase tracking-wide">
                            Instruksi Pengerjaan
                        </h3>
                        
                        {/* --- HTML CONTENT (PROSE) --- */}
                        {/* prose-invert membalik warna teks otomatis di dark mode */}
                        <div 
                            className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800" 
                            dangerouslySetInnerHTML={{ __html: task.description || '<p>Tidak ada instruksi khusus.</p>' }}
                        />

                        {/* Info Submission */}
                        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-900/50">
                            <Info size={20} className="shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" />
                            <div>
                                <span className="font-bold block mb-1">Informasi Pengumpulan:</span>
                                Silakan kerjakan tugas sesuai instruksi di atas. Untuk saat ini pengumpulan dilakukan secara manual atau melalui link eksternal yang diberikan dosen.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}