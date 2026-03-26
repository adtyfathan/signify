import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { Trophy, Zap, Medal, Crown, TrendingUp } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

const PODIUM_CONFIG = {
  1: {
    medal: '🥇',
    gradient: 'from-[#f8d95e] to-[#e6c244]',
    ring: 'ring-[#f8d95e]/60',
    bg: 'bg-[#f8d95e]/10',
    text: 'text-[#a08400]',
    height: 'h-24',
    order: 'order-2',
  },
  2: {
    medal: '🥈',
    gradient: 'from-[#6fb89d] to-[#4e9e82]',
    ring: 'ring-[#6fb89d]/50',
    bg: 'bg-[#6fb89d]/10',
    text: 'text-[#4e9e82]',
    height: 'h-16',
    order: 'order-1',
  },
  3: {
    medal: '🥉',
    gradient: 'from-[#f8f3e1] to-[#e8e0c8]',
    ring: 'ring-[#f8f3e1]/50',
    bg: 'bg-[#f8f3e1]/60 dark:bg-[#f8f3e1]/10',
    text: 'text-[#7a6a3a] dark:text-[#c8b878]',
    height: 'h-12',
    order: 'order-3',
  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ username, size = 'md', ring = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-[#fdfcf7] shrink-0 ring-2 ${ring || 'ring-transparent'}`}
      style={{ background: 'linear-gradient(135deg, #6fb89d 0%, #4e9e82 100%)' }}
    >
      {getInitials(username)}
    </div>
  );
}

// ─── Podium Card (Top 3) ──────────────────────────────────────────────────────

function PodiumCard({ user, index }) {
  const cfg = PODIUM_CONFIG[user.rank] ?? PODIUM_CONFIG[3];
  const isFirst = user.rank === 1;

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col items-center ${cfg.order}`}
    >
      {isFirst && (
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -15 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mb-1"
        >
          <Crown className="w-6 h-6 text-[#f8d95e] fill-[#f8d95e]" />
        </motion.div>
      )}

      <div className={`relative mb-3 ${isFirst ? 'mt-0' : 'mt-7'}`}>
        <UserAvatar username={user.username} size={isFirst ? 'xl' : 'lg'} ring={cfg.ring} />
        <span className="absolute -bottom-1 -right-1 text-base">{cfg.medal}</span>
      </div>

      <p className={`font-bold text-slate-900 dark:text-[#fdfcf7] text-center truncate max-w-[90px] ${isFirst ? 'text-base' : 'text-sm'}`}>
        {user.username}
      </p>
      <p className="text-xs text-slate-500 dark:text-[#6fb89d]/60 mb-2">Lv.{user.level ?? 1}</p>

      <div className={`flex items-center gap-1 ${cfg.bg} rounded-full px-3 py-1`}>
        <Zap className={`w-3.5 h-3.5 ${cfg.text}`} />
        <span className={`text-xs font-bold ${cfg.text}`}>{user.xp_earned?.toLocaleString()}</span>
      </div>

      <div className={`mt-3 w-20 ${cfg.height} rounded-t-xl bg-gradient-to-b ${cfg.gradient} opacity-80 flex items-start justify-center pt-1`}>
        <span className="text-white font-black text-lg drop-shadow">#{user.rank}</span>
      </div>
    </motion.div>
  );
}

// ─── Rank Row (4–10) ──────────────────────────────────────────────────────────

function RankRow({ user, isCurrentUser, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 + 0.1, duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
        ${isCurrentUser
          ? 'bg-[#6fb89d]/8 dark:bg-[#6fb89d]/10 border border-[#6fb89d]/30 dark:border-[#6fb89d]/25'
          : 'bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-[#6fb89d]/20 dark:hover:border-[#6fb89d]/15'
        }`}
    >
      <div className="w-8 text-center shrink-0">
        <span className="text-sm font-bold text-slate-500 dark:text-[#6fb89d]/50">
          #{user.rank}
        </span>
      </div>

      <UserAvatar username={user.username} size="sm" />

      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate text-sm ${isCurrentUser ? 'text-[#4e9e82] dark:text-[#6fb89d]' : 'text-slate-900 dark:text-[#fdfcf7]'}`}>
          {user.username}
          {isCurrentUser && (
            <span className="ml-2 text-[10px] bg-[#6fb89d]/15 dark:bg-[#6fb89d]/20 text-[#4e9e82] dark:text-[#6fb89d] px-1.5 py-0.5 rounded-full font-medium">
              Anda
            </span>
          )}
        </p>
        <p className="text-xs text-slate-400 dark:text-[#6fb89d]/40">Level {user.level ?? 1}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Zap className="w-3.5 h-3.5 text-[#f8d95e]" />
        <span className="font-bold text-sm text-slate-900 dark:text-[#fdfcf7]">
          {user.xp_earned?.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Your Rank Banner ─────────────────────────────────────────────────────────

function YourRankBanner({ rank, xp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex items-center gap-4 rounded-2xl px-5 py-4 mb-6 border border-[#6fb89d]/25 dark:border-[#6fb89d]/20"
      style={{
        background: 'linear-gradient(to right, rgba(111,184,157,0.08), rgba(248,243,225,0.06))',
      }}
    >
      <div className="w-10 h-10 rounded-full bg-[#6fb89d]/15 dark:bg-[#6fb89d]/10 flex items-center justify-center shrink-0">
        <Medal className="w-5 h-5 text-[#6fb89d]" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-[#6fb89d]/50 mb-0.5">Posisi kamu minggu ini</p>
        <p className="font-bold text-slate-900 dark:text-[#fdfcf7] text-lg leading-tight">
          {rank ? `Peringkat #${rank}` : 'Belum masuk peringkat'}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-slate-400 dark:text-[#6fb89d]/40 mb-0.5">XP minggu ini</p>
        <div className="flex items-center gap-1 justify-end">
          <Zap className="w-4 h-4 text-[#f8d95e]" />
          <span className="font-bold text-slate-900 dark:text-[#fdfcf7]">{xp?.toLocaleString() ?? 0}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Leaderboard ─────────────────────────────────────────────────────────

export default function Leaderboard() {
  const { auth, topUsers = [], userRank = null, userXp = 0 } = usePage().props;
  const [activeTab, setActiveTab] = useState('weekly');

  const currentUserId = auth?.user?.id;
  const top3 = topUsers.slice(0, 3);
  const rest = topUsers.slice(3);

  return (
    <AppLayout>
      <Head title="Leaderboard" />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-7 h-7 text-[#f8d95e] fill-[#f8d95e]/20" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-[#fdfcf7]">
            Papan Peringkat
          </h1>
        </div>
        <p className="text-slate-500 dark:text-[#6fb89d]/60 text-sm ml-10">
          Peringkat diperbarui setiap minggu berdasarkan XP yang diperoleh.
        </p>
      </motion.div>

      {/* ── Your rank banner ── */}
      <YourRankBanner rank={userRank} xp={userXp} />

      {/* ── Tab switcher ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl p-1 mb-6 w-fit">
        {[
          { key: 'weekly', label: 'Minggu Ini' },
          { key: 'allTime', label: 'Sepanjang Waktu' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-white dark:bg-[#6fb89d]/15 text-[#4e9e82] dark:text-[#6fb89d] shadow-sm border border-[#6fb89d]/20 dark:border-[#6fb89d]/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#4e9e82] dark:hover:text-[#6fb89d]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {topUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-[#6fb89d]/30">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">Belum ada data peringkat.</p>
              <p className="text-sm mt-1">Mulai kuis untuk masuk papan peringkat!</p>
            </div>
          ) : (
            <>
              {/* ── Podium Top 3 ── */}
              {top3.length > 0 && (
                <div className="mb-8">
                    <p className="text-xs font-semibold text-slate-400 dark:text-[#fdfcf7]/80 uppercase tracking-wider mb-4">
                    🏆 Top 3
                  </p>
                  <div className="flex items-end justify-center gap-3 md:gap-6">
                    {[
                      top3.find(u => u.rank === 2),
                      top3.find(u => u.rank === 1),
                      top3.find(u => u.rank === 3),
                    ].filter(Boolean).map((user, i) => (
                      <PodiumCard key={user.user_id ?? user.id} user={user} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Ranks 4–10 ── */}
              {rest.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-[#6fb89d]/50 uppercase tracking-wider mb-3">
                    Peringkat Lainnya
                  </p>
                  <div className="space-y-2">
                    {rest.map((user, i) => (
                      <RankRow
                        key={user.user_id ?? user.id}
                        user={user}
                        isCurrentUser={user.user_id === currentUserId || user.id === currentUserId}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Tips ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {[
          { icon: '📅', text: 'Selesaikan kuis setiap hari untuk XP konsisten.' },
          { icon: '🔥', text: 'Jaga streak aktif untuk bonus XP harian.' },
          { icon: '🎯', text: 'Kuis lebih sulit memberikan XP lebih besar.' },
          { icon: '🏅', text: 'Raih badge untuk mendapatkan bonus XP tambahan.' },
        ].map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-[#f8f3e1]/60 dark:bg-slate-800/50 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10 rounded-xl p-3"
          >
            <span className="text-lg shrink-0">{tip.icon}</span>
            <p className="text-slate-600 dark:text-[#fdfcf7]/60 text-sm">{tip.text}</p>
          </div>
        ))}
      </motion.div>
    </AppLayout>
  );
}