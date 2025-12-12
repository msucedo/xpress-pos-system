/**
 * Transiciones de animación estilo Apple
 * Configuraciones de timing consistentes para toda la aplicación
 */

// Apple-style cubic-bezier easing
// Suave, natural, ligeramente acelerado al inicio
export const appleEasing = [0.32, 0.72, 0, 1];

// Duraciones estándar (en segundos)
export const duration = {
  instant: 0.1,    // 100ms - Cambios instantáneos pero suaves
  fast: 0.2,       // 200ms - Hover effects, micro-interactions
  normal: 0.3,     // 300ms - Default para la mayoría de animaciones
  slow: 0.5,       // 500ms - Transiciones complejas, page transitions
  verySlow: 0.8,   // 800ms - Animaciones especiales
};

// Configuraciones de transición predefinidas
export const transitions = {
  // Rápida y sutil (hover, focus)
  fast: {
    duration: duration.fast,
    ease: appleEasing,
  },

  // Normal (modales, dropdowns)
  normal: {
    duration: duration.normal,
    ease: appleEasing,
  },

  // Lenta (page transitions, slides)
  slow: {
    duration: duration.slow,
    ease: appleEasing,
  },

  // Spring suave (botones, cards)
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
  },

  // Spring más rebotoso (success feedback)
  bouncy: {
    type: 'spring',
    damping: 15,
    stiffness: 400,
  },
};

// Configuraciones específicas por tipo de animación
export const modalTransition = {
  backdrop: {
    duration: duration.fast,
    ease: appleEasing,
  },
  content: {
    duration: duration.normal,
    ease: appleEasing,
  },
};

export const tabTransition = {
  duration: duration.normal,
  ease: appleEasing,
};

export const formTransition = {
  submit: {
    duration: duration.fast,
    ease: appleEasing,
  },
  feedback: {
    type: 'spring',
    damping: 20,
    stiffness: 350,
  },
};

export const cardTransition = {
  hover: {
    duration: duration.fast,
    ease: appleEasing,
  },
  tap: {
    duration: duration.instant,
    ease: appleEasing,
  },
};
