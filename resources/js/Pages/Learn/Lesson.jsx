import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, ArrowRight, Zap, CheckCircle2, BookOpen, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import TheoryLesson from './TheoryLesson';
import QuizLesson from './QuizLesson';

const fallbackThumb = (type) => {
  return type === 'theory' ? '📖' : '❓';
};

export default function Lesson() {
  const { lesson, progress, prev_lesson, next_lesson } = usePage().props;
  const [isCompleted, setIsCompleted] = useState(progress.status === 'completed');

  const handleLessonComplete = () => {
    setIsCompleted(true);
    setTimeout(() => router.visit(route('modules.show', lesson.module_id)), 2000);
  };

  const isTheory = lesson.lesson_type === 'theory';
  const canGoNext = isCompleted;

  return (
    <AppLayout>
      <Head title={lesson.title} />

      {/* Breadcrumb / Back */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <Link
          href={`/modules/${lesson.module_id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium
                     text-[#6fb89d] hover:text-[#5aa389] transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Modul
        </Link>
      </motion.div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 pb-5 border-b border-[#6fb89d]/20 dark:border-[#6fb89d]/15"
      >
        {/* Type tag + level */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${isTheory
              ? 'bg-[#6fb89d]/15 text-[#4a9a7a] dark:bg-[#6fb89d]/20 dark:text-[#6fb89d]'
              : 'bg-[#f8d95e]/20 text-[#b89a00] dark:bg-[#f8d95e]/15 dark:text-[#f8d95e]'
            }`}>
            {isTheory
              ? <><BookOpen className="w-3 h-3" /> Pelajaran Teori</>
              : <><HelpCircle className="w-3 h-3" /> Kuis Interaktif</>
            }
          </span>

          {lesson.level && (
            <span className="text-xs text-slate-500 dark:text-slate-400
                             bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {lesson.level}
            </span>
          )}
        </div>

        {/* Title + completed badge */}
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight flex-1">
            {lesson.title}
          </h1>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               bg-[#6fb89d]/15 text-[#4a9a7a]
                               dark:bg-[#6fb89d]/20 dark:text-[#6fb89d]
                               text-sm font-semibold border border-[#6fb89d]/30">
                <CheckCircle2 className="w-4 h-4" />
                Selesai
              </span>
            </motion.div>
          )}
        </div>

        {/* XP reward */}
        {lesson.xp_reward > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            bg-[#f8d95e]/20 dark:bg-[#f8d95e]/10
                            border border-[#f8d95e]/40">
              <Zap className="w-3.5 h-3.5 text-[#b89a00] dark:text-[#f8d95e]" />
              <span className="text-xs font-bold text-[#b89a00] dark:text-[#f8d95e]">
                +{lesson.xp_reward} XP
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              saat menyelesaikan pelajaran ini
            </span>
          </div>
        )}
      </motion.div>

      {/* Lesson Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {isTheory
          ? <TheoryLesson lesson={lesson} onComplete={handleLessonComplete} />
          : <QuizLesson lesson={lesson} onComplete={handleLessonComplete} />
        }
      </motion.div>

      {/* ── Prev / Next Lesson Navigation ── */}
      {(prev_lesson || next_lesson) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 pt-6 border-t border-[#6fb89d]/20 dark:border-[#6fb89d]/15
                     grid grid-cols-2 gap-3"
        >
          {/* ── Previous ── */}
          <div className="col-span-1">
            {prev_lesson ? (
              <Link href={route('lessons.show', prev_lesson.id)} className="group block h-full">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 h-full rounded-xl
                                border border-slate-200 dark:border-slate-700
                                bg-white dark:bg-slate-900
                                hover:border-[#6fb89d]/50 hover:bg-[#f8f3e1]
                                dark:hover:border-[#6fb89d]/40 dark:hover:bg-slate-800
                                transition-all duration-200">

                  {/* Arrow icon */}
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                                  bg-slate-100 dark:bg-slate-800
                                  group-hover:bg-[#6fb89d]/15 dark:group-hover:bg-[#6fb89d]/20
                                  flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#6fb89d] transition-colors" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider
                                  text-slate-400 dark:text-slate-500 mb-0.5">
                      Sebelumnya
                    </p>
                    <p className="text-xs sm:text-sm font-medium
                                  text-slate-700 dark:text-slate-300
                                  group-hover:text-[#6fb89d] transition-colors
                                  line-clamp-2 leading-snug">
                      {prev_lesson.title}
                    </p>
                  </div>

                  {/* Thumbnail — hidden on xs, visible from sm */}
                  <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-lg overflow-hidden
                                  bg-[#6fb89d]/20 items-center justify-center">
                    {prev_lesson.thumbnail ? (
                      <img
                        src={`/${prev_lesson.thumbnail}`}
                        className="w-full h-full object-cover"
                        alt={prev_lesson.title}
                      />
                    ) : (
                      <span className="text-base">📙</span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* ── Next ── */}
          <div className="col-span-1">
            {next_lesson ? (
              canGoNext ? (
                <Link href={route('lessons.show', next_lesson.id)} className="group block h-full">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 h-full rounded-xl
                                  border border-slate-200 dark:border-slate-700
                                  bg-white dark:bg-slate-900
                                  hover:border-[#6fb89d]/50 hover:bg-[#f8f3e1]
                                  dark:hover:border-[#6fb89d]/40 dark:hover:bg-slate-800
                                  transition-all duration-200">

                    {/* Thumbnail — hidden on xs, visible from sm */}
                    <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-lg overflow-hidden
                                    bg-[#6fb89d]/20 items-center justify-center">
                      {next_lesson.thumbnail ? (
                        <img
                          src={`/${next_lesson.thumbnail}`}
                          className="w-full h-full object-cover"
                          alt={next_lesson.title}
                        />
                      ) : (
                        <span className="text-base">📙</span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider
                                    text-slate-400 dark:text-slate-500 mb-0.5">
                        Berikutnya
                      </p>
                      <p className="text-xs sm:text-sm font-medium
                                    text-slate-700 dark:text-slate-300
                                    group-hover:text-[#6fb89d] transition-colors
                                    line-clamp-2 leading-snug">
                        {next_lesson.title}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                                    bg-[#6fb89d]/10 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-[#6fb89d]" />
                    </div>
                  </div>
                </Link>
              ) : (
                /* Locked next lesson */
                <div className="block cursor-not-allowed h-full">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 h-full rounded-xl
                                  border border-slate-200 dark:border-slate-700
                                  bg-slate-100 dark:bg-slate-800 opacity-50
                                  transition-all duration-200">

                    {/* Thumbnail — hidden on xs */}
                    <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-lg overflow-hidden
                                    bg-[#6fb89d]/20 items-center justify-center">
                      {next_lesson.thumbnail ? (
                        <img
                          src={`/${next_lesson.thumbnail}`}
                          className="w-full h-full object-cover opacity-60"
                          alt={next_lesson.title}
                        />
                      ) : (
                        <span className="text-base">📙</span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider
                                    text-slate-400 dark:text-slate-500 mb-0.5">
                        Berikutnya
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-400
                                    line-clamp-2 leading-snug">
                        {next_lesson.title}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                                    bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}