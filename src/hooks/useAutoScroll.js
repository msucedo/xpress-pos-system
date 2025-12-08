import { useEffect } from 'react';

/**
 * Hook genérico y reutilizable para auto-scroll a top cuando se activa un trigger
 * @param {boolean} trigger - Valor que activa el scroll (ej: isSubmitting)
 * @param {string} selector - Selector CSS del elemento a scrollear (default: '.promotion-form')
 */
export function useAutoScroll(trigger, selector = '.promotion-form') {
  useEffect(() => {
    if (trigger) {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [trigger, selector]);
}
