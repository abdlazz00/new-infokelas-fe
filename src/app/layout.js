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
  title: "InfoKelas - Aplikasi Akademik",
  description: "Pantau jadwal dan tugas kuliah.",
  manifest: "/manifest.webmanifest", // Link otomatis ke file manifest.js tadi
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
