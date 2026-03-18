import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import TheoryLesson from './TheoryLesson';
import QuizLesson from './QuizLesson';

export default function Lesson() {
  const { lesson, progress } = usePage().props;
  const [isCompleted, setIsCompleted] = useState(progress.status === 'completed');

  const handleLessonComplete = () => {
    setIsCompleted(true);
    setTimeout(() => router.visit(route('modules.show', lesson.module_id)), 2000);
  };

  return (
    <AppLayout>
      <Head title={lesson.title} />

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          href={`/modules/${lesson.module_id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Modul
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
          {isCompleted && <CheckCircle2 className="w-8 h-8 text-green-600" />}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span>{lesson.level}</span>
          <span>•</span>
          <span>{lesson.lesson_type === 'theory' ? '📖 Pelajaran Teori' : '🎯 Kuis Interaktif'}</span>
          {lesson.xp_reward > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                <Zap className="w-4 h-4" /> +{lesson.xp_reward} XP
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        {lesson.lesson_type === 'theory'
          ? <TheoryLesson lesson={lesson} onComplete={handleLessonComplete} />
          : <QuizLesson lesson={lesson} onComplete={handleLessonComplete} />}
      </motion.div>
    </AppLayout>
  );
}