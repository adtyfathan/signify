import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useAnimation';

/**
 * Animated Card yang fade in on scroll
 */
export function AnimatedCard({ children, delay = 0, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Container dengan stagger effect
 */
export function AnimatedContainer({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated List Item
 */
export function AnimatedListItem({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Button dengan hover effect
 */
export function AnimatedButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/**
 * Animated Badge dengan pulse effect
 */
export function AnimatedBadge({ children, variant = 'default', animated = false }) {
  return (
    <motion.div
      animate={animated ? { scale: [1, 1.1, 1] } : {}}
      transition={animated ? { repeat: Infinity, duration: 2 } : {}}
    >
      {children}
    </motion.div>
  );
}

/**
 * Skeleton loader dengan shimmer effect
 */
export function SkeletonLoader({ count = 1, height = 'h-6', width = 'w-full' }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md animate-pulse`}
        />
      ))}
    </div>
  );
}
