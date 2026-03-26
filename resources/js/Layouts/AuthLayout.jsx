import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function AuthLayout({ children, title, subtitle, showRegisterLink, registerLink, loginLink }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen max-h-screen flex overflow-hidden bg-[#fdfcf7] dark:bg-slate-950">

      {/* ── Left: Full-bleed image + overlay ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex relative w-[52%] shrink-0 flex-col"
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1551240903-154be3f2e18b?w=1200&auto=format&fit=crop&q=80"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay hitam agar teks terbaca jelas */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: '256px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-2xl font-bold text-[#6fb89d]">
              Signify
            </span>
          </motion.div>

          {/* Center tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-bold text-white leading-tight mb-4"
            >
              Belajar Bahasa<br />
              <span className="text-[#6fb89d]">Isyarat Indonesia</span>
              <br />dengan AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-slate-300 text-sm max-w-xs leading-relaxed"
            >
              Deteksi gestur real-time, gamifikasi XP & badge, dan latihan, semua dalam satu platform.
            </motion.p>
          </div>

          {/* Bottom feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-2"
          >
            {['AI Gesture Recognition', 'XP & Badges', 'Leaderboard', 'Latihan Bebas'].map((f, i) => (
              <span
                key={i}
                className="text-xs bg-[#6fb89d]/20 border border-[#6fb89d]/40 text-[#6fb89d] rounded-full px-3 py-1"
              >
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right: Form panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex flex-col bg-[#fdfcf7] dark:bg-slate-950 overflow-hidden"
      >
        {/* Theme toggle — pojok kanan atas */}
        <div className="flex justify-end px-4 pt-4 shrink-0">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.88 }}
            aria-label={theme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-[#6fb89d]/10 hover:text-[#6fb89d] dark:hover:bg-[#6fb89d]/10 dark:hover:text-[#6fb89d] transition-colors"
          >
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.span>
          </motion.button>
        </div>

        {/* Centered form area — takes remaining height */}
        <div className="flex-1 flex items-center justify-center px-8 sm:px-12 py-4 overflow-hidden">
          <div className="w-full max-w-sm">

            {/* Mobile logo */}
            <div className="lg:hidden mb-4 text-center">
              <span className="text-2xl font-bold text-[#6fb89d]">
                Signify
              </span>
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5"
            >
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              )}
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {children}
            </motion.div>

            {/* Footer link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              {showRegisterLink ? (
                <>
                  Belum punya akun?{' '}
                  <Link href={registerLink} className="text-[#6fb89d] font-semibold hover:underline">
                    Daftar di sini
                  </Link>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <Link href={loginLink} className="text-[#6fb89d] font-semibold hover:underline">
                    Login di sini
                  </Link>
                </>
              )}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}