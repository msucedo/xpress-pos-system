import { motion, AnimatePresence } from 'framer-motion';
import { notificationVariants, transitions } from '../../animations';
import './AnimatedNotification.css';

/**
 * Notificación animada (toast) con entrada/salida suave
 *
 * @param {boolean} isVisible - Si la notificación está visible
 * @param {string} message - Mensaje de la notificación
 * @param {string} type - Tipo: 'success' | 'error' | 'warning' | 'info'
 * @param {function} onClose - Callback cuando se cierra
 * @param {number} duration - Duración en ms antes de auto-cerrar (0 = no auto-cerrar)
 *
 * @example
 * <AnimatedNotification
 *   isVisible={showNotif}
 *   message="Cambios guardados"
 *   type="success"
 *   onClose={() => setShowNotif(false)}
 *   duration={3000}
 * />
 */
const AnimatedNotification = ({
  isVisible,
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  // Auto-close después de duration
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`animated-notification ${type}`}
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transitions.normal}
        >
          <span className="notification-icon">{getIcon()}</span>
          <span className="notification-message">{message}</span>
          {onClose && (
            <button
              className="notification-close"
              onClick={onClose}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Fix: import React
import React from 'react';

export default AnimatedNotification;
