import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, title, subtitle, showRegisterLink, registerLink, loginLink }) {
  return (
    <div className="h-screen max-h-screen flex overflow-hidden bg-slate-950">

      {/* ── Left: Full-bleed image + overlay ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex relative w-[52%] shrink-0 flex-col"
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-blue-950/70" />

        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: '256px' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
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
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Isyarat Indonesia
              </span>
              <br />dengan AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-slate-300/80 text-sm max-w-xs leading-relaxed"
            >
              Deteksi gestur real-time, gamifikasi XP & badge, dan latihan berpasangan — semua dalam satu platform.
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
              <span key={i} className="text-xs bg-white/10 border border-white/10 text-white/70 rounded-full px-3 py-1">
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
        className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto"
      >
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-8 min-h-full">
          <div className="w-full max-w-sm mx-auto">

            {/* Mobile logo */}
            <div className="lg:hidden mb-6 text-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Signify
              </span>
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-7"
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
              className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              {showRegisterLink ? (
                <>
                  Belum punya akun?{' '}
                  <Link href={registerLink} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Daftar di sini
                  </Link>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <Link href={loginLink} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
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