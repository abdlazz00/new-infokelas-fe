import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav'; // Asumsi ada BottomNav

export default function DashboardLayout({ children }) {
  return (
    // PERHATIKAN CLASS DI BAWAH INI:
    // Tambahkan 'dark:bg-slate-950' agar background utama berubah gelap
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}