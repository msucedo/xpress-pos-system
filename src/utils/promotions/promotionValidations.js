/**
 * Validaciones para formulario de promociones
 */

/**
 * Valida información básica de la promoción
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Objeto con errores encontrados
 */
export function validateBasicInfo(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!formData.description.trim()) {
    errors.description = 'La descripción es requerida';
  }

  return errors;
}

/**
 * Valida promoción de tipo porcentaje
 * @param {Object} formData
 * @returns {Object}
 */
export function validatePercentagePromotion(formData) {
  const errors = {};

  if (!formData.discountValue || formData.discountValue <= 0 || formData.discountValue > 100) {
    errors.discountValue = 'El porcentaje debe estar entre 1 y 100';
  }

  // Validar que percentage con 'specific' tenga items seleccionados
  if (formData.appliesTo === 'specific') {
    if (!formData.specificItems || formData.specificItems.length === 0) {
      errors.specificItems = 'Debes seleccionar al menos un item';
    }
  }

  return errors;
}

/**
 * Valida promoción de tipo descuento fijo
 * @param {Object} formData
 * @returns {Object}
 */
export function validateFixedPromotion(formData) {
  const errors = {};

  if (!formData.discountValue || formData.discountValue <= 0) {
    errors.discountValue = 'El descuento debe ser mayor a 0';
  }

  return errors;
}

/**
 * Valida promoción de tipo compra X lleva Y
 * @param {Object} formData
 * @returns {Object}
 */
export function validateBuyXGetY(formData) {
  const errors = {};

  if (!formData.buyQuantity || formData.buyQuantity < 1) {
    errors.buyQuantity = 'Cantidad de compra inválida';
  }

  if (!formData.getQuantity || formData.getQuantity < 1) {
    errors.getQuantity = 'Cantidad gratis inválida';
  }

  return errors;
}

/**
 * Valida promoción de tipo compra X con descuento en Y
 * @param {Object} formData
 * @returns {Object}
 */
export function validateBuyXGetYDiscount(formData) {
  const errors = {};

  if (!formData.buyQuantity || formData.buyQuantity < 2) {
    errors.buyQuantity = 'Mínimo 2 items requeridos';
  }

  if (!formData.discountPercentage || formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
    errors.discountPercentage = 'El descuento debe estar entre 1 y 100%';
  }

  return errors;
}

/**
 * Valida promoción de tipo combo
 * @param {Object} formData
 * @returns {Object}
 */
export function validateComboPromotion(formData) {
  const errors = {};

  if (!formData.comboPrice || formData.comboPrice <= 0) {
    errors.comboPrice = 'El precio del combo es requerido';
  }

  if (formData.comboItems.length < 2) {
    errors.comboItems = 'Selecciona al menos 2 items para el combo';
  }

  return errors;
}

/**
 * Valida promoción de tipo precio específico
 * @param {Object} formData
 * @returns {Object}
 */
export function validateSpecificPrice(formData) {
  const errors = {};

  if (!formData.specificPrice || formData.specificPrice <= 0) {
    errors.specificPrice = 'El precio específico debe ser mayor a 0';
  }

  if (!formData.applicableItems || formData.applicableItems.length === 0) {
    errors.applicableItems = 'Debes seleccionar al menos un producto';
  }

  return errors;
}

/**
 * Valida promoción de tipo día de semana
 * @param {Object} formData
 * @returns {Object}
 */
export function validateDayOfWeek(formData) {
  const errors = {};

  if (!formData.discountValue || formData.discountValue <= 0 || formData.discountValue > 100) {
    errors.discountValue = 'El porcentaje debe estar entre 1 y 100';
  }

  if (formData.daysOfWeek.length === 0) {
    errors.daysOfWeek = 'Selecciona al menos un día';
  }

  return errors;
}

/**
 * Valida restricciones de la promoción
 * @param {Object} formData
 * @returns {Object}
 */
export function validateRestrictions(formData) {
  const errors = {};

  // Validate day restriction (applies to all types except dayOfWeek)
  if (formData.type !== 'dayOfWeek' && formData.hasDayRestriction && formData.daysOfWeek.length === 0) {
    errors.daysOfWeek = 'Selecciona al menos un día válido';
  }

  // Validate date range restriction
  if (formData.hasDateRange) {
    if (!formData.startDate && !formData.endDate) {
      errors.dateRange = 'Debes especificar al menos una fecha (inicio o fin)';
    } else if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.dateRange = 'La fecha de inicio no puede ser posterior a la fecha fin';
    }
  }

  // Validate max uses restriction
  if (formData.hasMaxUses) {
    if (!formData.maxUses || formData.maxUses <= 0) {
      errors.maxUses = 'El número de usos debe ser mayor a 0';
    }
  }

  // Validate min purchase restriction
  if (formData.hasMinPurchase) {
    if (!formData.minPurchaseAmount || formData.minPurchaseAmount <= 0) {
      errors.minPurchaseAmount = 'El monto mínimo debe ser mayor a 0';
    }
  }

  return errors;
}

/**
 * Valida todo el formulario según el tipo de promoción
 * @param {Object} formData - Datos completos del formulario
 * @returns {Object} Objeto con todos los errores encontrados
 */
export function validateForm(formData) {
  let errors = {};

  // Validar información básica
  errors = { ...errors, ...validateBasicInfo(formData) };

  // Validar según tipo de promoción
  switch (formData.type) {
    case 'percentage':
      errors = { ...errors, ...validatePercentagePromotion(formData) };
      break;
    case 'fixed':
      errors = { ...errors, ...validateFixedPromotion(formData) };
      break;
    case 'buyXgetY':
      errors = { ...errors, ...validateBuyXGetY(formData) };
      break;
    case 'buyXgetYdiscount':
      errors = { ...errors, ...validateBuyXGetYDiscount(formData) };
      break;
    case 'combo':
      errors = { ...errors, ...validateComboPromotion(formData) };
      break;
    case 'specificPrice':
      errors = { ...errors, ...validateSpecificPrice(formData) };
      break;
    case 'dayOfWeek':
      errors = { ...errors, ...validateDayOfWeek(formData) };
      break;
    default:
      break;
  }

  // Validar restricciones
  errors = { ...errors, ...validateRestrictions(formData) };

  return errors;
}
