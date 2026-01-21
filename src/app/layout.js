import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { ThemeProvider } from '@/components/Providers/ThemeProvider';

// 1. Tambahkan Config Viewport
export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Biar rasa native app (gak bisa zoom cubit)
};

export const metadata = {
  title: {
    default: 'InfoKelas - Platform Manajemen Kelas',
    template: '%s | InfoKelas',
  },
  description: 'Aplikasi manajemen kelas yang memudahkan guru dan siswa dalam kegiatan belajar mengajar.',
  
  verification: {
    google: 'google-site-verification=t7lagYD6wpBAVzU4NWRvKWsFCUp7rlaMomhW0yzzoqI', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Bungkus Children dengan ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
