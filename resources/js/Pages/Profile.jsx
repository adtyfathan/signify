import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import {
  Zap, Flame, BookOpen, Target, Edit2, Save, X,
  Trophy, BarChart3, Camera, AlertTriangle, Check,
  ChevronRight, Lock
} from 'lucide-react';
import { useState, useRef } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// Rarity config (mirror dari Badges page)
const RARITY_CONFIG = {
  common: { emoji: '🎖️', gradient: 'from-slate-400 to-slate-500' },
  uncommon: { emoji: '🌿', gradient: 'from-emerald-400 to-teal-500' },
  rare: { emoji: '💎', gradient: 'from-blue-400 to-indigo-500' },
  epic: { emoji: '⚡', gradient: 'from-violet-500 to-purple-600' },
  legendary: { emoji: '👑', gradient: 'from-amber-400 via-orange-400 to-yellow-400' },
};
const getRarity = (key) => RARITY_CONFIG[key?.toLowerCase()] ?? RARITY_CONFIG.common;

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-[#f8f3e1] dark:bg-slate-800 rounded-2xl p-4 flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-xl font-bold text-slate-800 dark:text-white leading-none">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <div className="relative group cursor-pointer shrink-0" onClick={() => fileRef.current?.click()}>
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6fb89d] to-[#5aa489] flex items-center justify-center">
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
          <p className="text-xs text-slate-400">Klik untuk ubah · JPEG, PNG, maks 2MB</p>
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
          className="w-full px-3 py-2.5 rounded-xl border border-[#6fb89d]/30 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6fb89d]/40 transition"
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
            className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#6fb89d]/30 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6fb89d]/40 transition"
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
          className="w-full px-3 py-2.5 rounded-xl border border-[#6fb89d]/30 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6fb89d]/40 transition resize-none"
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
          className="flex-1 flex items-center justify-center gap-2 bg-[#6fb89d] hover:bg-[#5aa489] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {processing
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save className="w-4 h-4" />
          }
          Simpan Perubahan
        </button>
        <button
          type="button"
          onClick={() => { reset(); onCancel(); }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-[#f8f3e1] dark:hover:bg-slate-800 transition-colors text-sm font-medium"
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
    <div className="border border-red-200 dark:border-red-900/50 rounded-2xl p-5 bg-white dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
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
            <div className="space-y-3">
              <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                placeholder="Masukkan password untuk konfirmasi"
                className="w-full px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative py-3 px-1 text-xs font-semibold transition-colors whitespace-nowrap
        ${active
          ? 'text-[#6fb89d]'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6fb89d] rounded-full"
        />
      )}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserProfile() {
  const { auth, user, stats, recentBadges, levelProgresses } = usePage().props;
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [activeTab, setActiveTab] = useState('Statistik');

  const currentUser = user || auth?.user;
  const userStats = stats ?? {};

  const xpToNextLevel = 100 * (userStats.current_level || 1);
  const xpRemainder = (userStats.total_xp || 0) % xpToNextLevel;
  const progressPct = Math.min((xpRemainder / xpToNextLevel) * 100, 100);
  const xpNeeded = xpToNextLevel - xpRemainder;

  const handleSaved = () => {
    setIsEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const tabs = ['Statistik', 'Badge', 'Progress Level'];

  return (
    <AppLayout>
      <Head title="Profil" />

      {/* Saved flash */}
      <AnimatePresence>
        {savedFlash && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#6fb89d] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg"
          >
            <Check className="w-4 h-4" /> Profil berhasil disimpan
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10 rounded-2xl overflow-hidden"
        >
          {/* Green accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6fb89d] to-[#f8d95e]" />

          <div className="p-6">
            {/* Avatar + name */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6fb89d] to-[#5aa489] flex items-center justify-center shrink-0 shadow-md shadow-[#6fb89d]/20">
                    {currentUser?.avatar_path
                      ? <img src={currentUser.avatar_path} className="w-full h-full object-cover" alt="avatar" />
                      : <span className="text-white text-xl font-bold">{getInitials(currentUser?.name)}</span>
                    }
                  </div>
                  {/* Level badge */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#f8d95e] border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <span className="text-[9px] font-black text-amber-700">{userStats.current_level ?? 1}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                    {currentUser?.name}
                  </h1>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    @{currentUser?.username}
                  </p>
                  {currentUser?.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      {currentUser.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setIsEditing(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0
                  ${isEditing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-[#6fb89d]/10 hover:bg-[#6fb89d]/20 text-[#6fb89d]'
                  }`}
              >
                {isEditing
                  ? <><X className="w-3.5 h-3.5" /> Batal</>
                  : <><Edit2 className="w-3.5 h-3.5" /> Edit</>
                }
              </button>
            </div>

            {/* Edit form */}
            <AnimatePresence mode="wait">
              {isEditing && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#6fb89d]/10 dark:border-slate-800 pt-5">
                    <EditProfileForm
                      user={currentUser}
                      onCancel={() => setIsEditing(false)}
                      onSuccess={handleSaved}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick stat cards */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-4 gap-2 mt-1"
              >
                <StatCard label="Level" value={userStats.current_level ?? 1} icon={Zap} accent="bg-[#6fb89d]" />
                <StatCard label="Streak" value={`${userStats.current_streak ?? 0}🔥`} icon={Flame} accent="bg-orange-400" />
                <StatCard label="Huruf" value={`${userStats.letters_mastered ?? 0}/26`} icon={Target} accent="bg-[#f8d95e]" />
                <StatCard label="XP" value={(userStats.total_xp ?? 0).toLocaleString()} icon={Trophy} accent="bg-amber-500" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── XP Progress ── */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#f8d95e] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Level {userStats.current_level ?? 1} → {(userStats.current_level ?? 1) + 1}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {xpRemainder.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2.5 bg-[#f8f3e1] dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6fb89d] to-[#5aa489] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Butuh <span className="font-semibold text-[#6fb89d]">{xpNeeded.toLocaleString()} XP</span> lagi untuk naik level
            </p>
          </motion.div>
        )}

        {/* ── Tabs panel ── */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-900 border border-[#6fb89d]/15 dark:border-[#6fb89d]/10 rounded-2xl overflow-hidden"
          >
            {/* Tab headers */}
            <div className="flex gap-6 px-6 border-b border-slate-100 dark:border-slate-800">
              {tabs.map(tab => (
                <TabBtn key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
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
                      { label: 'Pelajaran selesai', value: userStats.total_lessons_done ?? 0, icon: BookOpen, accent: 'bg-[#6fb89d]' },
                      { label: 'Kuis diselesaikan', value: userStats.total_quizzes_done ?? 0, icon: Target, accent: 'bg-[#6fb89d]/70' },
                      { label: 'Latihan bebas', value: userStats.total_practice_done ?? 0, icon: BarChart3, accent: 'bg-[#f8d95e]' },
                      { label: 'Huruf dikuasai', value: `${userStats.letters_mastered ?? 0}/26`, icon: Zap, accent: 'bg-amber-500' },
                    ].map(({ label, value, icon: Icon, accent }) => (
                      <div key={label} className="flex items-center gap-3 bg-[#f8f3e1] dark:bg-slate-800/50 rounded-xl p-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800 dark:text-white leading-none">{value}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
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
                          {recentBadges.map(badge => {
                            const rarity = getRarity(badge.rarity);
                            return (
                              <div key={badge.id} className="flex flex-col items-center bg-[#f8f3e1] dark:bg-slate-800/50 rounded-xl p-3.5 text-center">
                                <div className={`w-10 h-10 rounded-xl mb-2 flex items-center justify-center bg-gradient-to-br ${rarity.gradient}`}>
                                  {badge.icon_path
                                    ? <img src={badge.icon_path} alt={badge.name} className="w-6 h-6 object-contain"
                                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                    : null}
                                  <span className="text-lg leading-none" style={{ display: badge.icon_path ? 'none' : 'block' }}>
                                    {rarity.emoji}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight truncate w-full">{badge.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {new Date(badge.pivot?.earned_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        <Link
                          href="/badges"
                          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#6fb89d] hover:text-[#5aa489] transition-colors"
                        >
                          Lihat semua badge <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f3e1] dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                          <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada badge.</p>
                        <p className="text-xs text-slate-400 mt-1">Terus belajar untuk mendapatkan badge pertama!</p>
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
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{level.name}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                            ${level.progress >= 100
                              ? 'bg-[#6fb89d]/15 text-[#6fb89d]'
                              : 'bg-[#f8f3e1] dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                            {Math.round(level.progress)}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#f8f3e1] dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${level.progress >= 100 ? 'bg-[#6fb89d]' : 'bg-gradient-to-r from-[#6fb89d] to-[#f8d95e]'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(level.progress, 100)}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f3e1] dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada progress belajar.</p>
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