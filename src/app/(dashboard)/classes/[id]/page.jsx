'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { classroomService } from '@/services/classroom.service';
import { assignmentService } from '@/services/assignment.service';
import { 
    BookOpen, Users, FileText, Calendar, 
    ArrowLeft, MoreVertical, Clock, CheckCircle, ArrowRight,
    Search, LayoutGrid, List, Folder, User 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ClassDetailPage() {
    const params = useParams();
    const classId = params.id;
    const router = useRouter();

    // --- STATES ---
    const [activeTab, setActiveTab] = useState('subjects'); 
    const [classroom, setClassroom] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & VIEW STATES ---
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // --- FETCH DATA ---
    useEffect(() => {
        if (classId) {
            fetchClassData();
        }
    }, [classId]);

    useEffect(() => {
        if (!classId) return;
        if (activeTab === 'subjects' && subjects.length === 0) fetchSubjects();
        else if (activeTab === 'assignments' && assignments.length === 0) fetchAssignments();
    }, [activeTab, classId]);

    useEffect(() => {
        setSearchQuery('');
    }, [activeTab]);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            const res = await classroomService.getClassDetail(classId);
            setClassroom(res.data || res);
            fetchSubjects(); 
        } catch (error) {
            console.error("Error fetching class:", error);
            toast.error("Gagal memuat detail kelas.");
            router.push('/classes'); 
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await classroomService.getSubjects(classId);
            setSubjects(res.data || res);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await assignmentService.getByClassroom(classId);
            setAssignments(res.data || res);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // --- FILTER LOGIC ---
    const filteredSubjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subject.code && subject.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredAssignments = assignments.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- LOADING SKELETON ---
    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-3xl" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (!classroom) return null;

    return (
        <div className="space-y-6 animate-slide-up pb-20">
            {/* --- HEADER KELAS --- */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 dark:bg-brand-900/20 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
                
                <button onClick={() => router.back()} className="flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 mb-4 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali
                </button>

                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{classroom.name}</h1>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{classroom.description || 'Tidak ada deskripsi kelas.'}</p>
                        </div>
                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                            <Users size={16} className="mr-2 text-brand-500 dark:text-brand-400" />
                            <span className="font-semibold mr-1">{classroom.students_count || 0}</span> Mahasiswa
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                            <BookOpen size={16} className="mr-2 text-orange-500 dark:text-orange-400" />
                            <span className="font-semibold mr-1">{subjects.length || 0}</span> Mata Kuliah
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
                <TabButton active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon={BookOpen} label="Mata Kuliah" />
                <TabButton active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} icon={FileText} label="Tugas" />
                <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={Users} label="Anggota" />
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="min-h-[300px]">
                
                {/* === TAB 1: MATA KULIAH (GOOGLE DRIVE STYLE) === */}
                {activeTab === 'subjects' && (
                    <div className="space-y-4">
                        
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                            {/* Search Input */}
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari mata kuliah..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition shadow-sm placeholder-slate-400"
                                />
                            </div>

                            {/* View Toggles */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {filteredSubjects.length === 0 ? (
                            <EmptyState message={searchQuery ? `Tidak ditemukan "${searchQuery}"` : "Belum ada mata kuliah di kelas ini."} />
                        ) : (
                            <>
                                {/* --- GRID MODE --- */}
                                {viewMode === 'grid' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredSubjects.map((subject) => (
                                            <Link 
                                                href={`/classes/${classId}/subjects/${subject.id}`} 
                                                key={subject.id}
                                                className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                                        <Folder size={20} className="fill-current" />
                                                    </div>
                                                    <button className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                                
                                                <div>
                                                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" title={subject.name}>
                                                        {subject.name}
                                                    </h3>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                                                        {subject.code || 'CODE'} • {subject.sks} SKS
                                                    </p>
                                                </div>
                                                
                                                <div className="pt-3 mt-auto border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                                    <User size={12} className="text-slate-400 dark:text-slate-500" />
                                                    <span className="truncate max-w-[100px]">{subject.lecturer || 'Dosen'}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* --- LIST MODE --- */}
                                {viewMode === 'list' && (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4">Nama Mata Kuliah</th>
                                                    <th className="px-6 py-4 hidden md:table-cell">Dosen Pengampu</th>
                                                    <th className="px-6 py-4 w-24 text-center">SKS</th>
                                                    <th className="px-6 py-4 w-32 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
                                                {filteredSubjects.map((subject) => (
                                                    <tr key={subject.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                                                                    <BookOpen size={20} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800 dark:text-slate-200">{subject.name}</div>
                                                                    <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{subject.code}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell text-slate-600 dark:text-slate-400">
                                                            <div className="flex items-center gap-2">
                                                                <User size={14} className="text-slate-400 dark:text-slate-500" />
                                                                {subject.lecturer || 'Belum ditentukan'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                                                            <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-xs font-bold">
                                                                {subject.sks}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link 
                                                                href={`/classes/${classId}/subjects/${subject.id}`} 
                                                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Buka <ArrowRight size={12} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* === TAB 2: TUGAS === */}
                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                         {/* Toolbar */}
                         <div className="mb-6">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari tugas..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition shadow-sm placeholder-slate-400"
                                />
                            </div>
                         </div>

                         {filteredAssignments.length === 0 ? (
                            <EmptyState message={searchQuery ? `Tidak ditemukan tugas "${searchQuery}"` : "Belum ada tugas aktif."} />
                        ) : (
                            filteredAssignments.map((task) => (
                                <div key={task.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                            task.is_submitted 
                                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                                            : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                        }`}>
                                            {task.is_submitted ? <CheckCircle size={20} /> : <FileText size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{task.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                    <Calendar size={12} className="mr-1 text-slate-400 dark:text-slate-500"/> 
                                                    {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}
                                                </span>
                                                {task.deadline && (
                                                    <span className="text-xs flex items-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        <Clock size={12} className="mr-1 text-slate-400 dark:text-slate-500"/> 
                                                        {new Date(task.deadline).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href={`/assignments/${task.id}`}
                                        className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 dark:hover:border-brand-800 transition-all shrink-0 text-center"
                                    >
                                        Detail Tugas
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <EmptyState message="Fitur List Anggota akan segera hadir." />
                )}
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                active 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function EmptyState({ message }) {
    return (
        <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        </div>
    );
}