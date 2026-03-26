import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Video, BookOpen, CheckCircle2, Loader,
    ChevronRight, ChevronLeft, Star, Images, Lightbulb,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const DIFFICULTY_CONFIG = {
    easy: { label: 'Mudah', stars: 1, className: 'bg-[#6fb89d]/15 text-[#4a9a7a] dark:bg-[#6fb89d]/20 dark:text-[#6fb89d]' },
    medium: { label: 'Sedang', stars: 2, className: 'bg-[#f8d95e]/20 text-[#b89a00] dark:bg-[#f8d95e]/15 dark:text-[#f8d95e]' },
    hard: { label: 'Sulit', stars: 3, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const TIPS = [
    'Perhatikan posisi jari dan tangan dengan seksama',
    'Praktikkan gerakan berulang kali di depan cermin',
    'Jangan takut untuk mencoba, pengulangan adalah kunci',
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getYouTubeEmbedUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v'))
            return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
        if (parsed.hostname === 'youtu.be')
            return `https://www.youtube.com/embed${parsed.pathname}`;
        if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/'))
            return url;
    } catch { /* ignore */ }
    return null;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function DifficultyBadge({ difficulty }) {
    const cfg = DIFFICULTY_CONFIG[difficulty];
    if (!cfg) return null;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.className}`}>
            {Array.from({ length: cfg.stars }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-current" />
            ))}
            {cfg.label}
        </span>
    );
}

function SectionHeader({ icon: Icon, title, right }) {
    return (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#6fb89d]/20
                        bg-[#6fb89d]/[0.06] dark:bg-[#6fb89d]/10">
            <Icon className="w-4 h-4 text-[#6fb89d] shrink-0" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">
                {title}
            </span>
            {right}
        </div>
    );
}

function VideoPlayer({ videoSrc, youtubeEmbedUrl, isYoutube }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black"
        >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                <Video className="w-3.5 h-3.5 text-[#f8d95e]" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    Video Pembelajaran
                </span>
            </div>
            <div className="aspect-video">
                {isYoutube ? (
                    <iframe
                        src={youtubeEmbedUrl}
                        title="Video Pembelajaran"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    />
                ) : (
                    <video src={`/${videoSrc}`} controls className="w-full h-full bg-black">
                        Browser Anda tidak mendukung video.
                    </video>
                )}
            </div>
        </motion.div>
    );
}

function TipsPanel({ compact = false }) {
    return (
        <div className={`rounded-xl border border-[#f8d95e]/35
                         bg-[#f8d95e]/8 dark:bg-[#f8d95e]/5
                         ${compact ? 'p-4' : 'p-4'}`}>
            <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg
                                bg-[#f8d95e]/25 dark:bg-[#f8d95e]/15
                                flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-[#b89a00] dark:text-[#f8d95e]" />
                </div>
                <div>
                    <p className={`font-semibold text-slate-700 dark:text-slate-200 mb-1.5 ${compact ? 'text-xs' : 'text-sm'}`}>
                        Tips Pembelajaran
                    </p>
                    <ul className="space-y-1.5">
                        {TIPS.map((tip, i) => (
                            <li key={i} className={`flex items-start gap-1.5 text-slate-600 dark:text-slate-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                                <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-[#6fb89d]" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ImageCarousel({ allImages }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const thumbRef = useRef(null);
    const isMultiple = allImages.length > 1;

    const goTo = (idx) => {
        setActiveIdx(idx);
        if (thumbRef.current) {
            const thumbs = thumbRef.current.querySelectorAll('[data-thumb]');
            thumbs[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    return (
        <div className="space-y-2.5">
            {/* Main viewer */}
            <div className="relative rounded-xl overflow-hidden
                            bg-slate-100 dark:bg-slate-800
                            border border-[#6fb89d]/15">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="relative"
                    >
                        <img
                            src={`/${allImages[activeIdx].image_path}`}
                            alt={allImages[activeIdx].caption ?? `Gambar ${activeIdx + 1}`}
                            className={`w-full object-contain ${isMultiple ? 'max-h-60' : 'max-h-80'}`}
                        />
                        {allImages[activeIdx].caption && (
                            <div className="absolute bottom-0 inset-x-0 px-3 py-2
                                            bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-xs text-white/90 leading-snug">
                                    {allImages[activeIdx].caption}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {isMultiple && (
                    <>
                        <button
                            onClick={() => goTo(Math.max(0, activeIdx - 1))}
                            disabled={activeIdx === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2
                                       w-7 h-7 rounded-full flex items-center justify-center
                                       bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm
                                       border border-[#6fb89d]/30 text-[#6fb89d] shadow
                                       hover:bg-white dark:hover:bg-slate-900 transition
                                       disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => goTo(Math.min(allImages.length - 1, activeIdx + 1))}
                            disabled={activeIdx === allImages.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2
                                       w-7 h-7 rounded-full flex items-center justify-center
                                       bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm
                                       border border-[#6fb89d]/30 text-[#6fb89d] shadow
                                       hover:bg-white dark:hover:bg-slate-900 transition
                                       disabled:opacity-25 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full
                                         bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-medium">
                            {activeIdx + 1} / {allImages.length}
                        </span>
                    </>
                )}
            </div>

            {/* Thumbnail strip */}
            {isMultiple && (
                <div
                    ref={thumbRef}
                    className="flex gap-2 overflow-x-auto pb-0.5 scroll-smooth
                               [&::-webkit-scrollbar]:h-1
                               [&::-webkit-scrollbar-thumb]:rounded-full
                               [&::-webkit-scrollbar-thumb]:bg-[#6fb89d]/30"
                >
                    {allImages.map((img, idx) => (
                        <button
                            key={img.id}
                            data-thumb
                            onClick={() => goTo(idx)}
                            className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2
                                        transition-all duration-200
                                        ${activeIdx === idx
                                    ? 'border-[#6fb89d] shadow-md shadow-[#6fb89d]/25 scale-[1.06]'
                                    : 'border-transparent opacity-55 hover:opacity-80 hover:border-[#6fb89d]/35'
                                }`}
                        >
                            <img
                                src={`/${img.image_path}`}
                                alt={img.caption ?? `Gambar ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function TheoryLesson({ lesson, onComplete }) {
    const [isCompleting, setIsCompleting] = useState(false);
    const { sign, images = [], video_path: lessonVideoPath } = lesson;

    const allImages = images.length > 0
        ? images
        : sign?.guide_image_path
            ? [{ id: 'guide', image_path: sign.guide_image_path, caption: null }]
            : [];
    const hasImages = allImages.length > 0;

    const videoSrc = lessonVideoPath ?? sign?.video_path ?? null;
    const youtubeEmbedUrl = videoSrc ? getYouTubeEmbedUrl(videoSrc) : null;
    const isYoutube = !!youtubeEmbedUrl;
    const hasVideo = !!videoSrc;

    const handleComplete = () => {
        setIsCompleting(true);
        router.post(route('lessons.complete', lesson.id), {}, {
            preserveScroll: true,
            onSuccess: onComplete,
            onError: () => setIsCompleting(false),
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ══════════════════════════════════
                LEFT — Video + Tips (desktop sticky)
            ══════════════════════════════════ */}
            {hasVideo && (
                <div className="w-full lg:w-[58%] lg:sticky lg:top-6 flex flex-col gap-4">
                    <VideoPlayer
                        videoSrc={videoSrc}
                        youtubeEmbedUrl={youtubeEmbedUrl}
                        isYoutube={isYoutube}
                    />
                    {/* Tips visible below video only on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="hidden lg:block"
                    >
                        <TipsPanel compact />
                    </motion.div>
                </div>
            )}

            {/* ══════════════════════════════════
                RIGHT — Info panels
            ══════════════════════════════════ */}
            <div className={`flex flex-col gap-4 w-full ${hasVideo ? 'lg:w-[42%]' : 'max-w-2xl mx-auto'}`}>

                {/* Sign info + images */}
                {(sign || hasImages) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="rounded-xl border border-[#6fb89d]/25
                                   bg-[#f8f3e1] dark:bg-slate-900 overflow-hidden"
                    >
                        <SectionHeader icon={Images} title="Isyarat & Panduan Visual" />
                        <div className="p-4 space-y-4">
                            {/* Sign text info */}
                            {sign && (
                                <div className="flex items-start gap-3.5">
                                    <div className="shrink-0 w-14 h-14 rounded-2xl
                                                    bg-gradient-to-br from-[#6fb89d]/20 to-[#6fb89d]/10
                                                    dark:from-[#6fb89d]/25 dark:to-[#6fb89d]/10
                                                    border-2 border-[#6fb89d]/35
                                                    flex items-center justify-center shadow-sm">
                                        <span className="text-2xl font-black text-[#6fb89d] leading-none">
                                            {sign.letter ?? '?'}
                                        </span>
                                    </div>
                                    <div className="flex-1 pt-0.5 space-y-2">
                                        {sign.description && (
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {sign.description}
                                            </p>
                                        )}
                                        {sign.difficulty && <DifficultyBadge difficulty={sign.difficulty} />}
                                    </div>
                                </div>
                            )}

                            {/* Divider between sign info and images */}
                            {sign && hasImages && (
                                <div className="border-t border-[#6fb89d]/15" />
                            )}

                            {/* Image carousel */}
                            {hasImages && <ImageCarousel allImages={allImages} />}
                        </div>
                    </motion.div>
                )}

                {/* Materi / Content */}
                {lesson.content && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="rounded-xl border border-[#6fb89d]/25
                                   bg-white dark:bg-slate-900 overflow-hidden"
                    >
                        <SectionHeader icon={BookOpen} title="Materi Pembelajaran" />
                        <div className="p-4">
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none
                                           text-slate-700 dark:text-slate-300 leading-relaxed
                                           prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                                           prose-headings:font-semibold
                                           prose-a:text-[#6fb89d] prose-a:no-underline hover:prose-a:underline
                                           prose-strong:text-slate-800 dark:prose-strong:text-white
                                           prose-code:text-[#4a9a7a] prose-code:bg-[#6fb89d]/10
                                           prose-code:rounded prose-code:px-1"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Tips — mobile only (on desktop it sits below the video) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className={hasVideo ? 'lg:hidden' : ''}
                >
                    <TipsPanel />
                </motion.div>

                {/* Complete button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Button
                        onClick={handleComplete}
                        disabled={isCompleting}
                        className="w-full h-12 rounded-xl font-semibold text-sm
                                   bg-[#6fb89d] hover:bg-[#5aa389]
                                   active:scale-[0.985] active:bg-[#4e9278]
                                   text-white shadow-lg shadow-[#6fb89d]/25
                                   transition-all duration-150
                                   flex items-center justify-center gap-2
                                   disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isCompleting ? (
                            <><Loader className="w-4 h-4 animate-spin" /> Menyelesaikan...</>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> Tandai Selesai & Lanjut</>
                        )}
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}