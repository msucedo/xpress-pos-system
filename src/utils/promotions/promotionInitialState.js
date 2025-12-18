/**
 * Estados iniciales para formulario de promociones
 */

// Estado inicial del formulario
export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  emoji: 'celebration',
  type: 'percentage',
  isActive: true,
  discountValue: '',
  appliesTo: 'all',
  specificItems: [],
  buyQuantity: 2,
  getQuantity: 1,
  discountPercentage: '',
  applicableItems: [],
  comboItems: [],
  comboPrice: '',
  specificPrice: '',
  daysOfWeek: [],
  // Restrictions
  hasDateRange: false,
  startDate: '',
  endDate: '',
  onePerClient: false,
  newClientsOnly: false,
  hasMaxUses: false,
  maxUses: '',
  hasMinPurchase: false,
  minPurchaseAmount: '',
  hasDayRestriction: false
};

/**
 * Convierte datos iniciales de edición a formato de formulario
 * @param {Object} initialData - Datos de la promoción existente
 * @returns {Object} Datos en formato de formulario
 */
export function loadInitialData(initialData) {
  if (!initialData) {
    return INITIAL_FORM_STATE;
  }

  return {
    name: initialData.name || '',
    description: initialData.description || '',
    emoji: initialData.emoji || 'celebration',
    type: initialData.type || 'percentage',
    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
    discountValue: initialData.discountValue || '',
    appliesTo: initialData.appliesTo || 'all',
    specificItems: initialData.specificItems || [],
    buyQuantity: initialData.buyQuantity || 2,
    getQuantity: initialData.getQuantity || 1,
    discountPercentage: initialData.discountPercentage || '',
    applicableItems: initialData.applicableItems || [],
    comboItems: (initialData.comboItems || []).map(ci => ({
      ...ci,
      quantity: ci.quantity || 1 // Compatibilidad con combos antiguos sin quantity
    })),
    comboPrice: initialData.comboPrice || '',
    specificPrice: initialData.specificPrice || '',
    daysOfWeek: initialData.daysOfWeek || [],
    // Restrictions
    hasDateRange: !!(initialData.dateRange?.startDate || initialData.dateRange?.endDate),
    startDate: initialData.dateRange?.startDate || '',
    endDate: initialData.dateRange?.endDate || '',
    onePerClient: initialData.onePerClient || false,
    newClientsOnly: initialData.newClientsOnly || false,
    hasMaxUses: !!initialData.maxUses,
    maxUses: initialData.maxUses || '',
    hasMinPurchase: !!initialData.minPurchaseAmount,
    minPurchaseAmount: initialData.minPurchaseAmount || '',
    hasDayRestriction: !!(initialData.daysOfWeek && initialData.daysOfWeek.length > 0 && initialData.type !== 'dayOfWeek')
  };
}
