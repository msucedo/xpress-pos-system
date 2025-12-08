/**
 * Constructor de datos de promoción para submit
 * Maneja la construcción correcta de datos y limpieza de campos huérfanos al editar
 */

import { deleteField } from 'firebase/firestore';

/**
 * Construye los datos base de cualquier promoción
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos base
 */
function buildBaseData(formData) {
  return {
    name: formData.name,
    description: formData.description,
    emoji: formData.emoji,
    type: formData.type,
    isActive: formData.isActive
  };
}

/**
 * Construye los datos específicos del tipo de promoción
 * y limpia campos huérfanos al editar
 * @param {Object} formData - Datos del formulario
 * @param {boolean} isEditing - Si es edición o creación
 * @returns {Object} Datos específicos del tipo
 */
function buildTypeSpecificData(formData, isEditing) {
  const data = {};
  const type = formData.type;

  // Limpiar campos huérfanos de otros tipos al editar
  if (isEditing) {
    // Campos de percentage
    if (type !== 'percentage') {
      data.appliesTo = deleteField();
      data.specificItems = deleteField();
    }

    // Campos de fixed, buyXgetY, buyXgetYdiscount (todos usan applicableItems)
    if (!['fixed', 'buyXgetY', 'buyXgetYdiscount'].includes(type)) {
      data.applicableItems = deleteField();
    }

    // Campos de buyXgetY
    if (type !== 'buyXgetY') {
      data.getQuantity = deleteField();
      // buyQuantity también lo usa buyXgetYdiscount, solo limpiar si no es ninguno de los dos
      if (type !== 'buyXgetYdiscount') {
        data.buyQuantity = deleteField();
      }
    }

    // Campos de buyXgetYdiscount
    if (type !== 'buyXgetYdiscount') {
      data.discountPercentage = deleteField();
      // buyQuantity solo limpiar si tampoco es buyXgetY
      if (type !== 'buyXgetY') {
        data.buyQuantity = deleteField();
      }
    }

    // Campos de combo
    if (type !== 'combo') {
      data.comboItems = deleteField();
      data.comboPrice = deleteField();
    }

    // Campos de specificPrice
    if (type !== 'specificPrice') {
      data.specificPrice = deleteField();
      // applicableItems también lo usan fixed, buyXgetY, buyXgetYdiscount
      if (!['fixed', 'buyXgetY', 'buyXgetYdiscount'].includes(type)) {
        data.applicableItems = deleteField();
      }
    }

    // Campo discountValue (usado por percentage, fixed, dayOfWeek)
    if (!['percentage', 'fixed', 'dayOfWeek'].includes(type)) {
      data.discountValue = deleteField();
    }
  }

  // Agregar campos específicos del tipo actual
  if (type === 'percentage' || type === 'fixed' || type === 'dayOfWeek') {
    data.discountValue = parseFloat(formData.discountValue);
  }

  if (type === 'percentage') {
    data.appliesTo = formData.appliesTo;
    if (formData.appliesTo === 'specific') {
      data.specificItems = formData.specificItems;
    }
  }

  if (type === 'fixed') {
    data.applicableItems = formData.applicableItems;
  }

  if (type === 'buyXgetY') {
    data.buyQuantity = parseInt(formData.buyQuantity);
    data.getQuantity = parseInt(formData.getQuantity);
    data.applicableItems = formData.applicableItems;
  }

  if (type === 'buyXgetYdiscount') {
    data.buyQuantity = parseInt(formData.buyQuantity);
    data.discountPercentage = parseFloat(formData.discountPercentage);
    data.applicableItems = formData.applicableItems;
  }

  if (type === 'combo') {
    data.comboItems = formData.comboItems;
    data.comboPrice = parseFloat(formData.comboPrice);
  }

  if (type === 'specificPrice') {
    data.specificPrice = parseFloat(formData.specificPrice);
    data.applicableItems = formData.applicableItems;
  }

  if (type === 'dayOfWeek') {
    data.daysOfWeek = formData.daysOfWeek;
  }

  return data;
}

/**
 * Construye las restricciones de la promoción
 * @param {Object} formData - Datos del formulario
 * @param {boolean} isEditing - Si es edición o creación
 * @returns {Object} Datos de restricciones
 */
function buildRestrictions(formData, isEditing) {
  const data = {};

  // Add day restriction (applies to all types except dayOfWeek)
  // Solo aplicar si NO es tipo dayOfWeek (que ya configuró daysOfWeek en buildTypeSpecificData)
  if (formData.type !== 'dayOfWeek') {
    if (formData.hasDayRestriction && formData.daysOfWeek.length > 0) {
      data.daysOfWeek = formData.daysOfWeek;
    } else if (isEditing) {
      // Solo usar deleteField() al editar para eliminar campo existente
      data.daysOfWeek = deleteField();
    }
    // Si es creación y no hay restricción, no incluir el campo
  }

  // Date range
  if (formData.hasDateRange && (formData.startDate || formData.endDate)) {
    data.dateRange = {
      startDate: formData.startDate || null,
      endDate: formData.endDate || null
    };
  } else if (isEditing) {
    data.dateRange = deleteField();
  }

  // Client restrictions
  data.onePerClient = formData.onePerClient;
  data.newClientsOnly = formData.newClientsOnly;

  // Max uses
  if (formData.hasMaxUses && formData.maxUses) {
    data.maxUses = parseInt(formData.maxUses);
  } else if (isEditing) {
    data.maxUses = deleteField();
  }

  // Min purchase amount
  if (formData.hasMinPurchase && formData.minPurchaseAmount) {
    data.minPurchaseAmount = parseFloat(formData.minPurchaseAmount);
  } else if (isEditing) {
    data.minPurchaseAmount = deleteField();
  }

  return data;
}

/**
 * Construye el objeto completo de datos de promoción para enviar
 * @param {Object} formData - Datos del formulario
 * @param {Object} initialData - Datos iniciales (null si es creación)
 * @returns {Object} Objeto completo listo para enviar
 */
export function buildPromotionData(formData, initialData = null) {
  const isEditing = !!initialData;

  const baseData = buildBaseData(formData);
  const typeSpecificData = buildTypeSpecificData(formData, isEditing);
  const restrictions = buildRestrictions(formData, isEditing);

  return {
    ...baseData,
    ...typeSpecificData,
    ...restrictions
  };
}
