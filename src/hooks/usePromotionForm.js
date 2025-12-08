import { useState, useEffect, useCallback } from 'react';
import { INITIAL_FORM_STATE, loadInitialData } from '../utils/promotions/promotionInitialState';

/**
 * Hook para manejar el estado del formulario de promoción
 * @param {Object} initialData - Datos iniciales para edición (null si es creación)
 * @returns {Object} Estado y handlers del formulario
 */
export function usePromotionForm(initialData = null) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales cuando se monta o cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData(loadInitialData(initialData));
    }
  }, [initialData]);

  /**
   * Maneja cambios en inputs del formulario
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  /**
   * Maneja toggle de días de la semana
   */
  const handleDayToggle = useCallback((day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  }, []);

  /**
   * Maneja toggle de items (checkboxes)
   */
  const handleItemToggle = useCallback((itemId, field) => {
    setFormData(prev => {
      const currentItems = prev[field] || [];
      const newItems = currentItems.includes(itemId)
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId];

      return { ...prev, [field]: newItems };
    });

    // Limpiar error al hacer una selección
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  /**
   * Maneja toggle de items de combo (con información completa)
   */
  const handleComboItemToggle = useCallback((item) => {
    setFormData(prev => {
      const isSelected = prev.comboItems.some(ci => ci.id === item.id);

      if (isSelected) {
        return {
          ...prev,
          comboItems: prev.comboItems.filter(ci => ci.id !== item.id)
        };
      } else {
        return {
          ...prev,
          comboItems: [...prev.comboItems, {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
          }]
        };
      }
    });
  }, []);

  /**
   * Actualiza la cantidad de un item en el combo
   */
  const handleComboItemQuantityChange = useCallback((itemId, quantity) => {
    setFormData(prev => ({
      ...prev,
      comboItems: prev.comboItems.map(ci =>
        ci.id === itemId ? { ...ci, quantity: parseInt(quantity) || 1 } : ci
      )
    }));
  }, []);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleDayToggle,
    handleItemToggle,
    handleComboItemToggle,
    handleComboItemQuantityChange
  };
}
