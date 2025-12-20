import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  modalBackdropVariants,
  modalContentVariants,
  modalTransition,
} from '../../animations';
import '../Modal.css';

/**
 * Modal animado con animaciones consistentes estilo Apple
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} title - Título del modal
 * @param {ReactNode} headerContent - Contenido personalizado para el header (opcional)
 * @param {ReactNode} children - Contenido del modal
 * @param {string} size - Tamaño del modal: 'small', 'medium', 'large', 'full'
 * @param {boolean} disableScrollLock - Si es true, no controla el scroll del body (útil para modales anidados)
 */
const AnimatedModal = ({
  isOpen,
  onClose,
  title,
  headerContent,
  children,
  size = 'medium',
  disableScrollLock = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open (only if scroll lock is enabled)
    if (!disableScrollLock) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!disableScrollLock) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose, disableScrollLock]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          onClick={handleBackdropClick}
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={modalTransition.backdrop}
        >
          <motion.div
            className={`modal-content ${size}`}
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={modalTransition.content}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              {headerContent || <h2 className="modal-title">{title}</h2>}
              <button type="button" className="modal-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
