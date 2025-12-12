import { Icon as IconifyIcon } from '@iconify/react';
import { iconMap } from './iconMap';

/**
 * Componente universal de iconos usando Iconify (flat-color-icons)
 *
 * @param {string} name - Nombre semántico del icono (ver iconMap.js)
 * @param {number} size - Tamaño del icono en px (default: 24)
 * @param {string} className - Clases CSS adicionales
 * @param {string} color - Color del icono (solo para iconos que soporten color, default: 'inherit')
 * @param {object} style - Estilos inline adicionales
 *
 * @example
 * <Icon name="package" size={32} />
 * <Icon name="success" size={20} className="my-icon" />
 * <Icon name="celebration" size={24} />
 */
const Icon = ({
  name,
  size = 24,
  className = '',
  color = 'inherit',
  style = {},
  ...rest
}) => {
  // Buscar el icono en el mapa semántico
  const iconName = iconMap[name] || name;

  // Si el iconName incluye "flat-color-icons:", es un icono colorido y no debemos aplicar color
  const shouldApplyColor = !iconName.includes('flat-color-icons:');

  return (
    <IconifyIcon
      icon={iconName}
      width={size}
      height={size}
      className={`app-icon ${className}`}
      style={{
        color: shouldApplyColor ? color : undefined,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Icon;
