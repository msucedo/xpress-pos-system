import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../icons';
import './OrderStatusDropdown.css';

/**
 * Componente dropdown personalizado para seleccionar el estado de una orden
 * Permite renderizar iconos de Iconify junto con los estados
 */
const OrderStatusDropdown = ({ value, onChange, options = [], disabled = false, placeholder = 'Seleccionar estado' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Encontrar el estado seleccionado
  const selectedStatus = options.find(opt => opt.value === value);

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

  const handleSelect = (statusValue) => {
    // Crear un evento sintético que simula el evento onChange de un select nativo
    const syntheticEvent = {
      target: {
        value: statusValue
      }
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`order-status-dropdown ${disabled ? 'order-status-dropdown-disabled' : ''}`}
    >
      <button
        type="button"
        className={`order-status-dropdown-button status-${value}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        {selectedStatus ? (
          <span className="order-status-dropdown-selected">
            {selectedStatus.icon && <Icon name={selectedStatus.icon} size={16} />}
            <span className="order-status-dropdown-label">{selectedStatus.label}</span>
          </span>
        ) : (
          <span className="order-status-dropdown-placeholder">{placeholder}</span>
        )}
        <span className={`order-status-dropdown-arrow ${isOpen ? 'order-status-dropdown-arrow-open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="order-status-dropdown-menu">
          {options.map(option => (
            <div
              key={option.value}
              className={`order-status-dropdown-option status-${option.value} ${value === option.value ? 'order-status-dropdown-option-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && <Icon name={option.icon} size={16} />}
              <span className="order-status-dropdown-option-text">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusDropdown;
