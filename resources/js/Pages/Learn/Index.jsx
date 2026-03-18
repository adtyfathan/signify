import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimatedCard, AnimatedContainer } from '@/components/ui/animated';
import { BookOpen, Lock, LockOpen, Zap, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';

export default function LearnIndex() {
  const { auth, modules = [] } = usePage().props;
  const [expandedModule, setExpandedModule] = useState(null);

  // Icon mapping untuk modul berdasarkan tingkat kesulitan
  const getLevelIcon = (level) => {
    const icons = {
      'Beginner': '👋',
      'Intermediate': '💬',
      'Advanced': '🎓',
    };
    return icons[level] || '📚';
  };

  // Color mapping untuk modul berdasarkan tingkat kesulitan
  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'from-blue-400 to-blue-600',
      'Intermediate': 'from-orange-400 to-orange-600',
      'Advanced': 'from-red-400 to-red-600',
    };
    return colors[level] || 'from-slate-400 to-slate-600';
  };

  const getDifficultyColor = (level) => {
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

  // Hitung stats dari modules
  const totalModules = modules.length;
  const unlockedModules = modules.filter((m) => !m.is_locked).length;
  const completedPercentage = totalModules > 0 
    ? Math.round((modules.reduce((sum, m) => sum + (m.progress || 0), 0) / totalModules)) 
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
      <Head title="Learn" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Pembelajaran Terstruktur
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Ikuti kurikulum kami yang dirancang untuk semua tingkat kemampuan
        </p>
      </motion.div>

      {/* Stats Section */}
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
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Modul</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalModules}
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
                <p className="text-sm text-slate-600 dark:text-slate-400">Terbuka</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {unlockedModules}
                </p>
              </div>
              <LockOpen className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Selesai</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedPercentage}%
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modules Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        {modules.map((module, idx) => (
          <motion.div
            key={module.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`overflow-hidden transition-all ${module.is_locked ? 'opacity-60' : ''}`}>
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${getLevelColor(module.level)} h-2`} />

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl mt-1">{getLevelIcon(module.level)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {module.name}
                        </h3>
                        {module.is_locked && (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                        {module.description}
                      </p>

                      {/* Module Stats */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-1 text-xs">
                          <span className={`px-2 py-1 rounded ${getDifficultyColor(module.level)}`}>
                            {module.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <BookOpen className="w-4 h-4" />
                          {module.lesson_count} lessons
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Progress
                          </span>
                          <span className="text-xs text-slate-500">
                            {Math.round(module.progress)}%
                          </span>
                        </div>
                        <Progress
                          value={module.progress || 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: module.is_locked ? 1 : 1.05 }}
                    whileTap={{ scale: module.is_locked ? 1 : 0.95 }}
                    disabled={module.is_locked}
                    onClick={() => window.location.href = `/modules/${module.id}`}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {module.is_locked ? 'Terkunci' : 'Belajar'}
                  </motion.button>
                </div>

                {/* Expandable Lessons Preview */}
                {!module.is_locked && (
                  <motion.button
                    onClick={() =>
                      setExpandedModule(expandedModule === module.id ? null : module.id)
                    }
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-4"
                  >
                    <span>
                      {expandedModule === module.id
                        ? 'Sembunyikan pelajaran'
                        : 'Lihat pelajaran'}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedModule === module.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                )}

                {/* Lessons List */}
                {expandedModule === module.id && !module.is_locked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                  >
                    <p className="text-xs text-slate-500 mb-2">
                      Klik "Belajar" di atas untuk mengakses pelajaran di modul ini
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Locked Module Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-8 bg-blue-50 dark:bg-blue-950 rounded-xl p-6 border border-blue-200 dark:border-blue-900"
      >
        <div className="flex gap-3">
          <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Modul Terkunci
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Modul tingkat selanjutnya akan terbuka saat Anda menyelesaikan modul sebelumnya.
              Terus belajar dan tingkatkan level Anda!
            </p>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
