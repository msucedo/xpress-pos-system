import { useState } from 'react';
import PropTypes from 'prop-types';
import IconPickerModal from './IconPickerModal';
import { Icon } from '../../icons';
import './IconPickerButton.css';

/**
 * Botón de selección de icono con modal
 * Reemplaza el input text de emoji en formularios
 *
 * @param {string} label - Label del campo
 * @param {string} value - Valor actual (nombre del icono)
 * @param {function} onChange - Callback cuando se selecciona un icono
 * @param {string} category - Categoría inicial del modal (opcional)
 * @param {boolean} required - Si el campo es requerido
 * @param {string} error - Mensaje de error (opcional)
 * @param {string} placeholder - Placeholder cuando no hay icono seleccionado
 */
const IconPickerButton = ({
  label,
  value = '',
  onChange,
  category = 'all',
  required = false,
  error = '',
  placeholder = 'Seleccionar icono'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectIcon = (iconName) => {
    onChange(iconName);
  };

  return (
    <div className="icon-picker-field">
      {/* Label */}
      {label && (
        <label className="icon-picker-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}

      {/* Botón principal */}
      <div className={`icon-picker-button-wrapper ${error ? 'error' : ''}`}>
        <button
          type="button"
          className="icon-picker-button"
          onClick={handleOpenModal}
        >
          {/* Preview del icono o placeholder */}
          <div className="icon-picker-preview">
            {value ? (
              <>
                <Icon name={value} size={32} />
                <span className="icon-picker-value">{value}</span>
              </>
            ) : (
              <span className="icon-picker-placeholder">{placeholder}</span>
            )}
          </div>

          {/* Botón de abrir modal */}
          <div className="icon-picker-trigger">
            <Icon name="search" size={18} />
          </div>
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <span className="icon-picker-error">{error}</span>}

      {/* Modal de selección */}
      <IconPickerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectIcon={handleSelectIcon}
        selectedIcon={value}
        category={category}
      />
    </div>
  );
};

IconPickerButton.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  category: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  placeholder: PropTypes.string
};

export default IconPickerButton;
