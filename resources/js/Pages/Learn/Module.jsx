import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import {
  BookOpen, Lock, LockOpen, CheckCircle2,
  Clock, Zap, ArrowLeft, Play, ChevronRight
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META = {
  Beginner: { emoji: '👋', label: 'Pemula', gradientClass: 'from-[#6fb89d] to-[#4a9e82]' },
  Intermediate: { emoji: '💬', label: 'Menengah', gradientClass: 'from-amber-400 to-amber-600' },
  Advanced: { emoji: '🎓', label: 'Mahir', gradientClass: 'from-red-400 to-rose-600' },
};

const getMeta = (level) => LEVEL_META[level] ?? {
  emoji: '📚', label: level ?? '', gradientClass: 'from-slate-400 to-slate-600',
};

const LESSON_TYPE_LABEL = {
  theory: { label: 'Teori', icon: '📖' },
  quiz_letter: { label: 'Kuis Huruf', icon: '📙' },
  quiz_word: { label: 'Kuis Kata', icon: '📙' },
  practice: { label: 'Praktik', icon: '🤚' },
};

const getLessonTypeMeta = (type) =>
  LESSON_TYPE_LABEL[type] ?? { label: type, icon: '📋' };

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS = {
  completed: { label: 'Selesai', badgeClass: 'bg-[#6fb89d]/15 text-[#6fb89d] border border-[#6fb89d]/30' },
  in_progress: { label: 'Sedang Dikerjakan', badgeClass: 'bg-[#f8d95e]/20 text-amber-700 dark:text-amber-400 border border-[#f8d95e]/40' },
  unlocked: { label: 'Siap Belajar', badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700' },
  locked: { label: 'Terkunci', badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700' },
};

const getStatus = (s) => STATUS[s] ?? STATUS.locked;

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, delay = 0 }) {
  return (
    <div className="h-2 bg-[#6fb89d]/10 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#6fb89d] to-[#f8d95e] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value ?? 0)}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay }}
      />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconClass, label, value, delay }) {
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

// ─── Lesson Row ───────────────────────────────────────────────────────────────

function LessonRow({ lesson, index }) {
  const typeMeta = getLessonTypeMeta(lesson.type);
  const statusMeta = getStatus(lesson.status);
  const isUnlocked = lesson.is_unlocked;
  const isDone = lesson.status === 'completed';

  const imgSrc = lesson.first_image ? `/${lesson.first_image}` : null;

  const rowContent = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all
        ${isUnlocked
          ? 'bg-white dark:bg-slate-900 border-[#6fb89d]/20 dark:border-[#6fb89d]/15 hover:border-[#6fb89d]/50 hover:shadow-sm cursor-pointer'
          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
        }`}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#6fb89d] flex items-center justify-center relative">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl select-none">{typeMeta.icon}</span>
        )}

        {/* Play overlay on hover */}
        {isUnlocked && !isDone && (
          <div className="absolute inset-0 bg-[#6fb89d]/0 group-hover:bg-[#6fb89d]/80 flex items-center justify-center transition-all duration-200">
            <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}

        {/* Completed checkmark overlay */}
        {isDone && (
          <div className="absolute inset-0 bg-[#6fb89d]/70 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-semibold leading-snug truncate
          ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
          {lesson.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Type badge */}
          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {typeMeta.icon} {typeMeta.label}
          </span>

          {/* XP */}
          {lesson.xp_reward > 0 && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> +{lesson.xp_reward} XP
            </span>
          )}

          {/* Status badge */}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusMeta.badgeClass}`}>
            {statusMeta.label}
          </span>

          {/* Best score */}
          {isDone && lesson.best_score !== null && (
            <span className="text-[10px] font-semibold text-[#6fb89d]">
              Skor: {lesson.best_score}%
            </span>
          )}
        </div>
      </div>

      {/* Right: action */}
      <div className="shrink-0">
        {isUnlocked ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${isDone
              ? 'bg-[#6fb89d]/15 text-[#6fb89d]'
              : 'bg-[#f8f3e1] dark:bg-[#6fb89d]/10 text-[#6fb89d] group-hover:bg-[#6fb89d] group-hover:text-white'
            }`}>
            {isDone
              ? <CheckCircle2 className="w-4 h-4" />
              : <ChevronRight className="w-4 h-4" />
            }
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}
      </div>
    </motion.div>
  );

  return isUnlocked
    ? <Link href={`/lessons/${lesson.id}`} className='block'>{rowContent}</Link>
    : rowContent;
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ModuleDetail() {
  const { module, lessons = [] } = usePage().props;
  const meta = getMeta(module.level?.name);

  const completedLessons = lessons.filter(l => l.status === 'completed').length;
  const progressPercentage = lessons.length > 0
    ? (completedLessons / lessons.length) * 100
    : 0;

  // Find next lesson to continue
  const nextLesson = lessons.find(
    l => l.is_unlocked && l.status !== 'completed'
  );

  return (
    <AppLayout>
      <Head title={module.name} />

      {/* ── Back ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-[#6fb89d] hover:text-[#5da88d] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Modul
        </Link>
      </motion.div>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[280px]">

          {/* Background: thumbnail or gradient fallback */}
          {module.thumbnail_path ? (
            <img
              src={`/${module.thumbnail_path}`}
              alt={module.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradientClass}`} />
          )}

          {/* Left-to-right dark overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

          {/* Optional: subtle dot pattern over overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none select-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          {/* Content */}
          <div className="relative z-10 p-7 sm:p-10 flex flex-col justify-end h-full min-h-[220px] sm:min-h-[280px]">
            {/* Level badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full mb-3 w-fit">
              {meta.emoji} {meta.label}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">
              {module.name}
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-lg drop-shadow">
              {module.description}
            </p>

            {/* CTA */}
            {nextLesson && (
              <Link href={`/lessons/${nextLesson.id}`} className="inline-block mt-5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-[#6fb89d] font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {completedLessons > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookOpen} iconClass="text-[#6fb89d]" label="Total Pelajaran" value={lessons.length} delay={0.05} />
        <StatCard icon={CheckCircle2} iconClass="text-[#6fb89d]" label="Selesai" value={`${completedLessons}/${lessons.length}`} delay={0.1} />
        <StatCard icon={Zap} iconClass="text-yellow-500" label="Progress" value={`${Math.round(progressPercentage)}%`} delay={0.15} />
      </div>

      {/* ── Overall Progress Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-[#6fb89d]/20 dark:border-[#6fb89d]/15 rounded-2xl p-5 mb-8"
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Progress Modul</span>
          <span className="text-[#6fb89d] font-semibold">{completedLessons} dari {lessons.length} selesai</span>
        </div>
        <ProgressBar value={progressPercentage} delay={0.3} />
      </motion.div>

      {/* ── Lessons List ── */}
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-bold text-slate-900 dark:text-white mb-4"
        >
          Daftar Pelajaran
          <span className="ml-2 text-sm font-normal text-slate-400">({lessons.length})</span>
        </motion.h2>

        {lessons.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-[#6fb89d]/20 rounded-2xl p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Belum ada pelajaran dalam modul ini.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {lessons.map((lesson, i) => (
              <LessonRow key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Info Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-[#f8f3e1] dark:bg-[#6fb89d]/5 border border-[#6fb89d]/20 dark:border-[#6fb89d]/15 rounded-2xl p-5">
          <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2">
            <LockOpen className="w-4 h-4 text-[#6fb89d]" />
            Cara Membuka Pelajaran
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#6fb89d] mt-0.5 shrink-0" /> Pelajaran pertama otomatis terbuka saat bergabung.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#6fb89d] mt-0.5 shrink-0" /> Pelajaran berikutnya terbuka setelah menyelesaikan yang sebelumnya.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#6fb89d] mt-0.5 shrink-0" /> Terus belajar untuk membuka seluruh kurikulum!</li>
          </ul>
        </div>

        <div className="bg-[#f8f3e1] dark:bg-[#6fb89d]/5 border border-[#6fb89d]/20 dark:border-[#6fb89d]/15 rounded-2xl p-5">
          <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Tips Belajar
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2"><span className="shrink-0">💡</span> Pelajari setiap pelajaran dengan seksama untuk hasil maksimal.</li>
            <li className="flex items-start gap-2"><span className="shrink-0">🎯</span> Targetkan skor tinggi untuk mendapatkan bonus XP.</li>
            <li className="flex items-start gap-2"><span className="shrink-0">🔥</span> Belajar konsisten setiap hari untuk pertahankan streak!</li>
          </ul>
        </div>
      </motion.div>
    </AppLayout>
  );
}