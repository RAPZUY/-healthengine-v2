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
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: "HealthEngine V4.2.1 — Kalkulator Kesehatan, Latihan & Lari",
  description:
    "Kalkulator BMI, target nutrisi, program latihan mingguan, timer istirahat, verifikasi gerakan, dan pencatat lari dengan tema gelap/terang serta aksen pastel.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HealthEngine',
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw =
      localStorage.getItem('healtyapp_v4_state') ||
      localStorage.getItem('healtyapp_v3_state');
    var parsed = raw ? JSON.parse(raw) : {};
    var accents = {
      engine: ['#2563eb', '#ffffff', '#93c5fd', '#1d4ed8', '#60a5fa', '#2563eb'],
      sky: ['#a2d2ff', '#020617', '#a2d2ff', '#1e40af', '#a2d2ff', '#3b7fb8'],
      baby: ['#bde0fe', '#020617', '#bde0fe', '#1e40af', '#bde0fe', '#3b7fb8'],
      sakura: ['#ffb3c6', '#020617', '#ffb3c6', '#9d174d', '#ffb3c6', '#be185d'],
      mint: ['#a5ffd6', '#020617', '#a5ffd6', '#047857', '#a5ffd6', '#059669'],
      teal: ['#84dcc6', '#020617', '#84dcc6', '#0f766e', '#84dcc6', '#0d9488']
    };
    var accent = accents[parsed.accentId] || accents.engine;
    var accentId = accents[parsed.accentId] ? parsed.accentId : 'engine';
    var mode = parsed.themeMode === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    root.dataset.theme = mode;
    root.dataset.accent = accentId;
    root.style.colorScheme = mode;
    root.style.setProperty('--accent-color', accent[0]);
    root.style.setProperty('--accent-contrast', accent[1]);
    root.style.setProperty('--accent-soft-dark', accent[2]);
    root.style.setProperty('--accent-soft-light', accent[3]);
    root.style.setProperty('--accent-strong-dark', accent[4]);
    root.style.setProperty('--accent-strong-light', accent[5]);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'light' ? '#f4f6fb' : '#020617');
  } catch (error) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.dataset.accent = 'engine';
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
