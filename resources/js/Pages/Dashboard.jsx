import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import {
  Flame, Zap, Trophy, BookOpen, TrendingUp,
  ArrowRight, Play, Lightbulb, BarChart3, Target,
  CheckCircle2, Clock, ChevronRight
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function greet(name) {
  const hour = new Date().getHours();
  const time = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';
  return `${time}, ${name?.split(' ')[0]}`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, accent, delay = 0 }) {
  const accents = {
    yellow: 'text-yellow-500 bg-yellow-500/10',
    red: 'text-red-500 bg-red-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    green: 'text-green-500 bg-green-500/10',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── XP Progress Bar ──────────────────────────────────────────────────────────

function XpBar({ stats }) {
  const level = stats?.current_level ?? 1;
  const totalXp = stats?.total_xp ?? 0;
  const xpToNext = level * 100;
  const remainder = totalXp % xpToNext;
  const pct = Math.min(100, (remainder / xpToNext) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Level {level} → {level + 1}
          </span>
        </div>
        <span className="text-xs text-slate-400">{remainder} / {xpToNext} XP</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Butuh <span className="font-semibold text-yellow-600 dark:text-yellow-400">{xpToNext - remainder} XP</span> lagi untuk naik level
      </p>
    </motion.div>
  );
}

// ─── Sign Mastery Grid (A-Z) ──────────────────────────────────────────────────

function MasteryGrid({ signMastery }) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const levelColor = {
    mastered: 'bg-green-500 text-white border-green-500',
    practiced: 'bg-blue-400 text-white border-blue-400',
    learning: 'bg-yellow-400 text-white border-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Penguasaan Huruf</h3>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Mahir</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Latihan</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Belajar</span>
        </div>
      </div>
      <div className="grid grid-cols-9 gap-1.5">
        {letters.map((letter, i) => {
          const mastery = signMastery?.[letter];
          const level = mastery?.mastery_level;
          return (
            <motion.div
              key={letter}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.015 }}
              title={level ? `${letter}: ${level}` : `${letter}: belum dipelajari`}
              className={`aspect-square rounded-lg border flex items-center justify-center text-xs font-bold transition-all cursor-default
                                ${level
                  ? levelColor[level]
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
            >
              {letter}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────

function QuickAction({ href, icon: Icon, label, sub, color, delay = 0 }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    green: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 rounded-xl border ${colors[color]} hover:opacity-80 transition-opacity group`}
      >
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">{label}</p>
          {sub && <p className="text-[11px] opacity-60 leading-tight mt-0.5">{sub}</p>}
        </div>
        <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity shrink-0" />
      </Link>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, stats, recentQuizzes, recentBadges, signMastery, levelProgresses } = usePage().props;
  const userStats = stats ?? {};
  const name = user?.name ?? 'Pengguna';

  return (
    <AppLayout>
      <Head title="Dashboard" />

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.avatar_path
              ? <img src={user.avatar_path} className="w-full h-full object-cover rounded-xl" alt="avatar" />
              : getInitials(name)
            }
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {greet(name)} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {userStats.current_streak > 0
                ? `Streak ${userStats.current_streak} hari 🔥 — terus pertahankan!`
                : 'Mulai belajar hari ini untuk membangun streak!'
              }
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column (main) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total XP" icon={Zap} accent="yellow" delay={0.05}
              value={(userStats.total_xp ?? 0).toLocaleString()}
              sub={`Level ${userStats.current_level ?? 1}`}
            />
            <StatCard
              label="Streak" icon={Flame} accent="red" delay={0.1}
              value={userStats.current_streak ?? 0}
              sub={`Terpanjang: ${userStats.longest_streak ?? 0} hari`}
            />
            <StatCard
              label="Badge" icon={Trophy} accent="purple" delay={0.15}
              value={recentBadges?.length ?? 0}
              sub="diperoleh"
            />
            <StatCard
              label="Huruf" icon={BookOpen} accent="green" delay={0.2}
              value={`${userStats.letters_mastered ?? 0}/26`}
              sub="dikuasai"
            />
          </div>

          {/* XP progress */}
          <XpBar stats={userStats} />

          {/* Sign mastery grid */}
          <MasteryGrid signMastery={signMastery} />

          {/* Level progress bars */}
          {levelProgresses?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Progress per Level</h3>
              <div className="space-y-4">
                {levelProgresses.map((level, i) => (
                  <div key={level.level_id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{level.name}</span>
                      <span className="text-xs font-semibold text-slate-500">{Math.round(level.progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${level.progress}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Right column (sidebar) ── */}
        <div className="space-y-5">

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mulai Sekarang</h3>
            <div className="space-y-2">
              <QuickAction href="/learn" icon={BookOpen} label="Lanjut Belajar" sub="Modul & pelajaran" color="blue" delay={0.15} />
              <QuickAction href="/practice" icon={Lightbulb} label="Latihan Bebas" sub="Deteksi huruf bebas" color="indigo" delay={0.2} />
              <QuickAction href="/leaderboard" icon={BarChart3} label="Papan Peringkat" sub="Lihat posisi kamu" color="green" delay={0.25} />
            </div>
          </motion.div>

          {/* Recent quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Quiz Terakhir</h3>
              <Link href="/learn" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Semua
              </Link>
            </div>

            {recentQuizzes?.length > 0 ? (
              <div className="space-y-2">
                {recentQuizzes.map((quiz, i) => (
                  <motion.div
                    key={quiz.id ?? i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                                            ${quiz.score >= 80
                        ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                        : quiz.score >= 60
                          ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {quiz.score}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {quiz.lesson?.title ?? `Quiz #${i + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(quiz.created_at)}
                      </p>
                    </div>
                    {quiz.score >= 80 && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">Belum ada quiz. Mulai belajar!</p>
              </div>
            )}
          </motion.div>

          {/* Recent badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500" /> Badge Terbaru
              </h3>
              <Link href="/badges/user" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Semua
              </Link>
            </div>

            {recentBadges?.length > 0 ? (
              <div className="space-y-2">
                {recentBadges.slice(0, 4).map((badge, i) => (
                  <motion.div
                    key={badge.id ?? i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <span className="text-2xl shrink-0">{badge.icon_path || '🏆'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{badge.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatDate(badge.pivot?.earned_at ?? badge.earned_at)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">Belum ada badge. Selesaikan tantangan!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}