import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedContainer } from '@/components/ui/animated';
import { Search, BookOpen, Zap } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function DictionaryIndex() {
  const { signs = [] } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categorize signs
  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'vowels', label: 'Vokal' },
    { id: 'consonants', label: 'Konsonan' },
  ];

  const filteredItems = useMemo(() => {
    return (signs || []).filter((item) => {
      const matchesSearch = item.letter.toLowerCase().includes(searchQuery.toLowerCase());
      const isSVowel = item.is_vowel; 
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'vowels' && isSVowel) ||
        (selectedCategory === 'consonants' && !isSVowel);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, signs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const getMasteryColor = (mastery) => {
    switch (mastery) {
      case 'mastered':
        return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100';
      case 'practiced':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100';
      case 'learning':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100';
    }
  };

  return (
    <AppLayout>
      <Head title="Dictionary" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Kamus Bahasa Isyarat
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Pelajari huruf A-Z dalam Bahasa Isyarat Indonesia dan pantau penguasaan Anda
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari huruf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900"
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Menampilkan <span className="font-bold text-blue-600">{filteredItems.length}</span> dari{' '}
          <span className="font-bold text-blue-600">{signs?.length || 0}</span> huruf
        </p>
      </motion.div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          {filteredItems.map((item, idx) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link href={`/dictionary/${item.id}`} className="block h-full">
                <motion.div
                  whileHover={{ scale: 1.08, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group cursor-pointer h-full"
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Mastery Color Bar */}
                    <div className={`h-1 ${getMasteryColor(item.mastery_level)}`} />

                    <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[120px]">
                      {/* Large Letter Display */}
                      <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform">
                        {item.letter}
                      </div>

                      {/* Difficulty */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold text-center mb-2">
                        {item.difficulty === 'easy' ? 'Mudah' : item.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                      </p>

                      {/* Mastery Badge */}
                      <div className={`mt-3 px-2 py-1 rounded text-xs font-medium ${getMasteryColor(item.mastery_level)}`}>
                        {item.mastery_level === 'mastered' && '✓ Dikuasai'}
                        {item.mastery_level === 'practiced' && '◐ Dipraktik'}
                        {item.mastery_level === 'learning' && '◑ Belajar'}
                        {item.mastery_level === 'not_started' && '○ Belum'}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
            Tidak ada hasil ditemukan
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            variant="outline"
          >
            Reset Filter
          </Button>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-blue-50 dark:bg-blue-950 rounded-xl p-6 border border-blue-200 dark:border-blue-900"
      >
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Cara Menggunakan Kamus
        </h3>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Klik pada setiap item untuk melihat video demonstrasi gerakan</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Kategori berwarna memudahkan Anda menemukan jenis isyarat yang dicari</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Kumpulkan XP setiap kali Anda menguasai gerakan baru</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Gunakan fitur pencarian untuk menemukan isyarat tertentu dengan cepat</span>
          </li>
        </ul>
      </motion.div>
    </AppLayout>
  );
}
