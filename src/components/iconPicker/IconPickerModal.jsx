import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimatedModal from '../animated/AnimatedModal';
import IconCategories, { ICON_CATEGORIES } from './IconCategories';
import IconGrid from './IconGrid';
import { Icon } from '../../icons';
import './IconPickerModal.css';

/**
 * Modal de selección de iconos con búsqueda y categorías
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Callback para cerrar el modal
 * @param {function} onSelectIcon - Callback cuando se selecciona un icono
 * @param {string} selectedIcon - Icono seleccionado actualmente
 * @param {string} category - Categoría inicial a mostrar (opcional)
 */
const IconPickerModal = ({
  isOpen,
  onClose,
  onSelectIcon,
  selectedIcon = '',
  category = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [tempSelectedIcon, setTempSelectedIcon] = useState(selectedIcon);

  // Resetear estado cuando se abre el modal
  const handleModalOpen = useCallback(() => {
    setSelectedCategory(category);
    setTempSelectedIcon(selectedIcon);
  }, [category, selectedIcon]);

  // Cambiar categoría
  const handleCategoryChange = useCallback((newCategory) => {
    setSelectedCategory(newCategory);
  }, []);

  // Selección temporal de icono (sin cerrar modal)
  const handleIconClick = useCallback((iconName) => {
    setTempSelectedIcon(iconName);
  }, []);

  // Confirmar selección y cerrar modal
  const handleConfirm = useCallback(() => {
    if (tempSelectedIcon) {
      onSelectIcon(tempSelectedIcon);
      onClose();
    }
  }, [tempSelectedIcon, onSelectIcon, onClose]);

  // Cancelar y cerrar modal
  const handleCancel = useCallback(() => {
    setTempSelectedIcon(selectedIcon);
    onClose();
  }, [selectedIcon, onClose]);

  // Limpiar selección
  const handleClear = useCallback(() => {
    setTempSelectedIcon('');
  }, []);

  // Obtener iconos filtrados por categoría
  const categoryIcons = useMemo(() => {
    return ICON_CATEGORIES[selectedCategory]?.icons || [];
  }, [selectedCategory]);

  // Header personalizado con preview del icono seleccionado
  const headerContent = (
    <div className="icon-picker-header">
      <h2 className="modal-title">Seleccionar Icono</h2>
      {/* Preview del icono seleccionado */}
      {tempSelectedIcon && (
        <div className="icon-preview-section">
          <div className="icon-preview-box">
            <Icon name={tempSelectedIcon} size={48} />
          </div>
          <div className="icon-preview-info">
            <span className="icon-preview-label">Seleccionado:</span>
            <strong className="icon-preview-name">{tempSelectedIcon}</strong>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleCancel}
      headerContent={headerContent}
      size="large"
      disableScrollLock={true}
    >
      <div className="icon-picker-content">
        {/* Categorías */}
        <IconCategories
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Grid de iconos */}
        <div className="icon-grid-container">
          <IconGrid
            icons={categoryIcons}
            selectedIcon={tempSelectedIcon}
            onIconSelect={handleIconClick}
          />
        </div>

        {/* Botones de acción */}
        <div className="icon-picker-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!tempSelectedIcon}
          >
            Confirmar
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};

IconPickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectIcon: PropTypes.func.isRequired,
  selectedIcon: PropTypes.string,
  category: PropTypes.string
};

export default IconPickerModal;
