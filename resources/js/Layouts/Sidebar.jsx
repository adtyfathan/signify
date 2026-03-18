import React from 'react';
import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, BookOpen, Trophy, Zap, Users, BarChart3, X,
  Lightbulb, Activity
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
  {
    icon: Users,
    label: 'Match',
    href: '/match',
    id: 'match',
  },
];

export default function Sidebar({ open, onClose }) {
  const { url } = usePage();

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden h-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = url.startsWith(item.href);

            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Signify - Edukasi Bahasa Isyarat
          </p>
        </div>
      </motion.aside>
    </>
  );
}
