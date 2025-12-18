import { useState, useRef, useEffect } from 'react';
import { Icon } from '../icons';
import './AuthorSelect.css';

/**
 * Componente dropdown personalizado para seleccionar un autor/empleado
 * Permite renderizar iconos de Iconify junto con nombres de empleados
 */
const AuthorSelect = ({ value, onChange, employees = [], disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Encontrar el empleado seleccionado
  const selectedEmployee = employees.find(emp => emp.id === value);

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

  const handleSelect = (employeeId) => {
    // Crear un evento sintético que simula el evento onChange de un select nativo
    const syntheticEvent = {
      target: {
        value: employeeId
      }
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`author-select ${disabled ? 'author-select-disabled' : ''}`}
    >
      <button
        type="button"
        className="author-select-button"
        onClick={handleToggle}
        disabled={disabled}
      >
        {selectedEmployee ? (
          <span className="author-select-selected">
            {selectedEmployee.emoji && <Icon name={selectedEmployee.emoji} size={16} />}
            <span className="author-select-name">{selectedEmployee.name}</span>
          </span>
        ) : (
          <span className="author-select-placeholder">Sin autor</span>
        )}
        <span className={`author-select-arrow ${isOpen ? 'author-select-arrow-open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="author-select-dropdown">
          <div
            className="author-select-option"
            onClick={() => handleSelect('')}
          >
            <span className="author-select-option-text">Sin autor</span>
          </div>
          {employees.map(employee => (
            <div
              key={employee.id}
              className={`author-select-option ${value === employee.id ? 'author-select-option-selected' : ''}`}
              onClick={() => handleSelect(employee.id)}
            >
              {employee.emoji && <Icon name={employee.emoji} size={16} />}
              <span className="author-select-option-text">{employee.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorSelect;
