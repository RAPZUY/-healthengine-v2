import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: "HealthEngine V3 — Kalkulator Kesehatan & Kebugaran Indonesia",
  description: "Kalkulator interaktif BMI, antropometri Indonesia, edukasi kalori, pola makan anak kos & standar, serta program latihan mingguan.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HealthEngine',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
