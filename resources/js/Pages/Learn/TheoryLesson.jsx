import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, BookOpen, Zap, CheckCircle2, Volume2, Loader } from 'lucide-react';

const DIFFICULTY_CONFIG = {
    easy: { label: '⭐ Mudah', className: 'bg-green-200 text-green-800' },
    medium: { label: '⭐⭐ Sedang', className: 'bg-yellow-200 text-yellow-800' },
    hard: { label: '⭐⭐⭐ Sulit', className: 'bg-red-200 text-red-800' },
};

export default function TheoryLesson({ lesson, onComplete }) {
    const [isCompleting, setIsCompleting] = useState(false);
    const { sign, images = [], video_path: lessonVideoPath } = lesson;

    const hasLessonImages = images.length > 0;
    const videoSrc = lessonVideoPath ?? sign?.video_path ?? null;

    const handleComplete = () => {
        setIsCompleting(true);
        router.post(route('lessons.complete', lesson.id), {}, {
            preserveScroll: true,
            onSuccess: onComplete,
            onError: () => setIsCompleting(false),
        });
    };

    return (
        <div className="space-y-8">
            {/* Sign & Images */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="mb-6">
                                    <div className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                        {sign?.letter ?? 'N/A'}
                                    </div>
                                    <p className="text-lg text-slate-700 dark:text-slate-300">{sign?.description}</p>
                                </div>
                                {sign?.difficulty && (
                                    <Badge variant="secondary" className={DIFFICULTY_CONFIG[sign.difficulty]?.className}>
                                        {DIFFICULTY_CONFIG[sign.difficulty]?.label}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex justify-center">
                                {hasLessonImages ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {images.map((image) => (
                                            <motion.img
                                                key={image.id}
                                                src={`/${image.image_path}`}
                                                alt={image.caption ?? `Gambar pelajaran ${sign?.letter ?? ''}`}
                                                className="w-full max-w-sm h-auto rounded-lg shadow-lg object-cover"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        ))}
                                    </div>
                                ) : sign?.guide_image_path ? (
                                    <motion.img
                                        src={`/${sign.guide_image_path}`}
                                        alt={`Sign ${sign.letter}`}
                                        className="w-full max-w-sm h-auto rounded-lg shadow-lg object-cover"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </CardContent>  
                </Card>
            </motion.div>

            {/* Video */}
            {videoSrc && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="w-5 h-5" /> Video Pembelajaran
                            </CardTitle>
                            <CardDescription>Tonton demonstrasi gerakan tangan dengan seksama</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                                <video src={`/${videoSrc}`} controls className="w-full h-full">
                                    Browser Anda tidak mendukung video.
                                </video>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Content */}
            {lesson.content && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" /> Materi Pembelajaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Tips */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
            >
                <div className="flex gap-4">
                    <Volume2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tips Pembelajaran</h3>
                        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                            <li>✓ Perhatikan posisi jari dan tangan dengan seksama</li>
                            <li>✓ Praktikkan gerakan berulang kali di depan cermin</li>
                            <li>✓ Jangan takut untuk mencoba, pengulangan adalah kunci</li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Complete Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg flex items-center justify-center gap-2"
                >
                    {isCompleting
                        ? <><Loader className="w-5 h-5 animate-spin" /> Menyelesaikan...</>
                        : <><CheckCircle2 className="w-5 h-5" /> Tandai Selesai</>}
                </Button>
            </motion.div>
        </div>
    );
}