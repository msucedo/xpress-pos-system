import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  modalBackdropVariants,
  modalContentVariants,
  modalTransition,
} from '../animations';
import './Modal.css';

/**
 * Modal con animaciones Framer Motion
 * API compatible con la versión anterior para no romper componentes existentes
 */
const Modal = ({ isOpen, onClose, title, headerContent, children, size = 'medium' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
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
              <button className="modal-close" onClick={onClose}>
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

export default Modal;
