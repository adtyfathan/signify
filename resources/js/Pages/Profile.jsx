import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Progress } from '@/components/ui/progress';
import {
  Zap, Flame, BookOpen, Target, Edit2, Save, X,
  Trophy, BarChart3, Camera, AlertTriangle, Check,
  ChevronRight, User
} from 'lucide-react';
import { useState, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function StatPill({ label, value, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    green: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  };
  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl ${colors[color]}`}>
      {Icon && <Icon className="w-4 h-4 opacity-70" />}
      <span className="text-2xl font-bold leading-tight">{value}</span>
      <span className="text-[11px] font-medium opacity-70 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────

function EditProfileForm({ user, onCancel, onSuccess }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: user?.name ?? '',
    username: user?.username ?? '',
    bio: user?.bio ?? '',
    avatar: null,
    _method: 'PUT',
  });

  const fileRef = useRef(null);
  const [preview, setPreview] = useState(user?.avatar_path ?? null);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData('avatar', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kirim data profil (nama, username, bio) — _method PUT via form data
    post(route('profile.update'), {
      forceFormData: true,
      onSuccess: () => onSuccess?.(),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Avatar picker */}
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            {preview
              ? <img src={preview} className="w-full h-full object-cover" alt="avatar" />
              : <span className="text-white text-xl font-bold">{getInitials(data.name)}</span>
            }
          </div>
          <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Foto Profil</p>
          <p className="text-xs text-slate-400">Klik untuk ubah · JPEG, PNG, max 2MB</p>
          {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Nama Lengkap
        </label>
        <input
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Nama lengkap kamu"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Username */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
          <input
            type="text"
            value={data.username}
            onChange={e => setData('username', e.target.value)}
            className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="username_kamu"
          />
        </div>
        {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Bio
        </label>
        <textarea
          value={data.bio}
          onChange={e => setData('bio', e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          placeholder="Ceritakan sedikit tentang dirimu..."
        />
        <p className="text-[11px] text-slate-400 mt-1 text-right">{data.bio.length}/500</p>
        {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {processing ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Simpan Perubahan
        </button>
        <button
          type="button"
          onClick={() => { reset(); onCancel(); }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          Batal
        </button>
      </div>
    </motion.form>
  );
}

// ─── Delete Account Section ───────────────────────────────────────────────────

function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const { data, setData, delete: destroy, processing, errors } = useForm({ password: '' });

  const handleDelete = (e) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      onSuccess: () => router.visit('/'),
    });
  };

  return (
    <div className="border border-red-200 dark:border-red-900/50 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Hapus Akun</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Tindakan ini permanen dan tidak bisa dibatalkan. Semua data progress, XP, dan badge akan hilang.
          </p>
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Hapus akun saya
            </button>
          ) : (
            <form onSubmit={handleDelete} className="space-y-3">
              <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                placeholder="Masukkan password untuk konfirmasi"
                className="w-full px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                >
                  Hapus Akun Permanen
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main UserProfile ─────────────────────────────────────────────────────────

export default function UserProfile() {
  const { auth, user, stats, recentBadges, levelProgresses } = usePage().props;
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const currentUser = user || auth?.user;
  const userStats = stats ?? {};

  const xpToNextLevel = 100 * (userStats.current_level || 1);
  const xpRemainder = (userStats.total_xp || 0) % xpToNextLevel;
  const progressPct = (xpRemainder / xpToNextLevel) * 100;
  const xpNeeded = xpToNextLevel - xpRemainder;

  const handleSaved = () => {
    setIsEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const tabs = ['Statistik', 'Badge', 'Progress Level'];
  const [activeTab, setActiveTab] = useState('Statistik');

  return (
    <AppLayout>
      <Head title="Profil" />

      {/* ── Saved flash ── */}
      <AnimatePresence>
        {savedFlash && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg"
          >
            <Check className="w-4 h-4" /> Profil berhasil disimpan
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl"
        >
          <div className="p-5">
            {/* Avatar + name row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                  {currentUser?.avatar_path
                    ? <img src={currentUser.avatar_path} className="w-full h-full object-cover" alt="avatar" />
                    : <span className="text-white text-lg font-bold">{getInitials(currentUser?.name)}</span>
                  }
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser?.name}
                  </h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    @{currentUser?.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${isEditing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isEditing ? <><X className="w-3.5 h-3.5" /> Batal</> : <><Edit2 className="w-3.5 h-3.5" /> Edit Profil</>}
              </button>
            </div>

            {/* Bio + stats — or edit form */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <EditProfileForm
                  key="edit"
                  user={currentUser}
                  onCancel={() => setIsEditing(false)}
                  onSuccess={handleSaved}
                />
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {currentUser?.bio || <span className="italic opacity-50">Belum ada bio.</span>}
                  </p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-4 gap-2">
                    <StatPill label="Level" value={userStats.current_level ?? 1} color="blue" icon={Zap} />
                    <StatPill label="Streak" value={userStats.current_streak ?? 0} color="red" icon={Flame} />
                    <StatPill label="Huruf" value={`${userStats.letters_mastered ?? 0}/26`} color="yellow" icon={Target} />
                    <StatPill label="Total XP" value={(userStats.total_xp ?? 0).toLocaleString()} color="green" icon={Trophy} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── XP Progress ── */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Level {userStats.current_level ?? 1} → {(userStats.current_level ?? 1) + 1}
                </span>
              </div>
              <span className="text-xs text-slate-400">{xpRemainder} / {xpToNextLevel} XP</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Butuh <span className="font-semibold text-blue-600 dark:text-blue-400">{xpNeeded} XP</span> lagi untuk naik level
            </p>
          </motion.div>
        )}

        {/* ── Tabs ── */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
          >
            {/* Tab headers */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">

                {/* Statistik */}
                {activeTab === 'Statistik' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { label: 'Pelajaran selesai', value: userStats.total_lessons_done ?? 0, icon: BookOpen, color: 'text-blue-500' },
                      { label: 'Kuis diselesaikan', value: userStats.total_quizzes_done ?? 0, icon: Target, color: 'text-indigo-500' },
                      { label: 'Latihan bebas', value: userStats.total_practice_done ?? 0, icon: BarChart3, color: 'text-purple-500' },
                      { label: 'Huruf dikuasai', value: `${userStats.letters_mastered ?? 0}/26`, icon: Zap, color: 'text-yellow-500' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                        <div className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm shrink-0`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{value}</p>
                          <p className="text-[11px] text-slate-400 leading-tight">{label}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Badge */}
                {activeTab === 'Badge' && (
                  <motion.div
                    key="badges"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    {recentBadges?.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {recentBadges.map(badge => (
                            <div key={badge.id} className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                              <span className="text-3xl mb-1">🏆</span>
                              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate w-full text-center">{badge.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(badge.pivot?.earned_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Link href="/badges" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                          Lihat semua badge <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <Trophy className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Belum ada badge. Terus belajar!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Progress Level */}
                {activeTab === 'Progress Level' && (
                  <motion.div
                    key="levels"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {levelProgresses?.length > 0 ? levelProgresses.map((level, i) => (
                      <div key={level.level_id}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{level.name}</span>
                          <span className="text-xs font-semibold text-slate-500">{Math.round(level.progress)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${level.progress}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Belum ada progress belajar.</p>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Danger zone ── */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <DeleteAccountSection />
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}