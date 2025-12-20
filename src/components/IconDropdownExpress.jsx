import { useState, useRef, useEffect } from 'react';
import { Icon } from '../icons';
import './IconDropdownExpress.css';

/**
 * Componente dropdown genérico con iconos para Xpress POS
 * Permite renderizar iconos de Iconify junto con las opciones
 *
 * @param {string} value - Valor seleccionado actual
 * @param {function} onChange - Callback cuando se selecciona una opción
 * @param {Array} options - Array de opciones [{value, label, icon}]
 * @param {boolean} disabled - Si el dropdown está deshabilitado
 * @param {string} placeholder - Texto cuando no hay selección
 * @param {string} buttonIcon - Icono del botón principal (por defecto 'settings')
 */
const IconDropdownExpress = ({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = 'Seleccionar',
  buttonIcon = 'settings'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Encontrar la opción seleccionada
  const selectedOption = options.find(opt => opt.value === value);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    // Crear un evento sintético que simula el evento onChange
    const syntheticEvent = {
      target: {
        value: optionValue
      }
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`icon-dropdown-express ${disabled ? 'icon-dropdown-express-disabled' : ''}`}
    >
      <button
        type="button"
        className="icon-dropdown-express-button"
        onClick={handleToggle}
        disabled={disabled}
      >
        <Icon name={buttonIcon} size={20} />
      </button>

      {isOpen && (
        <div className="icon-dropdown-express-menu">
          {options.map(option => (
            <div
              key={option.value}
              className={`icon-dropdown-express-option ${value === option.value ? 'icon-dropdown-express-option-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && <Icon name={option.icon} size={16} />}
              <span className="icon-dropdown-express-option-text">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconDropdownExpress;
