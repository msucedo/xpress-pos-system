// ==================== BACKUP ====================

/**
 * Export all data for backup
 * @returns {Promise<Object>} All data organized by collection
 */
export const exportAllData = async () => {
  try {
    // Import functions from other services to avoid circular dependencies
    const { getAllOrders } = await import('./ordersService');
    const { getAllServices } = await import('./servicesService');
    const { getAllClients } = await import('./clientsService');
    const { getAllEmployees } = await import('./employeesService');
    const { getAllInventory } = await import('./inventoryService');
    const { getAllSettings } = await import('./settingsService');
    const { getAllExpenses } = await import('./expensesService');
    const { getAllCashRegisterClosures } = await import('./cashRegisterService');

    const [orders, services, clients, employees, inventory, settings, expenses, cashClosures] = await Promise.all([
      getAllOrders(),
      getAllServices(),
      getAllClients(),
      getAllEmployees(),
      getAllInventory(),
      getAllSettings(),
      getAllExpenses(),
      getAllCashRegisterClosures()
    ]);

    return {
      orders,
      services,
      clients,
      employees,
      inventory,
      settings,
      expenses,
      cashClosures,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};
