import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useForm } from '@inertiajs/react';
import { Zap, LogOut, User, Trophy, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function Navbar({ onMenuClick, user }) {
  const [scrolled, setScrolled] = React.useState(false);
  const { post } = useForm();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-200 ${scrolled
          ? 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90'
          : 'border-transparent bg-white/60 dark:bg-slate-950/60'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Left: Hamburger + Logo ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"
              >
                Signify
              </motion.span>
            </Link>
          </div>

          {/* ── Right: XP chip + User dropdown ── */}
          <div className="flex items-center gap-3">

            {/* XP chip */}
            {user?.stats && (
              <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-400/20 rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/50" />
                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                  {user.stats.total_xp?.toLocaleString()} XP
                </span>
              </div>
            )}

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm overflow-hidden">
                    {user?.avatar_path
                      ? <img src={user.avatar_path} alt={user.name} className="w-full h-full object-cover" />
                      : getInitials(user?.name)
                    }
                  </div>

                  {/* Name */}
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name}
                  </span>

                  {/* Chevron */}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-1"
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                    {user?.avatar_path
                      ? <img src={user.avatar_path} alt={user.name} className="w-full h-full object-cover" />
                      : getInitials(user?.name)
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      @{user?.username}
                    </p>
                  </div>
                </div>

                {/* XP row — mobile only (hidden on sm+) */}
                {user?.stats && (
                  <div className="sm:hidden flex items-center gap-2 px-3 py-2 mb-1 bg-yellow-50 dark:bg-yellow-400/10 rounded-lg mx-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                      {user.stats.total_xp?.toLocaleString()} XP
                    </span>
                  </div>
                )}

                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-1" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300 hover:font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:text-slate-700 dark:focus:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-700/60 cursor-pointer transition-all"
                  >
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/badges"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300 hover:font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 focus:text-slate-700 dark:focus:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-700/60 cursor-pointer transition-all"
                  >
                    <Trophy className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    Badge Saya
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700 my-1" />

                <DropdownMenuItem asChild>
                  <button
                    onClick={() => post(route('logout'))}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer transition-all"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Keluar
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}