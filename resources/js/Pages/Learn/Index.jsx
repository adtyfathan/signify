import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { BookOpen, Lock, LockOpen, Star, ChevronRight, Users, Clock } from 'lucide-react';
import { useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_META = {
  Beginner: {
    emoji: '👋',
    label: 'Pemula',
    badgeClass: 'bg-[#6fb89d]/15 text-[#6fb89d] border border-[#6fb89d]/30',
    barClass: 'from-[#6fb89d] to-[#6fb89d]/60',
    fallbackBg: 'from-[#6fb89d]/20 to-[#f8f3e1]',
  },
  Intermediate: {
    emoji: '💬',
    label: 'Menengah',
    badgeClass: 'bg-[#f8d95e]/20 text-amber-700 dark:text-amber-400 border border-[#f8d95e]/50',
    barClass: 'from-[#f8d95e] to-amber-400',
    fallbackBg: 'from-[#f8d95e]/20 to-[#f8f3e1]',
  },
  Advanced: {
    emoji: '🎓',
    label: 'Mahir',
    badgeClass: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20',
    barClass: 'from-red-400 to-orange-400',
    fallbackBg: 'from-red-100 to-[#f8f3e1]',
  },
};

const getMeta = (level) => LEVEL_META[level] ?? {
  emoji: '📚',
  label: level,
  badgeClass: 'bg-slate-100 text-lime-600 border border-slate-200',
  barClass: 'from-slate-400 to-slate-500',
  fallbackBg: 'from-slate-100 to-[#f8f3e1]',
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, barClass, delay = 0 }) {
  return (
    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${barClass} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value ?? 0)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay }}
      />
    </div>
  );
}

// ─── Module Card (Udemy-style) ────────────────────────────────────────────────

function ModuleCard({ module, index }) {
  const meta = getMeta(module.level);
  const locked = module.is_locked;
  const prog = Math.round(module.progress ?? 0);
  const started = prog > 0;

  const thumbnail = module.thumbnail_path
    ? `/${module.thumbnail_path}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={locked ? {} : { y: -3, transition: { duration: 0.2 } }}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-[#6fb89d]/20 dark:border-[#6fb89d]/15
        overflow-hidden shadow-sm hover:shadow-md transition-shadow
        ${locked ? 'opacity-60' : ''}`}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-[16/7] overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={module.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.fallbackBg} dark:from-slate-800 dark:to-slate-900 flex items-center justify-center`}>
            <span className="text-6xl opacity-40 select-none">{meta.emoji}</span>
          </div>
        )}

        {/* Lock overlay */}
        {locked && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl px-4 py-2 flex items-center gap-2 shadow">
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Terkunci</span>
            </div>
          </div>
        )}

        {/* Progress badge top-right */}
        {!locked && started && (
          <div className="absolute top-3 right-3 bg-[#6fb89d] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
            {prog}%
          </div>
        )}

        {/* Level badge top-left */}
        <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${meta.badgeClass} bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm`}>
          {meta.label}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1.5 line-clamp-2">
          {module.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {module.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {module.lesson_count} pelajaran
          </span>
          {started && (
            <span className="flex items-center gap-1 text-[#6fb89d]">
              <Star className="w-3.5 h-3.5 fill-[#6fb89d]" />
              Sedang dipelajari
            </span>
          )}
        </div>

        {/* Progress bar */}
        {!locked && (
          <div className="mb-4">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Progress</span>
              <span className="font-semibold text-[#6fb89d]">{prog}%</span>
            </div>
            <ProgressBar value={prog} barClass={meta.barClass} delay={index * 0.08 + 0.3} />
          </div>
        )}

        {/* CTA Button */}
        {locked ? (
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Terkunci
          </button>
        ) : (
          <Link href={`/modules/${module.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
                ${prog > 0
                  ? 'bg-[#6fb89d] hover:bg-[#5da88d] text-white'
                  : 'bg-[#f8f3e1] hover:bg-[#f0e9d2] dark:bg-[#6fb89d]/10 dark:hover:bg-[#6fb89d]/20 text-[#6fb89d] border border-[#6fb89d]/30'
                }`}
            >
              {prog > 0 ? 'Lanjutkan' : 'Mulai Belajar'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, iconClass, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 border border-[#6fb89d]/20 dark:border-[#6fb89d]/15 rounded-2xl p-5 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-[#f8f3e1] dark:bg-[#6fb89d]/10 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 ${iconClass}`} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LearnIndex() {
  const { modules = [], levels = [] } = usePage().props;
  const [activeLevel, setActiveLevel] = useState('all');

  const totalModules = modules.length;
  const unlockedModules = modules.filter(m => !m.is_locked).length;
  const completedPct = totalModules > 0
    ? Math.round(modules.reduce((s, m) => s + (m.progress ?? 0), 0) / totalModules)
    : 0;

  // Group modules by level for filter tabs
  const levelNames = ['all', ...new Set(modules.map(m => m.level))];
  const filtered = activeLevel === 'all'
    ? modules
    : modules.filter(m => m.level === activeLevel);

  return (
    <AppLayout>
      <Head title="Learn" />

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#6fb89d] uppercase tracking-widest mb-1">Kurikulum</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              Pembelajaran Terstruktur
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              Kurikulum lengkap dari pemula hingga mahir — ikuti urutan untuk hasil terbaik
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Total Modul" value={totalModules} iconClass="text-[#6fb89d]" delay={0.05} />
        <StatCard icon={LockOpen} label="Terbuka" value={unlockedModules} iconClass="text-[#6fb89d]" delay={0.1} />
        <StatCard icon={Star} label="Selesai" value={`${completedPct}%`} iconClass="text-[#f8d95e]" delay={0.15} />
      </div>

      {/* ── Level Filter Tabs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6 flex-wrap"
      >
        {levelNames.map(lvl => {
          const meta = getMeta(lvl);
          const isActive = activeLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
                ${isActive
                  ? 'bg-[#6fb89d] text-white border-[#6fb89d] shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-[#6fb89d]/20 dark:border-[#6fb89d]/15 hover:border-[#6fb89d]/50'
                }`}
            >
              {lvl === 'all' ? 'Semua' : `${meta.emoji} ${meta.label}`}
            </button>
          );
        })}
      </motion.div>

      {/* ── Modules Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {filtered.map((module, i) => (
          <ModuleCard key={module.id} module={module} index={i} />
        ))}
      </div>

      {/* ── Locked Note ── */}
      {modules.some(m => m.is_locked) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#f8f3e1] dark:bg-[#6fb89d]/5 border border-[#6fb89d]/25 dark:border-[#6fb89d]/15 rounded-2xl p-5 flex gap-4 items-start"
        >
          <div className="w-9 h-9 rounded-xl bg-[#6fb89d]/15 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-[#6fb89d]" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
              Tentang Modul Terkunci
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Modul tingkat selanjutnya akan terbuka saat kamu menyelesaikan modul sebelumnya.
              Terus belajar dan raih pencapaian baru!
            </p>
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}