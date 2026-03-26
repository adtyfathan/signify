import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { AnimatedCard, AnimatedContainer } from '@/Components/ui/animated';
import { Users, Radio, Clock, Zap, MapPin, Flame, LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MatchIndex() {
  const { auth } = usePage().props;
  const [matchStatus, setMatchStatus] = useState('idle'); // idle, searching, found, connecting, active
  const [searchTime, setSearchTime] = useState(0);
  const [matchMakingProgress, setMatchMakingProgress] = useState(0);

  // Mock data - akan diganti dengan data dari backend
  const onlineUsers = [
    { id: 1, name: 'Siti Nurhaliza', avatar: '👩', level: 11, location: 'Jakarta', status: 'online', streak: 18 },
    { id: 2, name: 'Devina Pertiwi', avatar: '👩', level: 10, location: 'Bandung', status: 'online', streak: 12 },
    { id: 3, name: 'Nadia Kusuma', avatar: '👩', level: 9, location: 'Surabaya', status: 'online', streak: 8 },
    { id: 4, name: 'Ricky Gunawan', avatar: '👨', level: 12, location: 'Medan', status: 'online', streak: 25 },
    { id: 5, name: 'Budi Santoso', avatar: '👨', level: 13, location: 'Yogyakarta', status: 'online', streak: 30 },
  ];

  const matchStats = {
    totalMatches: 45,
    matchesWon: 35,
    winRate: 77.8,
    currentStreak: 5,
    longestStreak: 12,
    averageMatchDuration: 8.5,
  };

  const recentMatches = [
    { id: 1, opponent: 'Siti Nurhaliza', result: 'win', duration: 12, xpGained: 150, date: '2024-02-20' },
    { id: 2, opponent: 'Ricky Gunawan', result: 'loss', duration: 10, xpGained: 75, date: '2024-02-20' },
    { id: 3, opponent: 'Devina Pertiwi', result: 'win', duration: 9, xpGained: 125, date: '2024-02-19' },
    { id: 4, opponent: 'Nadia Kusuma', result: 'win', duration: 11, xpGained: 140, date: '2024-02-19' },
  ];

  // Simulate search progress
  useEffect(() => {
    if (matchStatus === 'searching' && searchTime < 100) {
      const timer = setTimeout(() => {
        setSearchTime((prev) => prev + Math.random() * 30);
        if (searchTime > 80) {
          setMatchStatus('found');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (matchStatus === 'connecting') {
      const timer = setTimeout(() => {
        setMatchMakingProgress((prev) => {
          if (prev >= 100) {
            setMatchStatus('active');
            return 100;
          }
          return prev + Math.random() * 25;
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [matchStatus, searchTime, matchMakingProgress]);

  const handleStartSearch = () => {
    setMatchStatus('searching');
    setSearchTime(0);
  };

  const handleCancelSearch = () => {
    setMatchStatus('idle');
    setSearchTime(0);
  };

  const handleAcceptMatch = () => {
    setMatchStatus('connecting');
    setMatchMakingProgress(0);
  };

  const handleRejectMatch = () => {
    setMatchStatus('searching');
    setSearchTime(80);
  };

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
      <Head title="Matchmaking" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Praktik Langsung (Match)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Bertemu dan berkomunikasi dengan pengguna lain menggunakan Bahasa Isyarat
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Matchmaking Section */}
        <div className="lg:col-span-2">
          {matchStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white text-center">
                  <Radio className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Siap untuk Praktik?</h2>
                  <p className="text-blue-100">
                    Temukan mitra sekarang dan mulai praktik percakapan langsung
                  </p>
                </div>

                <CardContent className="p-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors mb-4"
                  >
                    Cari Mitra Sekarang
                  </motion.button>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Kamu akan dicocokkan dengan pengguna lain yang memiliki level serupa
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {matchStatus === 'searching' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <LoaderCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Mencari Mitra...
                  </h2>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Math.round(searchTime)}%
                      </span>
                    </div>
                    <Progress value={Math.min(searchTime, 100)} className="h-3" />
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Tunggu sebentar. Kami sedang mencari mitra yang cocok untuk kamu...
                  </p>

                  <Button
                    onClick={handleCancelSearch}
                    variant="outline"
                    size="lg"
                  >
                    Batalkan Pencarian
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {matchStatus === 'found' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border-2 border-green-400">
                <div className="bg-green-500 p-6 text-white text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    ✓
                  </motion.div>
                  <h2 className="text-2xl font-bold">Mitra Ditemukan!</h2>
                </div>

                <CardContent className="p-8">
                  {/* Opponent Card */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-xl text-center">
                    <div className="text-6xl mb-3">👩</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      Siti Nurhaliza
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">Level 11 • Jakarta</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Win Rate</p>
                        <p className="font-bold text-blue-600">72%</p>
                      </div>
                      <div className="w-px h-8 bg-slate-300" />
                      <div>
                        <p className="text-slate-500">Current Streak</p>
                        <p className="font-bold flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          18
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                    Apakah kamu ingin bermain dengan pemain ini?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleRejectMatch}
                      variant="outline"
                      size="lg"
                    >
                      Cari Lagi
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAcceptMatch}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Terima & Lanjut
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {matchStatus === 'connecting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Radio className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Menghubungkan...
                  </h2>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Setup Koneksi</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {Math.round(matchMakingProgress)}%
                      </span>
                    </div>
                    <Progress value={matchMakingProgress} className="h-3" />
                  </div>

                  <p className="text-slate-600 dark:text-slate-400">
                    Mempersiapkan video call dengan Siti Nurhaliza...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {matchStatus === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="bg-black rounded-lg mb-6 aspect-video flex items-center justify-center">
                    <p className="text-white">Video Call Interface (WebRTC Integration - Phase 4)</p>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Sedang Bermain dengan Siti Nurhaliza
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Akhiri
                    </Button>
                    <Button
                      variant="outline"
                      className="text-yellow-600 hover:bg-yellow-50"
                    >
                      Laporkan
                    </Button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Durasi match akan mempengaruhi XP gain. Bermainlah dengan adil!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Match</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Matches</span>
                    <span className="font-bold">{matchStats.totalMatches}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Matches Won</span>
                    <span className="font-bold text-green-600">{matchStats.matchesWon}</span>
                  </div>
                </div>
                <div className="border-t dark:border-slate-700 pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Win Rate</span>
                    <span className="font-bold text-blue-600">{matchStats.winRate}%</span>
                  </div>
                  <Progress value={matchStats.winRate} className="h-2 mt-2" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Current Streak</p>
                    <p className="font-bold text-orange-600">{matchStats.currentStreak} wins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Online Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Radio className="w-4 h-4 text-green-600" />
                  Online Now ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {onlineUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
                  >
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        L{user.level}
                      </span>
                      {user.streak > 0 && (
                        <span className="text-xs flex items-center gap-1 text-orange-600 font-bold">
                          <Flame className="w-2 h-2" /> {user.streak}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Your latest match history</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-3"
            >
              {recentMatches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  variants={itemVariants}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {match.opponent}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {match.duration} mins • {new Date(match.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        match.result === 'win'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }
                    >
                      {match.result === 'win' ? 'Win' : 'Loss'}
                    </Badge>
                    <p className="text-sm font-bold text-yellow-600 mt-1 flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3" />
                      +{match.xpGained}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
