import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePythonPredict } from '@/hooks/ai/usePythonPredict';
import Webcam from 'react-webcam';
import {
  Camera, Play, Square, Zap, History, ChevronRight,
  Loader, AlertCircle, Trash2, BookOpen, Clock
} from 'lucide-react';

const PYTHON_API_URL = '/ai';
const INFERENCE_MS = 350;
const DEBOUNCE_MS = 700;       // jeda antar huruf agar tidak double-detect
const CONFIDENCE_THRESHOLD = 75; // threshold untuk free practice (lebih ketat dari quiz)
const MAX_DISPLAY_LETTERS = 24;  // max huruf di layar sebelum auto-clear

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

// ─── Letter Bubble — huruf yang muncul satu per satu ─────────────────────────

function DetectedLetterBubble({ letter, confidence, index }) {
  const opacity = Math.min(1, 0.5 + (confidence / 100) * 0.5);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4, y: 10 }}
      animate={{ opacity, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-flex items-center justify-center w-10 h-12 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-bold text-lg relative"
      title={`${confidence.toFixed(0)}%`}
    >
      {letter}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: confidence >= 90 ? '#4ade80' : confidence >= 75 ? '#facc15' : '#f87171' }}
      />
    </motion.span>
  );
}

// ─── Recent Sessions Panel ────────────────────────────────────────────────────

