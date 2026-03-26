import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Zap, Lock, CheckCircle, Trophy, Star, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

/* ─────────────────────────────────────────────
   Rarity config — badge-specific colours are
   intentionally outside the main palette
───────────────────────────────────────────── */
const RARITY_CONFIG = {
  common: {
    label: 'Common',
    gradient: 'from-slate-400 to-slate-500',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    glow: 'shadow-slate-200 dark:shadow-slate-800',
    bar: 'bg-slate-400',
    emoji: '🎖️',
  },
  uncommon: {
    label: 'Uncommon',
    gradient: 'from-emerald-400 to-teal-500',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    glow: 'shadow-emerald-100 dark:shadow-emerald-900/40',
    bar: 'bg-emerald-400',
    emoji: '🌿',
  },
  rare: {
    label: 'Rare',
    gradient: 'from-blue-400 to-indigo-500',
    pill: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    glow: 'shadow-blue-100 dark:shadow-blue-900/40',
    bar: 'bg-blue-400',
    emoji: '💎',
  },
  epic: {
    label: 'Epic',
    gradient: 'from-violet-500 to-purple-600',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    glow: 'shadow-violet-100 dark:shadow-violet-900/40',
    bar: 'bg-violet-500',
    emoji: '⚡',
  },
  legendary: {
    label: 'Legendary',
    gradient: 'from-amber-400 via-orange-400 to-yellow-400',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    glow: 'shadow-amber-200 dark:shadow-amber-900/40',
    bar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
    emoji: '👑',
  },
};

const getRarity = (key) => RARITY_CONFIG[key?.toLowerCase()] ?? RARITY_CONFIG.common;

