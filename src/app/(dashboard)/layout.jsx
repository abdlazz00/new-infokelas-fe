import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      {/* UPDATE: Tambahkan 'w-full overflow-x-hidden' */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen w-full overflow-x-hidden">
        {/* Container ini sudah mengatur padding & max-width. */}
        {/* Jadi di page.jsx tidak perlu diulang lagi. */}
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