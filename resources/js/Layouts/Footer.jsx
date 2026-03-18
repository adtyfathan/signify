import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

const sections = [
  {
    title: 'Belajar',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Modul Belajar', href: '/learn' },
      { label: 'Latihan Bebas', href: '/practice' },
    ],
  },
  {
    title: 'Komunitas',
    links: [
      { label: 'Papan Peringkat', href: '/leaderboard' },
      { label: 'Semua Badge', href: '/badges' },
    ],
  },
  {
    title: 'Akun',
    links: [
      { label: 'Profil Saya', href: '/profile' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">

      {/* Subtle glow accents */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute bottom-0 left-0 w-72 h-40 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-40 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

        {/* ── Top: Brand + Nav columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/dashboard" className="inline-block mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Signify
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
              Platform belajar Bahasa Isyarat Indonesia berbasis AI untuk semua kalangan.
            </p>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider — gradient fade ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-5" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Signify. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}