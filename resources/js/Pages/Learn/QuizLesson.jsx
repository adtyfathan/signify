import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePythonPredict } from '@/hooks/ai/usePythonPredict';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Play, Square, AlertCircle, Loader, ChevronLeft, Zap } from 'lucide-react';
import Webcam from 'react-webcam';

const PYTHON_API_URL = 'http://127.0.0.1:8001';
const INFERENCE_MS = 300;
const DEBOUNCE_MS = 500;

// ─── Quiz Completed Screen ─────────────────────────────────────────────────────

function QuizCompleted({ score, xpEarned, lesson }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-6"
        >
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
            </div>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="relative mb-6"
            >
                <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"
                >
                    <Zap className="w-4 h-4 text-yellow-900" />
                </motion.div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
            >
                Luar Biasa!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 mb-8 text-lg"
            >
                Quiz selesai dengan skor{' '}
                <span className="text-green-400 font-bold text-2xl">{score}%</span>
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-3 mb-8"
            >
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">+{xpEarned ?? lesson.xp_reward} XP diperoleh</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <Link href={`/modules/${lesson.module_id}`}>
                    <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3 rounded-full">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Modul
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    );
}

// ─── Letter Tiles ──────────────────────────────────────────────────────────────

function LetterTiles({ content, detectedSigns }) {
    return (
        <div className="flex gap-2 flex-wrap justify-center">
            {content.split('').map((char, i) => {
                const isDetected = i < detectedSigns.length;
                const isCurrent = i === detectedSigns.length;
                const isCorrect = isDetected && detectedSigns[i] === char.toUpperCase();

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`
                            relative w-10 h-12 rounded-lg flex items-center justify-center
                            text-lg font-bold font-mono transition-all duration-300
                            ${isDetected
                                ? isCorrect
                                    ? 'bg-green-500/30 border border-green-400/60 text-green-300'
                                    : 'bg-red-500/30 border border-red-400/60 text-red-300'
                                : isCurrent
                                    ? 'bg-white/20 border-2 border-white/80 text-white scale-110 shadow-lg shadow-white/20'
                                    : 'bg-white/5 border border-white/20 text-white/40'
                            }
                        `}
                    >
                        {char.toUpperCase()}
                        {isDetected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold
                                    ${isCorrect ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'}`}
                            >
                                {isCorrect ? '✓' : '✗'}
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─── Main QuizLesson ──────────────────────────────────────────────────────────

export default function QuizLesson({ lesson }) {
    const [quizItems] = useState(lesson.quiz_items ?? []);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [detectedSigns, setDetectedSigns] = useState([]);
    const [predictionDetails, setPredictionDetails] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('info'); // 'info' | 'success' | 'error'
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [earnedXp, setEarnedXp] = useState(null);
    const [lastDetectedLetter, setLastDetectedLetter] = useState(null);

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectedSignsRef = useRef(detectedSigns);
    const recordingStartTimeRef = useRef(null);
    const isProcessingRef = useRef(false);
    const renderRafRef = useRef(null);
    const lastInferenceTimeRef = useRef(0);

    const { predict: predictWithPython } = usePythonPredict();

    useEffect(() => { detectedSignsRef.current = detectedSigns; }, [detectedSigns]);

    // Check Python API on mount
    useEffect(() => {
        (async () => {
            setIsModelLoading(true);
            try {
                const res = await fetch(`${PYTHON_API_URL}/health`);
                setFeedback(res.ok
                    ? 'AI Server siap. Klik Mulai untuk memulai.'
                    : 'Python API tidak tersedia.'
                );
                setFeedbackType(res.ok ? 'info' : 'error');
            } catch {
                setFeedback('Python API tidak tersedia. Jalankan uvicorn main:app');
                setFeedbackType('error');
            } finally {
                setIsModelLoading(false);
            }
        })();
    }, []);

    // Draw guide box on canvas
    const drawBoundingBox = (ctx, w, h) => {
        const bw = w * 0.55, bh = h * 0.75;
        const x = (w - bw) / 2, y = (h - bh) / 2;
        const r = 16;

        // Dimmed areas outside box
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, y);
        ctx.fillRect(0, y + bh, w, h - y - bh);
        ctx.fillRect(0, y, x, bh);
        ctx.fillRect(x + bw, y, w - x - bw, bh);

        // Corner brackets only (not full rectangle)
        const cornerLen = 28;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        const corners = [
            [x + r, y, x, y, x, y + r],
            [x + bw - r, y, x + bw, y, x + bw, y + r],
            [x, y + bh - r, x, y + bh, x + r, y + bh],
            [x + bw, y + bh - r, x + bw, y + bh, x + bw - r, y + bh],
        ];

        corners.forEach(([x1, y1, cx, cy, x2, y2]) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(cx, cy);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });
    };

    // Render loop
    useEffect(() => {
        if (!isRecording) {
            cancelAnimationFrame(renderRafRef.current);
            return;
        }

        const renderFrame = () => {
            const vid = webcamRef.current?.video;
            const canvas = canvasRef.current;
            if (!vid || !canvas || vid.readyState !== vid.HAVE_ENOUGH_DATA) {
                renderRafRef.current = requestAnimationFrame(renderFrame);
                return;
            }
            if (canvas.width !== vid.videoWidth) {
                canvas.width = vid.videoWidth;
                canvas.height = vid.videoHeight;
            }
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBoundingBox(ctx, canvas.width, canvas.height);
            renderRafRef.current = requestAnimationFrame(renderFrame);
        };

        renderRafRef.current = requestAnimationFrame(renderFrame);
        return () => cancelAnimationFrame(renderRafRef.current);
    }, [isRecording]);

    // Inference loop
    useEffect(() => {
        if (!isRecording) return;

        const currentQuiz = quizItems[currentQuizIndex];
        if (!currentQuiz) return;

        let lastSuccessTime = 0;

        const interval = setInterval(async () => {
            if (!webcamRef.current) return;

            const now = Date.now();
            if (now - lastInferenceTimeRef.current < INFERENCE_MS) return;
            lastInferenceTimeRef.current = now;

            if (now - lastSuccessTime < DEBOUNCE_MS) return;

            const detectedLen = detectedSignsRef.current.length;
            const expectedLabel = currentQuiz.content[detectedLen]?.toUpperCase();
            if (detectedLen >= currentQuiz.content.length) return;

            try {
                const result = await predictWithPython(webcamRef.current, expectedLabel);
                if (!result) return;

                if (result.confidence > 60 && result.is_correct === true) {
                    lastSuccessTime = Date.now();
                    setLastDetectedLetter(result.predicted_label);
                    setFeedback(`${result.predicted_label} — ${result.confidence.toFixed(0)}% yakin`);
                    setFeedbackType('success');

                    setTimeout(() => setLastDetectedLetter(null), 600);

                    setDetectedSigns(prev => {
                        if (prev.length >= currentQuiz.content.length) return prev;
                        return [...prev, result.predicted_label];
                    });

                    setPredictionDetails(prev => [...prev, {
                        letter: result.predicted_label,
                        position: detectedLen,
                        is_correct: true,
                        confidence: result.confidence,
                        time_taken_ms: Date.now() - recordingStartTimeRef.current,
                    }]);
                }
            } catch (err) {
                console.error('[Inference] API Error:', err.message);
            }
        }, INFERENCE_MS);

        return () => clearInterval(interval);
    }, [isRecording, currentQuizIndex, quizItems, predictWithPython]);

    // Auto-complete when all signs detected
    useEffect(() => {
        const currentQuiz = quizItems[currentQuizIndex];
        if (!currentQuiz) return;

        const targetLen = currentQuiz.content.length;
        if (!targetLen || detectedSigns.length !== targetLen) return;
        if (isProcessingRef.current) return;

        isProcessingRef.current = true;
        setIsRecording(false);

        const targetContent = currentQuiz.content.toUpperCase();
        const correctCount = detectedSigns.filter((s, i) => s === targetContent[i]).length;
        const quizScore = Math.round((correctCount / targetLen) * 100);
        const durationSec = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);

        setTimeout(() => {
            if (quizScore >= lesson.min_pass_score) {
                setFeedback(`Skor ${quizScore}% — Berhasil!`);
                setFeedbackType('success');
                setScore(prev => prev + quizScore);

                if (currentQuizIndex < quizItems.length - 1) {
                    setTimeout(() => {
                        setCurrentQuizIndex(prev => prev + 1);
                        setDetectedSigns([]);
                        setPredictionDetails([]);
                        setFeedback('Lanjut ke soal berikutnya!');
                        setFeedbackType('info');
                        isProcessingRef.current = false;
                    }, 1500);
                } else {
                    submitQuizResults(quizScore, durationSec, correctCount);
                }
            } else {
                setFeedback(`Skor ${quizScore}% — Butuh ${lesson.min_pass_score}%. Coba lagi!`);
                setFeedbackType('error');
                setTimeout(() => {
                    setDetectedSigns([]);
                    setPredictionDetails([]);
                    setFeedback('Peragakan ulang dari awal.');
                    setFeedbackType('info');
                    isProcessingRef.current = false;
                }, 3000);
            }
        }, 500);
    }, [detectedSigns, currentQuizIndex, quizItems]);

    const submitQuizResults = async (finalScore, totalDuration, correctUnits) => {
        setIsSubmitting(true);
        const currentQuiz = quizItems[currentQuizIndex];

        const details = predictionDetails.length > 0
            ? predictionDetails.map(d => ({
                letter: d.letter,
                position: d.position,
                is_correct: d.is_correct,
                ai_predicted: d.ai_predicted ?? d.letter,
                confidence: d.confidence > 1 ? d.confidence / 100 : d.confidence,
                time_taken_ms: d.time_taken_ms,
                attempts: d.attempts ?? 1,
            }))
            : detectedSigns.map((sign, idx) => ({
                letter: sign,
                position: idx,
                is_correct: sign === currentQuiz.content[idx],
                ai_predicted: sign,
                confidence: 0.0,
                time_taken_ms: idx * 1000,
                attempts: 1,
            }));

        try {
            const { data } = await axios.post(route('quiz.submit'), {
                lesson_id: lesson.id,
                quiz_item_id: currentQuiz.id,
                score: finalScore,
                units_correct: correctUnits,
                units_total: currentQuiz.content.length,
                duration_sec: Math.max(1, totalDuration),
                status: finalScore >= lesson.min_pass_score ? 'completed' : 'failed',
                details,
            });
            setEarnedXp(data.xp_earned);
            setQuizCompleted(true);
            setTimeout(() => router.visit(data.redirect), 3500);
        } catch (error) {
            setFeedback(error.response?.data?.message ?? 'Error mengirim hasil.');
            setFeedbackType('error');
            isProcessingRef.current = false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartRecording = () => {
        isProcessingRef.current = false;
        recordingStartTimeRef.current = Date.now();
        setIsRecording(true);
        setDetectedSigns([]);
        setPredictionDetails([]);
        setFeedback('Peragakan huruf satu per satu...');
        setFeedbackType('info');
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        setFeedback('Rekaman dihentikan.');
        setFeedbackType('info');
    };

    const currentQuiz = quizItems[currentQuizIndex];
    const progressPct = currentQuiz
        ? (detectedSigns.length / currentQuiz.content.length) * 100
        : 0;

    // ── Completed Screen ─────────────────────────────────────────────────────
    if (quizCompleted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <QuizCompleted score={score} xpEarned={earnedXp} lesson={lesson} />
            </div>
        );
    }

    // ── Main Quiz Layout ─────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-4 py-3 z-10">
                <Link
                    href={`/modules/${lesson.module_id}`}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Quiz item progress dots */}
                    <div className="flex gap-1.5">
                        {quizItems.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i < currentQuizIndex
                                        ? 'bg-green-400'
                                        : i === currentQuizIndex
                                            ? 'bg-white scale-125'
                                            : 'bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-slate-400 text-xs">
                        {currentQuizIndex + 1}/{quizItems.length}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>+{lesson.xp_reward} XP</span>
                </div>
            </div>

            {/* ── Webcam Stage (full width, fills remaining height) ── */}
            <div className="relative flex-1 overflow-hidden">

                {/* Webcam */}
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    mirrored
                    videoConstraints={{ width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }}
                    style={{ minHeight: '60vh' }}
                />

                {/* Canvas overlay (bounding box only) */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* Model loading overlay */}
                <AnimatePresence>
                    {isModelLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm"
                        >
                            <div className="text-center">
                                <Loader className="w-10 h-10 text-white animate-spin mx-auto mb-3" />
                                <p className="text-white/70 text-sm">Memuat AI Model...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── OVERLAY: Top — Target Word ── */}
                <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-3 px-4 pointer-events-none">
                    {/* Word/letter target label */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center"
                    >
                        <p className="text-white/50 text-xs mb-2 tracking-widest uppercase">Peragakan</p>
                        {currentQuiz && (
                            <LetterTiles
                                content={currentQuiz.content}
                                detectedSigns={detectedSigns}
                            />
                        )}
                    </motion.div>

                    {/* Hint */}
                    {currentQuiz?.hint && (
                        <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5">
                            <p className="text-white/50 text-xs">💡 {currentQuiz.hint}</p>
                        </div>
                    )}
                </div>

                {/* ── OVERLAY: REC badge ── */}
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold"
                        >
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            REC
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── OVERLAY: Center flash — detected letter ── */}
                <AnimatePresence>
                    {lastDetectedLetter && (
                        <motion.div
                            key={lastDetectedLetter + Date.now()}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-5xl font-bold text-green-300 font-mono">
                                    {lastDetectedLetter}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── OVERLAY: Bottom — Progress bar + feedback + controls ── */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                    {/* Progress bar */}
                    <div className="h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-green-400"
                            animate={{ width: `${progressPct}%` }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        />
                    </div>

                    {/* Bottom panel */}
                    <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 pt-8 pb-6 pointer-events-auto">

                        {/* Detected signs display */}
                        {detectedSigns.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-3"
                            >
                                <span className="text-white/40 text-xs uppercase tracking-wider">Terdeteksi:</span>
                                <span className="text-white font-mono font-bold text-lg tracking-widest">
                                    {detectedSigns.join('')}
                                </span>
                                <span className="text-white/30 text-xs">
                                    {detectedSigns.length}/{currentQuiz?.content.length ?? 0}
                                </span>
                            </motion.div>
                        )}

                        {/* Feedback message */}
                        <AnimatePresence mode="wait">
                            {feedback && (
                                <motion.p
                                    key={feedback}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-sm mb-4 font-medium ${feedbackType === 'success'
                                            ? 'text-green-400'
                                            : feedbackType === 'error'
                                                ? 'text-red-400'
                                                : 'text-white/60'
                                        }`}
                                >
                                    {feedbackType === 'success' ? '✓ ' : feedbackType === 'error' ? '✗ ' : ''}
                                    {feedback}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex gap-3">
                            {!isRecording ? (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleStartRecording}
                                    disabled={isModelLoading || isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold py-3.5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <><Loader className="w-4 h-4 animate-spin" /> Menyimpan...</>
                                    ) : (
                                        <><Play className="w-4 h-4" /> Mulai Rekam</>
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleStopRecording}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-2xl transition-colors"
                                >
                                    <Square className="w-4 h-4" /> Hentikan
                                </motion.button>
                            )}
                        </div>

                        {/* Min pass score info */}
                        <p className="text-center text-white/25 text-xs mt-3">
                            Skor minimal lulus: {lesson.min_pass_score}% · Confidence min: 60%
                        </p>
                    </div>
                </div>

                {/* ── OVERLAY: All letters detected badge ── */}
                <AnimatePresence>
                    {currentQuiz && detectedSigns.length === currentQuiz.content.length && currentQuiz.content.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-green-500/20 border border-green-400/40 backdrop-blur-md rounded-2xl px-8 py-5 text-center">
                                <p className="text-green-300 font-bold text-lg">✓ Semua huruf terdeteksi</p>
                                <p className="text-green-400/70 text-sm mt-1">Memproses hasil...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}