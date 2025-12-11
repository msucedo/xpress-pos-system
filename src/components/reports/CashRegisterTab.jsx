import CashRegister from '../CashRegister';

/**
 * Tab de Corte de Caja en Reports
 * @param {Object} props
 * @param {Array} props.filteredOrders - Órdenes filtradas por fecha
 * @param {string} props.activeFilter - Filtro activo (Hoy, Semana, Mes, Año)
 */
const CashRegisterTab = ({ filteredOrders, activeFilter }) => {
  return (
    <CashRegister
      orders={filteredOrders}
      dateFilter={activeFilter}
    />
  );
};

export default CashRegisterTab;
