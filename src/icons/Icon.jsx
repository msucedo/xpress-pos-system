import { Icon as IconifyIcon } from '@iconify/react';
import { iconMap } from './iconMap';
import { characterIcons } from './characters';

/**
 * Componente universal de iconos usando Iconify (flat-color-icons) y personajes locales
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
 * <Icon name="character:batman" size={24} />
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

  // NUEVO: Si no es un icono válido, renderizar como emoji/texto
  const isValidIcon = iconMap[name] || iconName.startsWith('character:') || iconName.includes(':');

  if (!isValidIcon) {
    // Es un emoji antiguo o texto, renderizarlo directamente
    return (
      <span
        className={`app-icon emoji-fallback ${className}`}
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          display: 'inline-block',
          verticalAlign: 'middle',
          ...style
        }}
        {...rest}
      >
        {name}
      </span>
    );
  }

  // NUEVO: Soporte para iconos de personajes locales (SVG)
  if (iconName.startsWith('character:')) {
    const characterName = iconName.replace('character:', '');
    const characterSrc = characterIcons[characterName];

    if (characterSrc) {
      return (
        <img
          src={characterSrc}
          alt={characterName}
          width={size}
          height={size}
          className={`app-icon character-icon ${className}`}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            ...style,
          }}
          {...rest}
        />
      );
    }
    // Si no se encuentra el personaje, continuar con Iconify como fallback
  }

  // Sistema Iconify existente (SIN CAMBIOS)
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
