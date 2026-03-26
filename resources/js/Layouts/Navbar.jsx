import React from 'react';
import { motion } from 'framer-motion';
import { Link, useForm } from '@inertiajs/react';
import { Zap, LogOut, User, Trophy, ChevronDown, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// Animated sun/moon icon with smooth swap animation
function ThemeIcon({ theme }) {
  return (
    <motion.span
      key={theme}
      initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-center"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </motion.span>
  );
}

export default function Navbar({ onMenuClick, user }) {
  const [scrolled, setScrolled] = React.useState(false);
  const { post } = useForm();
  const { theme, toggleTheme } = useTheme();

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
        ? 'border-[#6fb89d]/30 dark:border-[#6fb89d]/20 bg-[#fdfcf7]/95 dark:bg-slate-950/95 shadow-sm shadow-[#6fb89d]/10'
        : 'border-transparent bg-[#fdfcf7]/80 dark:bg-slate-950/80'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Left: Hamburger + Logo ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="text-xl font-bold text-[#6fb89d]"
              >
                Signify
              </motion.span>
            </Link>
          </div>

          {/* ── Right: XP chip + Theme Toggle + User dropdown ── */}
          <div className="flex items-center gap-3">

            {/* XP chip */}
            {user?.stats && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#f8d95e]/20 dark:bg-[#f8d95e]/10 border border-[#f8d95e]/50 dark:border-[#f8d95e]/30 rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-[#f8d95e] fill-[#f8d95e]/60" />
                <span className="text-xs font-bold text-amber-700 dark:text-[#f8d95e]">
                  {user.stats.total_xp?.toLocaleString()} XP
                </span>
              </div>
            )}

            {/* ── Theme Toggle Button ── */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.88 }}
              aria-label={theme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-[#6fb89d]/10 hover:text-[#6fb89d] dark:hover:bg-[#6fb89d]/10 dark:hover:text-[#6fb89d] transition-colors"
            >
              <ThemeIcon theme={theme} />
            </motion.button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6fb89d]">
                  <div className="w-7 h-7 rounded-lg bg-[#6fb89d] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm overflow-hidden">
                    {user?.avatar_path
                      ? <img src={user.avatar_path} alt={user.name} className="w-full h-full object-cover" />
                      : getInitials(user?.name)
                    }
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 rounded-xl border border-[#6fb89d]/20 dark:border-[#6fb89d]/20 bg-[#fdfcf7] dark:bg-slate-900 shadow-lg shadow-[#6fb89d]/10 dark:shadow-slate-900/50 p-1"
              >
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-[#6fb89d] flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                    {user?.avatar_path
                      ? <img src={user.avatar_path} alt={user.name} className="w-full h-full object-cover" />
                      : getInitials(user?.name)
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">@{user?.username}</p>
                  </div>
                </div>

                {user?.stats && (
                  <div className="sm:hidden flex items-center gap-2 px-3 py-2 mb-1 bg-[#f8d95e]/15 dark:bg-[#f8d95e]/10 rounded-lg mx-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-[#f8d95e]" />
                    <span className="text-xs font-bold text-amber-700 dark:text-[#f8d95e]">
                      {user.stats.total_xp?.toLocaleString()} XP
                    </span>
                  </div>
                )}

                <DropdownMenuSeparator className="bg-[#6fb89d]/15 my-1" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 focus:bg-[#6fb89d]/10 cursor-pointer transition-all"
                  >
                    <User className="w-4 h-4 text-[#6fb89d] shrink-0" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/badges"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/10 focus:bg-[#6fb89d]/10 cursor-pointer transition-all"
                  >
                    <Trophy className="w-4 h-4 text-[#6fb89d] shrink-0" />
                    Badge Saya
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#6fb89d]/15 my-1" />

                <DropdownMenuItem asChild>
                  <button
                    onClick={() => post(route('logout'))}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer transition-all"
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