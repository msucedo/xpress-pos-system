import PropTypes from 'prop-types';

/**
 * Componente reutilizable para mostrar texto de ayuda/hint
 * Usado para guiar al usuario sobre cómo llenar campos
 */
export function HelpText({ children, style = {} }) {
  if (!children) return null;

  return (
    <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px', ...style }}>
      {children}
    </small>
  );
}

HelpText.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};
