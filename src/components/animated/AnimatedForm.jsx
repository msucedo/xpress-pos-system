import { motion, AnimatePresence } from 'framer-motion';
import {
  formSubmitVariants,
  formFeedbackVariants,
  formTransition,
  spinnerVariants,
} from '../../animations';
import './AnimatedForm.css';

/**
 * Wrapper para formularios con feedback visual animado
 *
 * Proporciona animaciones consistentes para:
 * - Submit button (loading, success, error)
 * - Feedback messages
 * - Form validation states
 *
 * @param {ReactNode} children - El contenido del formulario
 * @param {function} onSubmit - Función que se ejecuta al enviar el formulario
 * @param {object} submitButtonProps - Props para personalizar el botón de submit
 * @param {string} submitButtonProps.text - Texto del botón (default: "Guardar")
 * @param {string} submitButtonProps.loadingText - Texto durante loading (default: "Guardando...")
 * @param {string} submitButtonProps.successText - Texto de éxito (default: "Guardado")
 * @param {string} submitButtonProps.className - Clase CSS adicional
 * @param {boolean} isSubmitting - Si el formulario está siendo enviado
 * @param {string} feedback - Mensaje de feedback (success/error)
 * @param {string} feedbackType - Tipo de feedback: 'success' | 'error'
 *
 * @example
 * <AnimatedForm
 *   onSubmit={handleSubmit}
 *   isSubmitting={isSubmitting}
 *   feedback={message}
 *   feedbackType="success"
 * >
 *   <input name="email" />
 *   <input name="password" />
 * </AnimatedForm>
 */
const AnimatedForm = ({
  children,
  onSubmit,
  submitButtonProps = {},
  isSubmitting = false,
  feedback = null,
  feedbackType = 'success',
}) => {
  const {
    text = 'Guardar',
    loadingText = 'Guardando...',
    successText = 'Guardado',
    className = '',
  } = submitButtonProps;

  // Determinar el estado del botón
  const getButtonState = () => {
    if (isSubmitting) return 'submitting';
    if (feedback && feedbackType === 'success') return 'success';
    if (feedback && feedbackType === 'error') return 'error';
    return 'idle';
  };

  const buttonState = getButtonState();

  // Determinar el texto del botón
  const getButtonText = () => {
    if (buttonState === 'submitting') return loadingText;
    if (buttonState === 'success') return successText;
    return text;
  };

  return (
    <form onSubmit={onSubmit} className="animated-form">
      {/* Contenido del formulario */}
      {children}

      {/* Submit button animado */}
      <motion.button
        type="submit"
        className={`animated-form-submit ${className}`}
        disabled={isSubmitting}
        variants={formSubmitVariants}
        animate={buttonState}
        transition={formTransition.submit}
      >
        {buttonState === 'submitting' && (
          <motion.div
            className="animated-form-spinner"
            variants={spinnerVariants}
            animate="animate"
          >
            <div className="spinner-ring" />
          </motion.div>
        )}
        <span>{getButtonText()}</span>
      </motion.button>

      {/* Feedback message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`animated-form-feedback ${feedbackType}`}
            variants={formFeedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={formTransition.feedback}
          >
            <span className="feedback-icon">
              {feedbackType === 'success' ? '✓' : '✕'}
            </span>
            <span className="feedback-text">{feedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default AnimatedForm;
