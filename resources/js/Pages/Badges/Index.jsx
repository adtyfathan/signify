import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard, AnimatedContainer } from '@/components/ui/animated';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Lock, CheckCircle, Trophy, Flame, BookOpen } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function BadgesIndex() {
  const { allBadges = [] } = usePage().props;
  const [selectedRarity, setSelectedRarity] = useState('all');

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'uncommon':
        return 'from-green-400 to-green-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const getRarityLabel = (rarity) => {
    const labels = {
      common: { id: 'common', label: 'Common', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      uncommon: { id: 'uncommon', label: 'Uncommon', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      rare: { id: 'rare', label: 'Rare', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      epic: { id: 'epic', label: 'Epic', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      legendary: { id: 'legendary', label: 'Legendary', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    };
    return labels[rarity?.toLowerCase()] || labels.common;
  };

  const filteredBadges = useMemo(() => {
    if (selectedRarity === 'all') {
      return allBadges;
    } else if (selectedRarity === 'earned') {
      return allBadges.filter((b) => b.earned_at);
    } else {
      return allBadges.filter((b) => b.rarity?.toLowerCase() === selectedRarity?.toLowerCase());
    }
  }, [selectedRarity, allBadges]);

  const earnedCount = allBadges.filter((b) => b.earned_at).length;
  const totalCount = allBadges.length;
  const completionPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AppLayout>
      <Head title="Badges" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Koleksi Badge
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Raih badge dan tunjukkan pencapaian Anda kepada komunitas
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
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Badge Terkumpul
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-yellow-600">{earnedCount}</p>
                  <p className="text-sm text-slate-500">/ {totalCount}</p>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Completion
                </p>
                <p className="text-3xl font-bold text-blue-600">{completionPercentage}%</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Total XP Bonus
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {allBadges.filter((b) => b.earned).reduce((sum, b) => sum + b.xp_bonus, 0)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Tabs value={selectedRarity} onValueChange={setSelectedRarity}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="earned">Terkumpul</TabsTrigger>
            <TabsTrigger value="common">Common</TabsTrigger>
            <TabsTrigger value="uncommon">Uncommon</TabsTrigger>
            <TabsTrigger value="rare">Rare</TabsTrigger>
            <TabsTrigger value="epic">Epic</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
      >
        {filteredBadges && filteredBadges.length > 0 ? (
          filteredBadges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ scale: badge.earned_at ? 1.05 : 1.02 }}
              className="group cursor-pointer"
            >
              <Card
                className={`h-full overflow-hidden transition-all ${
                  badge.earned_at
                    ? 'border-2 border-yellow-400 dark:border-yellow-600'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} h-2`} />

                <CardContent className="p-4 flex flex-col items-center text-center h-full">
                  {/* Badge Icon */}
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {badge.earned_at ? (
                      <img 
                        src={badge.icon_path} 
                        alt={badge.name} 
                        className="w-12 h-12"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    {!badge.earned_at && (
                      <Lock className="w-12 h-12 text-slate-400" />
                    )}
                  </div>

                  {/* Badge Name */}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {badge.name}
                  </h3>

                  {/* Rarity Badge */}
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold mb-2 ${
                      getRarityLabel(badge.rarity).color
                    }`}
                  >
                    {getRarityLabel(badge.rarity).label}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* XP Bonus */}
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold mb-2 ${
                      badge.earned_at
                        ? 'text-yellow-600'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    +{badge.xp_bonus || 0} XP
                  </div>

                  {/* Earned Status */}
                  {badge.earned_at && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="mt-auto pt-2"
                    >
                      <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Terkumpul
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(badge.earned_at).toLocaleDateString('id-ID')}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : null}
      </motion.div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Belum ada badge dengan filter ini
          </p>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-purple-50 dark:bg-purple-950 rounded-xl p-6 border border-purple-200 dark:border-purple-900"
      >
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          Cara Mengumpulkan Badge
        </h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex gap-2">
            <span className="font-semibold">Rarity Levels:</span>
            <span>Common (Umum) ➜ Uncommon ➜ Rare ➜ Epic ➜ Legendary (Paling Langka)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600">•</span>
            <span>Selesaikan tantangan dan kondisi tertentu untuk membuka badge</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600">•</span>
            <span>Badge Legendary memerlukan dedikasi jangka panjang dan prestasi tinggi</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600">•</span>
            <span>XP bonus dari badge menambah total XP Anda untuk ranking</span>
          </li>
        </ul>
      </motion.div>
    </AppLayout>
  );
}
