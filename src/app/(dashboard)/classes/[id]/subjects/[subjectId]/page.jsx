'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { materialService } from '@/services/material.service';
import { FileText, Download, ArrowLeft, FolderOpen, Link as LinkIcon, Video, File, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SubjectMaterialsPage() {
    const params = useParams();
    const router = useRouter();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.subjectId) {
            fetchMaterials();
        }
    }, [params.subjectId]);

    const fetchMaterials = async () => {
        try {
            const res = await materialService.getBySubject(params.subjectId);
            setMaterials(res.data || res);
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast.error("Gagal memuat materi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id, title) => {
        const toastId = toast.loading("Mendownload...");
        try {
            const res = await materialService.download(id);
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;

            const mimeType = res.data.type;
            const extension = mimeType.split('/')[1] || 'pdf';

            const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
            link.setAttribute('download', `${safeTitle}.${extension}`);

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Download berhasil!", {id: toastId});
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Gagal mendownload file.", { id: toastId });
        }
    }

    const getFileIcon = (item) => {
        if (item.file_url) return <FileText size={24} />;
        if (item.type === 'video') return <Video size={24} />;
        if (item.type === 'link') return <LinkIcon size={24} />;
        return <File size={24} />;
    };

    return (
        <div className="space-y-6 animate-slide-up pb-20">
            {/* --- HEADER STICKY --- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-4 md:-mx-8 px-4 md:px-8 py-4 sticky top-0 z-20 flex items-center gap-4 transition-colors">
                <button 
                    onClick={() => router.back()} 
                    className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-600 dark:text-slate-400"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Materi Pembelajaran</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daftar file dan referensi pertemuan</p>
                </div>
            </div>

            {/* --- CONTENT LIST --- */}
            <div className="max-w-4xl mx-auto min-h-[50vh]">
                {loading ? (
                    // SKELETON LOADING
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : materials.length > 0 ? (
                    <div className="space-y-4">
                        {materials.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition-all shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center group"
                            >
                                {/* Icon Box */}
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    {getFileIcon(item)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg sm:text-base truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    
                                    {/* Deskripsi */}
                                    <div 
                                        className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2 prose prose-sm max-w-none dark:prose-invert line-clamp-2" 
                                        dangerouslySetInnerHTML={{ __html: item.description }} 
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="mt-2 sm:mt-0 self-start sm:self-center shrink-0 flex items-center gap-2">
                                    {item.file_url ? (
                                        <>
                                            {/* PREVIEW BUTTON: Membuka file di tab baru (View Only) */}
                                            <a 
                                                href={item.file_url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
                                            </a>

                                            {/* DOWNLOAD BUTTON: Mengarah ke API Backend untuk Force Download */}
                                            <button 
                                                onClick={() => handleDownload(item.id, item.title)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors border border-brand-100 dark:border-brand-800 cursor-pointer"
                                            >
                                                <Download size={16} /> <span className="hidden sm:inline">Download</span>
                                            </button>
                                        </>
                                    ) : (
                                        // LINK EXTERNAL
                                        <a 
                                            href={item.link_url || '#'} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <LinkIcon size={16} /> <span className="hidden sm:inline">Buka Link</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // EMPTY STATE
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <FolderOpen className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                        <p className="text-slate-500 dark:text-slate-400">Folder materi ini kosong.</p>
                    </div>
                )}
            </div>
        </div>
    );
}