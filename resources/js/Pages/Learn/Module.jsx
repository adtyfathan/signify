import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Lock, LockOpen, CheckCircle2, Clock, Zap, ArrowLeft, Play } from 'lucide-react';

export default function ModuleDetail() {
  const { module, lessons = [] } = usePage().props;

  // Get level icon and color
  const getLevelIcon = (level) => {
    const icons = {
      'Beginner': '👋',
      'Intermediate': '💬',
      'Advanced': '🎓',
    };
    return icons[level] || '📚';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'from-blue-400 to-blue-600',
      'Intermediate': 'from-orange-400 to-orange-600',
      'Advanced': 'from-red-400 to-red-600',
    };
    return colors[level] || 'from-slate-400 to-slate-600';
  };

  const getDifficultyBadgeColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Get lesson status icon and color
  const getLessonStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'unlocked':
        return <LockOpen className="w-5 h-5 text-yellow-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-slate-400" />;
      default:
        return null;
    }
  };

  const getLessonStatusLabel = (status) => {
    const labels = {
      'completed': 'Selesai',
      'in_progress': 'Sedang Dikerjakan',
      'unlocked': 'Siap Belajar',
      'locked': 'Terkunci',
    };
    return labels[status] || status;
  };

  const getLessonStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900';
      case 'in_progress':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900';
      case 'unlocked':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900';
      case 'locked':
        return 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800';
      default:
        return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700';
    }
  };

  // Calculate module progress
  const completedLessons = lessons.filter((l) => l.status === 'completed').length;
  const unlockedLessons = lessons.filter((l) => ['unlocked', 'in_progress', 'completed'].includes(l.status)).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <AppLayout>
      <Head title={module.name} />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link href="/modules" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Modul
        </Link>
      </motion.div>

      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className={`bg-gradient-to-br ${getLevelColor(module.level?.name)} overflow-hidden`}>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white">
                    {module.name}
                  </h1>
                </div>
                <p className="text-white/90 text-lg max-w-2xl">
                  {module.description}
                </p>
              </div>
              <div className="text-5xl ml-4">{getLevelIcon(module.level?.name)}</div>
            </div>

            {/* Module Level Badge */}
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm`}>
                {module.level?.name}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Pelajaran</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {lessons.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Selesai</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {completedLessons}/{lessons.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Progress Modul
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {completedLessons} dari {lessons.length} selesai
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lessons List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Daftar Pelajaran
        </h2>

        {lessons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Belum ada pelajaran dalam modul ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson, idx) => (
            <motion.div key={lesson.id} variants={itemVariants}>
              <Card className={`border-2 transition-all ${getLessonStatusColor(lesson.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Lesson Icon */}
                    <div className="flex-shrink-0 pt-1">
                      {lesson.is_unlocked ? (
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {idx + 1}. {lesson.title}
                        </h3>
                        {getLessonStatusIcon(lesson.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        {/* Lesson Type */}
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <span>📋 {lesson.type}</span>
                        </div>

                        {/* XP Reward */}
                        {lesson.xp_reward > 0 && (
                          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                            <Zap className="w-4 h-4" />
                            +{lesson.xp_reward} XP
                          </div>
                        )}

                        {/* Status Label */}
                        <div className="flex items-center gap-1">
                          <span className={`px-3 py-0.5 rounded-full text-xs font-semibold
                            ${lesson.status === 'completed' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${lesson.status === 'in_progress' ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            ${lesson.status === 'unlocked' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                            ${lesson.status === 'locked' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : ''}
                          `}>
                            {getLessonStatusLabel(lesson.status)}
                          </span>
                        </div>
                      </div>

                      {/* Best Score */}
                      {lesson.status === 'completed' && lesson.best_score !== null && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Skor Terbaik: <span className="font-semibold text-slate-900 dark:text-white">{lesson.best_score}%</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {lesson.is_unlocked ? (
                      <Link href={`/lessons/${lesson.id}`} className="flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <Play className="w-4 h-4" />
                          Mulai
                        </motion.button>
                      </Link>
                    ) : (
                      <div className="flex-shrink-0">
                        <button
                          disabled
                          className="bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 font-semibold px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                          <Lock className="w-4 h-4" />
                          Terkunci
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bagaimana Cara Membuka Pelajaran?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>
              ✅ Pelajaran pertama otomatis terbuka saat Anda bergabung.
            </p>
            <p>
              ✅ Pelajaran berikutnya akan terbuka setelah Anda menyelesaikan pelajaran sebelumnya dengan nilai minimum yang diperlukan.
            </p>
            <p>
              ✅ Lanjutkan belajar untuk membuka seluruh kurikulum terstruktur kami!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips Belajar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>
              💡 Pelajari setiap pelajaran dengan seksama untuk hasil maksimal.
            </p>
            <p>
              🎯 Targetkan skor tinggi untuk mendapatkan bonus XP.
            </p>
            <p>
              🔥 Pertahankan semangat Anda dengan belajar secara konsisten setiap hari!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
