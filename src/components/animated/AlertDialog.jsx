import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  modalBackdropVariants,
  modalContentVariants,
  modalTransition,
} from '../../animations';
import './AlertDialog.css';

/**
 * AlertDialog - Modal informativo con un solo botón
 * Usado para mostrar mensajes de advertencia, error o información al usuario
 * Similar a ConfirmDialog pero más simple (sin confirmación, solo OK)
 */
const AlertDialog = ({
  isOpen,
  title,
  message,
  buttonText = 'OK',
  onClose,
  type = 'info' // 'info', 'warning', 'error'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
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
          className="alert-backdrop"
          onClick={handleBackdropClick}
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={modalTransition.backdrop}
        >
          <motion.div
            className={`alert-dialog alert-${type}`}
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={modalTransition.content}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alert-header">
              <h3 className="alert-title">{title}</h3>
            </div>
            <div className="alert-body">
              <p className="alert-message">{message}</p>
            </div>
            <div className="alert-footer">
              <button
                className={`alert-btn alert-btn-${type}`}
                onClick={onClose}
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertDialog;
