import { motion } from 'framer-motion';
import { cardVariants, cardTransition } from '../../animations';
import './AnimatedCard.css';

/**
 * Card animada con micro-interactions estilo Apple
 *
 * @param {ReactNode} children - Contenido de la card
 * @param {string} className - Clases CSS adicionales
 * @param {function} onClick - Handler para clicks
 * @param {boolean} hoverable - Si debe tener efecto hover (default: true)
 * @param {boolean} clickable - Si debe tener efecto de click (default: false)
 * @param {object} style - Estilos inline adicionales
 *
 * @example
 * <AnimatedCard hoverable clickable onClick={handleClick}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </AnimatedCard>
 */
const AnimatedCard = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  clickable = false,
  style = {},
  ...rest
}) => {
  return (
    <motion.div
      className={`animated-card ${className}`}
      style={style}
      variants={cardVariants}
      initial="initial"
      whileHover={hoverable ? 'hover' : undefined}
      whileTap={clickable || onClick ? 'tap' : undefined}
      transition={cardTransition.hover}
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