/* ─────────────────────────────────────────────
   Filter pill button
───────────────────────────────────────────── */
function FilterPill({ value, active, onClick, children }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${active
          ? 'bg-[#6fb89d] text-white shadow-sm'
          : 'bg-[#f8f3e1] text-slate-600 hover:bg-[#6fb89d]/15 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-[#6fb89d]/20'
        }`}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge card
───────────────────────────────────────────── */
function BadgeCard({ badge, index }) {
  const rarity = getRarity(badge.rarity);
  const earned = !!badge.earned_at;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <div
        className={`relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 h-full flex flex-col
          ${earned
            ? `border-2 shadow-lg ${rarity.glow} border-transparent`
            : 'border border-slate-200/70 dark:border-slate-800 opacity-70 hover:opacity-100'
          }`}
        style={earned ? { borderImage: 'none' } : {}}
      >
        {/* Rarity bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${rarity.gradient}`} />

        {/* If earned — subtle gradient wash */}
        {earned && (
          <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-[0.04] pointer-events-none`} />
        )}

        <div className="flex flex-col items-center text-center p-5 flex-1">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl mb-3 flex items-center justify-center
            bg-gradient-to-br ${rarity.gradient} ${earned ? 'shadow-md' : 'grayscale opacity-40'} transition-all`}>
            {earned ? (
              badge.icon_path && !imgError ? (
                <img
                  src={badge.icon_path}
                  alt={badge.name}
                  className="w-9 h-9 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl leading-none select-none">{rarity.emoji}</span>
              )
            ) : (
              <Lock className="w-7 h-7 text-white/80" />
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight mb-1.5">
            {badge.name}
          </h3>

          {/* Rarity pill */}
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2.5 ${rarity.pill}`}>
            {rarity.label}
          </span>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {badge.description}
          </p>

          {/* XP */}
          <div className={`flex items-center gap-1 text-xs font-semibold mt-auto
            ${earned ? 'text-[#6fb89d]' : 'text-slate-400'}`}>
            <Zap className="w-3 h-3" />
            +{badge.xp_bonus ?? 0} XP
          </div>

          {/* Earned footer */}
          {earned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 w-full"
            >
              <div className="flex items-center justify-center gap-1 text-xs text-[#6fb89d] font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Terkumpul
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {new Date(badge.earned_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function BadgesIndex() {
  const { allBadges = [], earnedCount = 0, totalCount = 0 } = usePage().props;
  const [selectedRarity, setSelectedRarity] = useState('all');

  const completionPct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
  const totalXpBonus = allBadges.filter((b) => b.earned_at).reduce((s, b) => s + (b.xp_bonus ?? 0), 0);

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'earned', label: 'Terkumpul' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const filtered = useMemo(() => {
    if (selectedRarity === 'all') return allBadges;
    if (selectedRarity === 'earned') return allBadges.filter((b) => b.earned_at);
    return allBadges.filter((b) => b.rarity?.toLowerCase() === selectedRarity);
  }, [selectedRarity, allBadges]);

  return (
    <AppLayout>
      <Head title="Koleksi Badge" />

      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#f8d95e] flex items-center justify-center shrink-0 mt-0.5">
              <Trophy className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Koleksi Badge
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Raih badge dan tunjukkan pencapaian Anda kepada komunitas
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <StatCard
            label="Badge Terkumpul"
            value={earnedCount}
            sub={`dari ${totalCount} badge`}
            icon={Trophy}
            accent="bg-[#f8d95e]"
          />
          <StatCard
            label="Completion"
            value={`${completionPct}%`}
            sub="progres koleksi"
            icon={Star}
            accent="bg-[#6fb89d]"
          />
          <StatCard
            label="Total XP Bonus"
            value={totalXpBonus.toLocaleString()}
            sub="XP dari badge"
            icon={Zap}
            accent="bg-amber-400"
          />
        </motion.div>

        {/* ── Progress bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Progres Koleksi
            </span>
            <span className="text-sm font-bold text-[#6fb89d]">{completionPct}%</span>
          </div>
          <div className="h-2.5 bg-[#f8f3e1] dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#6fb89d] to-[#5aa489] rounded-full"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {earnedCount} dari {totalCount} badge berhasil dikumpulkan
          </p>
        </motion.div>

        {/* ── Filter pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {filters.map((f) => (
            <FilterPill
              key={f.value}
              value={f.value}
              active={selectedRarity === f.value}
              onClick={setSelectedRarity}
            >
              {f.label}
              {f.value === 'earned' && (
                <span className="ml-1.5 bg-[#6fb89d]/20 text-[#6fb89d] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {earnedCount}
                </span>
              )}
            </FilterPill>
          ))}
        </motion.div>

        {/* ── Badge grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={selectedRarity}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filtered.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#f8f3e1] dark:bg-slate-800 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Belum ada badge dengan filter ini</p>
              <p className="text-sm text-slate-400 mt-1">Coba filter lain atau terus belajar untuk mendapatkan badge baru</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tips section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#f8f3e1] dark:bg-slate-900 rounded-2xl p-6 border border-[#6fb89d]/20 dark:border-[#6fb89d]/10"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-lg bg-[#6fb89d] flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-white" />
            </div>
            Cara Mengumpulkan Badge
          </h3>

          {/* Rarity ladder */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((r, i, arr) => (
              <div key={r} className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getRarity(r).pill}`}>
                  {getRarity(r).label}
                </span>
                {i < arr.length - 1 && <span className="text-slate-400 text-xs">→</span>}
              </div>
            ))}
          </div>

          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-[#6fb89d] font-bold mt-0.5">•</span>
              Selesaikan tantangan dan kondisi tertentu untuk membuka badge
            </li>
            <li className="flex gap-2">
              <span className="text-[#6fb89d] font-bold mt-0.5">•</span>
              Badge Legendary memerlukan dedikasi jangka panjang dan prestasi tinggi
            </li>
            <li className="flex gap-2">
              <span className="text-[#6fb89d] font-bold mt-0.5">•</span>
              XP bonus dari badge menambah total XP Anda untuk ranking
            </li>
          </ul>
        </motion.div>

      </div>
    </AppLayout>
  );
}