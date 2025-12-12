/**
 * Sistema de animaciones centralizado
 * Importa todo desde aquí para mantener consistencia
 *
 * @example
 * import { modalContentVariants, transitions } from '@/animations';
 */

// Exportar todas las transiciones
export * from './transitions';

// Exportar todas las variantes
export * from './variants';

// Re-exportar motion de framer-motion para conveniencia
export { motion, AnimatePresence } from 'framer-motion';
