import { OrdersTableHeader } from './OrdersTableHeader';
import { OrderRow } from './OrderRow';

/**
 * Tabla completa de órdenes con header y filas
 */
export function OrdersTable({
  paginatedOrders,
  employees,
  filters,
  setFilters,
  openDropdown,
  setOpenDropdown,
  toggleDropdown,
  hasActiveFilter,
  clearColumnFilter,
  toggleCheckbox,
  uniqueServices,
  dropdownRef,
  onImageClick
}) {
  return (
    <div className="oh-table-wrapper">
      <table className="oh-table">
        <OrdersTableHeader
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          toggleDropdown={toggleDropdown}
          hasActiveFilter={hasActiveFilter}
          clearColumnFilter={clearColumnFilter}
          toggleCheckbox={toggleCheckbox}
          uniqueServices={uniqueServices}
          employees={employees}
          dropdownRef={dropdownRef}
        />
        <tbody>
          {paginatedOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              employees={employees}
              onImageClick={onImageClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
