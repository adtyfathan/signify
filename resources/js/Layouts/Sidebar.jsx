import React from 'react';
import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import {
  Home, BookOpen, Trophy, BarChart3, X, Lightbulb
} from 'lucide-react';

const menuItems = [
  {
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard',
    id: 'dashboard',
  },
  {
    icon: BookOpen,
    label: 'Learn',
    href: '/learn',
    id: 'learn',
  },
  {
    icon: Lightbulb,
    label: 'Practice',
    href: '/practice',
    id: 'practice',
  },
  {
    icon: BarChart3,
    label: 'Leaderboard',
    href: '/leaderboard',
    id: 'leaderboard',
  },
  {
    icon: Trophy,
    label: 'Badges',
    href: '/badges',
    id: 'badges',
  },
];

export default function Sidebar({ open, onClose }) {
  const { url } = usePage();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-64 bg-[#fdfcf7] dark:bg-slate-900 border-r border-[#6fb89d]/20 dark:border-[#6fb89d]/15 flex flex-col overflow-hidden h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-[#6fb89d]/20 dark:border-[#6fb89d]/15">
          <span className="text-lg font-bold text-[#6fb89d]">
            Menu
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 rounded-md text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = url.startsWith(item.href);

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                      ? 'bg-[#6fb89d] text-white shadow-sm shadow-[#6fb89d]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 hover:text-[#6fb89d] dark:hover:text-[#6fb89d]'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#fdfcf7]/70" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#6fb89d]/20 dark:border-[#6fb89d]/15 px-5 py-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Signify — Edukasi Bahasa Isyarat
          </p>
        </div>
      </motion.aside>
    </>
  );
}