function RecentSessions({ sessions, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-white/60" />
          <h3 className="text-white font-semibold">Riwayat Latihan</h3>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-sm">
          Tutup
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center text-white/30 mt-12">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Belum ada riwayat latihan</p>
          </div>
        ) : sessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-mono font-bold truncate text-sm tracking-widest">
                {session.result_text || '—'}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {session.letter_count} huruf
                </span>
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {session.duration_sec}s
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                <Zap className="w-3 h-3" /> +{session.xp_earned}
              </span>
              <span className="text-white/25 text-[10px]">{formatDate(session.created_at)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main PracticeIndex ───────────────────────────────────────────────────────

export default function PracticeIndex() {
  const { recentSessions = [] } = usePage().props;

  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [detectedLetters, setDetectedLetters] = useState([]); // [{letter, confidence, detected_at_sec}]
  const [lastFlash, setLastFlash] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('info');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectedRef = useRef(detectedLetters);
  const recordingStartRef = useRef(null);
  const renderRafRef = useRef(null);
  const lastInferenceRef = useRef(0);
  const lastSuccessRef = useRef(0);

  const { predict: predictWithPython } = usePythonPredict();

  // Keep ref in sync
  useEffect(() => { detectedRef.current = detectedLetters; }, [detectedLetters]);

  // Health check on mount
  useEffect(() => {
    (async () => {
      setIsModelLoading(true);
      try {
        const res = await fetch(`${PYTHON_API_URL}/health`);
        setFeedback(res.ok ? 'AI Server siap. Klik Mulai untuk berlatih bebas.' : 'Python API tidak tersedia.');
        setFeedbackType(res.ok ? 'info' : 'error');
      } catch {
        setFeedback('Python API tidak tersedia. Jalankan uvicorn main:app.');
        setFeedbackType('error');
      } finally {
        setIsModelLoading(false);
      }
    })();
  }, []);

  // Draw overlay — corner brackets + dim
  const drawOverlay = (ctx, w, h) => {
    const bw = w * 0.55, bh = h * 0.78;
    const x = (w - bw) / 2, y = (h - bh) / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.fillRect(0, 0, w, y);
    ctx.fillRect(0, y + bh, w, h - y - bh);
    ctx.fillRect(0, y, x, bh);
    ctx.fillRect(x + bw, y, w - x - bw, bh);

    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    [[x + 20, y, x, y, x, y + 20], [x + bw - 20, y, x + bw, y, x + bw, y + 20],
    [x, y + bh - 20, x, y + bh, x + 20, y + bh], [x + bw, y + bh - 20, x + bw, y + bh, x + bw - 20, y + bh]
    ].forEach(([x1, y1, cx, cy, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  };

  // Render loop
  useEffect(() => {
    if (!isRecording) { cancelAnimationFrame(renderRafRef.current); return; }

    const loop = () => {
      const vid = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!vid || !canvas || vid.readyState !== vid.HAVE_ENOUGH_DATA) {
        renderRafRef.current = requestAnimationFrame(loop);
        return;
      }
      if (canvas.width !== vid.videoWidth) {
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawOverlay(ctx, canvas.width, canvas.height);
      renderRafRef.current = requestAnimationFrame(loop);
    };

    renderRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(renderRafRef.current);
  }, [isRecording]);

  // Inference loop — free practice: tidak ada expectedLabel, semua huruf diterima jika confidence cukup
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(async () => {
      if (!webcamRef.current) return;

      const now = Date.now();
      if (now - lastInferenceRef.current < INFERENCE_MS) return;
      lastInferenceRef.current = now;

      // Debounce antar deteksi sukses
      if (now - lastSuccessRef.current < DEBOUNCE_MS) return;

      // Auto-clear jika terlalu panjang
      if (detectedRef.current.length >= MAX_DISPLAY_LETTERS) {
        setFeedback('Layar penuh — huruf lama dihapus otomatis.');
        setFeedbackType('info');
        setDetectedLetters([]);
        return;
      }

      try {
        // Kirim tanpa expectedLabel — Python tidak akan menghitung is_correct
        const result = await predictWithPython(webcamRef.current, null);
        if (!result) return;

        if (result.confidence >= CONFIDENCE_THRESHOLD) {
          lastSuccessRef.current = Date.now();

          const elapsedSec = ((Date.now() - recordingStartRef.current) / 1000).toFixed(1);

          setLastFlash(result.predicted_label);
          setTimeout(() => setLastFlash(null), 500);

          setFeedback(`${result.predicted_label} — ${result.confidence.toFixed(0)}% yakin`);
          setFeedbackType('success');

          setDetectedLetters(prev => [...prev, {
            letter: result.predicted_label,
            confidence: result.confidence,
            detected_at_sec: parseFloat(elapsedSec),
          }]);
        }
      } catch (err) {
        // Senyap — jangan tampilkan error per-frame
      }
    }, INFERENCE_MS);

    return () => clearInterval(interval);
  }, [isRecording, predictWithPython]);

  // Save session
  const saveSession = useCallback(async () => {
    if (detectedLetters.length === 0) return;
    setIsSaving(true);

    const durationSec = Math.max(1, Math.floor((Date.now() - recordingStartRef.current) / 1000));
    const resultText = detectedLetters.map(d => d.letter).join('');

    try {
      await axios.post(route('practice.save'), {
        result_text: resultText,
        letter_count: detectedLetters.length,
        duration_sec: durationSec,
        letters: detectedLetters.map(d => ({
          letter: d.letter,
          confidence: d.confidence > 1 ? d.confidence / 100 : d.confidence,
          detected_at_sec: d.detected_at_sec,
        })),
      });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
      setFeedback(`Tersimpan! ${detectedLetters.length} huruf • +5 XP`);
      setFeedbackType('success');
    } catch (err) {
      setFeedback('Gagal menyimpan sesi.');
      setFeedbackType('error');
    } finally {
      setIsSaving(false);
    }
  }, [detectedLetters]);

  const handleStart = () => {
    recordingStartRef.current = Date.now();
    setIsRecording(true);
    setDetectedLetters([]);
    setFeedback('Peragakan huruf apa saja di depan kamera...');
    setFeedbackType('info');
  };

  const handleStop = async () => {
    setIsRecording(false);
    if (detectedLetters.length > 0) {
      setFeedback(`Rekaman selesai — ${detectedLetters.length} huruf terdeteksi.`);
      setFeedbackType('info');
      await saveSession();
    } else {
      setFeedback('Tidak ada huruf terdeteksi. Coba lagi!');
      setFeedbackType('error');
    }
  };

  const handleClear = () => {
    setDetectedLetters([]);
    setFeedback('Huruf dihapus.');
    setFeedbackType('info');
  };

  const resultText = detectedLetters.map(d => d.letter).join('');
  const avgConfidence = detectedLetters.length > 0
    ? (detectedLetters.reduce((s, d) => s + d.confidence, 0) / detectedLetters.length).toFixed(0)
    : null;

  return (
    <AppLayout>
      <Head title="Latihan Bebas" />

      {/* Page header — di luar webcam container */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Latihan Bebas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Peragakan huruf apapun — AI akan mendeteksi dan mencatat secara otomatis.
        </p>
      </motion.div>

      {/* ── Webcam Stage ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden bg-slate-900"
        style={{ minHeight: '65vh' }}
      >
        {/* Webcam */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          mirrored
          videoConstraints={{ width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }}
          className="w-full h-full object-cover"
          style={{ minHeight: '65vh' }}
        />

        {/* Canvas overlay */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Model loading */}
        <AnimatePresence>
          {isModelLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm z-10"
            >
              <div className="text-center">
                <Loader className="w-10 h-10 text-white animate-spin mx-auto mb-3" />
                <p className="text-white/60 text-sm">Menghubungkan ke AI Server...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <RecentSessions sessions={recentSessions} onClose={() => setShowHistory(false)} />
          )}
        </AnimatePresence>

        {/* ── TOP BAR overlay ── */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 pointer-events-none">
          {/* Left: REC badge */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold pointer-events-none"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                REC
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: history + clear buttons */}
          <div className="flex gap-2 pointer-events-auto ml-auto">
            {detectedLetters.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                onClick={handleClear}
                className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-full text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </motion.button>
            )}
            <button
              onClick={() => setShowHistory(v => !v)}
              className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-full text-xs transition-colors"
            >
              <History className="w-3.5 h-3.5" /> Riwayat
            </button>
          </div>
        </div>

        {/* ── DETECTED LETTERS — scrollable strip near top-center ── */}
        <div className="absolute top-14 left-0 right-0 flex justify-center px-4 pointer-events-none">
          <AnimatePresence>
            {detectedLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 max-w-full"
              >
                {/* Result string */}
                <div className="flex flex-wrap gap-1.5 justify-center max-w-xs md:max-w-lg">
                  {detectedLetters.map((d, i) => (
                    <DetectedLetterBubble
                      key={i}
                      letter={d.letter}
                      confidence={d.confidence}
                      index={i}
                    />
                  ))}
                </div>
                {/* Stats */}
                <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-white/10">
                  <span className="text-white/40 text-xs">{detectedLetters.length} huruf</span>
                  {avgConfidence && (
                    <span className="text-white/40 text-xs">avg {avgConfidence}% yakin</span>
                  )}
                  <span className="text-white/60 text-xs font-mono font-bold">{resultText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CENTER FLASH — letter detected ── */}
        <AnimatePresence>
          {lastFlash && (
            <motion.div
              key={lastFlash + Date.now()}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl font-bold text-white font-mono">{lastFlash}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SAVED FLASH ── */}
        <AnimatePresence>
          {savedFlash && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <div className="bg-green-500/20 border border-green-400/40 backdrop-blur-md rounded-2xl px-8 py-5 text-center">
                <div className="flex items-center gap-2 text-green-300 font-bold text-lg justify-center">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  +5 XP Tersimpan!
                </div>
                <p className="text-green-400/70 text-sm mt-1">{detectedLetters.length} huruf dicatat</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM PANEL overlay ── */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Progress line — huruf terdeteksi per 10 */}
          <div className="h-0.5 bg-white/5">
            <motion.div
              className="h-full bg-white/30"
              animate={{ width: `${Math.min(100, (detectedLetters.length / MAX_DISPLAY_LETTERS) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 120 }}
            />
          </div>

          <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 pt-8 pb-5">
            {/* Feedback */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.p
                  key={feedback}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`text-sm mb-4 font-medium ${feedbackType === 'success' ? 'text-green-400'
                      : feedbackType === 'error' ? 'text-red-400'
                        : 'text-white/50'
                    }`}
                >
                  {feedbackType === 'success' ? '✓ ' : feedbackType === 'error' ? '✗ ' : ''}{feedback}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-3">
              {!isRecording ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  disabled={isModelLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold py-3.5 rounded-2xl disabled:opacity-40 hover:bg-slate-100 transition-colors"
                >
                  <Play className="w-4 h-4" /> Mulai Rekam
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStop}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-2xl transition-colors disabled:opacity-60"
                >
                  {isSaving
                    ? <><Loader className="w-4 h-4 animate-spin" /> Menyimpan...</>
                    : <><Square className="w-4 h-4" /> Hentikan & Simpan</>
                  }
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tips section — di bawah webcam ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {[
          { icon: '💡', text: 'Pastikan pencahayaan ruangan cukup terang dan merata.' },
          { icon: '📏', text: 'Posisikan tangan dalam kotak panduan di tengah layar.' },
          { icon: '🐢', text: 'Lakukan gerakan perlahan dan tahan sejenak di posisi akhir.' },
          { icon: '🔄', text: 'Sesi otomatis tersimpan saat kamu menekan Hentikan.' },
        ].map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            className="flex items-start gap-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3"
          >
            <span className="text-xl shrink-0">{tip.icon}</span>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{tip.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </AppLayout>
  );
}