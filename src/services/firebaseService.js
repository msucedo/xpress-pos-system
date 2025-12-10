/**
 * Firebase Service - Barrel Export
 *
 * This file re-exports all Firebase-related functions from specialized service modules.
 * It maintains 100% backward compatibility with existing imports throughout the application.
 *
 * Original file backed up as: firebaseService.ORIGINAL.js (2,349 lines)
 * Refactored to: 11 specialized service files (~200 lines total here)
 *
 * Structure:
 * - firebase/trackingService.js - Tracking token generation
 * - firebase/ordersService.js - Orders CRUD + tracking
 * - firebase/servicesService.js - Services CRUD
 * - firebase/clientsService.js - Clients CRUD
 * - firebase/employeesService.js - Employees CRUD
 * - firebase/inventoryService.js - Inventory/Products CRUD
 * - firebase/backupService.js - Data export
 * - firebase/settingsService.js - Business profile + WhatsApp config
 * - firebase/expensesService.js - Expenses
 * - firebase/cashRegisterService.js - Cash register + closures
 * - firebase/printService.js - Print tracking
 * - firebase/promotionsService.js - Promotions system
 */

// ==================== TRACKING ====================
export { generateTrackingToken } from './firebase/trackingService';

// ==================== ORDERS ====================
export {
  getAllOrders,
  subscribeToOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getOrderByTrackingToken
} from './firebase/ordersService';

// ==================== SERVICES ====================
export {
  getAllServices,
  subscribeToServices,
  addService,
  updateService,
  canDeleteService,
  deleteService
} from './firebase/servicesService';

// ==================== CLIENTS ====================
export {
  getAllClients,
  subscribeToClients,
  findClientByPhone,
  findClientByName,
  addClient,
  updateClient,
  canDeleteClient,
  deleteClient
} from './firebase/clientsService';

// ==================== EMPLOYEES ====================
export {
  getAllEmployees,
  subscribeToEmployees,
  getAdminCount,
  getEmployeeByEmail,
  addEmployee,
  updateEmployee,
  canDeleteEmployee,
  deleteEmployee
} from './firebase/employeesService';

// ==================== INVENTORY ====================
export {
  getAllInventory,
  subscribeToInventory,
  checkBarcodeExists,
  addProduct,
  updateProduct,
  deleteProduct,
  decreaseProductStock
} from './firebase/inventoryService';

// ==================== BACKUP ====================
export { exportAllData } from './firebase/backupService';

// ==================== SETTINGS (Business Profile + WhatsApp) ====================
export {
  saveBusinessProfile,
  getBusinessProfile,
  saveWhatsAppConfig,
  getWhatsAppConfig,
  getAllSettings
} from './firebase/settingsService';

// ==================== EXPENSES ====================
export { getAllExpenses } from './firebase/expensesService';

// ==================== CASH REGISTER ====================
export {
  saveCashRegisterDraft,
  subscribeToCashRegisterDraft,
  deleteCashRegisterDraft,
  saveCashRegisterClosure,
  getAllCashRegisterClosures,
  getLastCashRegisterClosure,
  subscribeToCashRegisterClosures
} from './firebase/cashRegisterService';

// ==================== PRINT TRACKING ====================
export {
  addPrintRecord,
  hasPrintRecord,
  getPrintRecords
} from './firebase/printService';

// ==================== PROMOTIONS ====================
export {
  getAllPromotions,
  subscribeToPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions,
  validatePromotion,
  incrementPromotionUsage,
  checkPromotionUsageByClient
} from './firebase/promotionsService';

/**
 * Summary of Refactorization:
 *
 * - Original: 2,349 lines in a single file
 * - Refactored: 11 specialized files + this barrel export (~200 lines)
 * - Benefits:
 *   ✅ Easier to maintain and test
 *   ✅ Better code organization by domain
 *   ✅ 100% backward compatible (no changes needed in components)
 *   ✅ Smaller files, easier to navigate
 *   ✅ Clear separation of concerns
 *
 * Migration:
 * - All existing imports continue to work: import { addOrder } from '../services/firebaseService'
 * - No component changes required
 * - Easy rollback: rename firebaseService.ORIGINAL.js back to firebaseService.js
 */
