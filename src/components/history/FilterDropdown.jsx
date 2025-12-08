import { memo } from 'react';
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../utils/history/filterConstants';

/**
 * Componente de dropdown de filtros para OrderHistory
 * Memoizado para prevenir re-renders innecesarios
 */
const FilterDropdown = memo(({
  columnName,
  position = 'left',
  openDropdown,
  filters,
  setFilters,
  setOpenDropdown,
  hasActiveFilter,
  clearColumnFilter,
  toggleCheckbox,
  uniqueServices,
  employees,
  dropdownRef
}) => {
  if (openDropdown !== columnName) return null;

  const renderContent = () => {
    switch (columnName) {
      case 'orderNumber':
        return (
          <div className="oh-dropdown-content">
            <input
              type="text"
              className="oh-dropdown-input"
              placeholder="Buscar # orden..."
              value={filters.orderNumber}
              onChange={(e) => setFilters(prev => ({ ...prev, orderNumber: e.target.value }))}
              autoFocus
            />
          </div>
        );

      case 'photo':
        return (
          <div className="oh-dropdown-content">
            <label className="oh-dropdown-radio">
              <input
                type="radio"
                name="photo"
                value="all"
                checked={filters.photo === 'all'}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, photo: e.target.value }));
                  setOpenDropdown(null);
                }}
              />
              <span>Todas</span>
            </label>
            <label className="oh-dropdown-radio">
              <input
                type="radio"
                name="photo"
                value="with"
                checked={filters.photo === 'with'}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, photo: e.target.value }));
                  setOpenDropdown(null);
                }}
              />
              <span>Con foto</span>
            </label>
            <label className="oh-dropdown-radio">
              <input
                type="radio"
                name="photo"
                value="without"
                checked={filters.photo === 'without'}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, photo: e.target.value }));
                  setOpenDropdown(null);
                }}
              />
              <span>Sin foto</span>
            </label>
          </div>
        );

      case 'client':
        return (
          <div className="oh-dropdown-content">
            <input
              type="text"
              className="oh-dropdown-input"
              placeholder="Buscar cliente..."
              value={filters.client}
              onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
              autoFocus
            />
          </div>
        );

      case 'createdDate':
        return (
          <div className="oh-dropdown-content">
            <label className="oh-dropdown-label">Desde:</label>
            <input
              type="date"
              className="oh-dropdown-input"
              value={filters.createdDateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, createdDateFrom: e.target.value }))}
            />
            <label className="oh-dropdown-label">Hasta:</label>
            <input
              type="date"
              className="oh-dropdown-input"
              value={filters.createdDateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, createdDateTo: e.target.value }))}
            />
          </div>
        );

      case 'deliveryDate':
        return (
          <div className="oh-dropdown-content">
            <label className="oh-dropdown-label">Desde:</label>
            <input
              type="date"
              className="oh-dropdown-input"
              value={filters.deliveryDateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, deliveryDateFrom: e.target.value }))}
            />
            <label className="oh-dropdown-label">Hasta:</label>
            <input
              type="date"
              className="oh-dropdown-input"
              value={filters.deliveryDateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, deliveryDateTo: e.target.value }))}
            />
          </div>
        );

      case 'statusOrder':
        return (
          <div className="oh-dropdown-content oh-dropdown-checkboxes">
            {STATUS_OPTIONS.map((status) => (
              <label key={status.value} className="oh-dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={filters.statusOrder.includes(status.value)}
                  onChange={() => toggleCheckbox('statusOrder', status.value)}
                />
                <span>{status.label}</span>
              </label>
            ))}
          </div>
        );

      case 'services':
        return (
          <div className="oh-dropdown-content oh-dropdown-checkboxes">
            {uniqueServices.length > 0 ? (
              uniqueServices.map((service) => (
                <label key={service.name} className="oh-dropdown-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service.name)}
                    onChange={() => toggleCheckbox('services', service.name)}
                  />
                  <span>{service.icon} {service.name}</span>
                </label>
              ))
            ) : (
              <div className="oh-dropdown-empty">No hay servicios</div>
            )}
          </div>
        );

      case 'total':
        return (
          <div className="oh-dropdown-content">
            <label className="oh-dropdown-label">Mínimo:</label>
            <input
              type="number"
              className="oh-dropdown-input"
              placeholder="Ej: 100"
              value={filters.totalMin}
              onChange={(e) => setFilters(prev => ({ ...prev, totalMin: e.target.value }))}
            />
            <label className="oh-dropdown-label">Máximo:</label>
            <input
              type="number"
              className="oh-dropdown-input"
              placeholder="Ej: 1000"
              value={filters.totalMax}
              onChange={(e) => setFilters(prev => ({ ...prev, totalMax: e.target.value }))}
            />
          </div>
        );

      case 'paymentStatus':
        return (
          <div className="oh-dropdown-content oh-dropdown-checkboxes">
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <label key={status.value} className="oh-dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paymentStatus.includes(status.value)}
                  onChange={() => toggleCheckbox('paymentStatus', status.value)}
                />
                <span>{status.label}</span>
              </label>
            ))}
          </div>
        );

      case 'paymentMethod':
        return (
          <div className="oh-dropdown-content oh-dropdown-checkboxes">
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <label key={method.value} className="oh-dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paymentMethod.includes(method.value)}
                  onChange={() => toggleCheckbox('paymentMethod', method.value)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        );

      case 'author':
        return (
          <div className="oh-dropdown-content oh-dropdown-checkboxes">
            <label className="oh-dropdown-checkbox">
              <input
                type="checkbox"
                checked={filters.author.includes('no-author')}
                onChange={() => toggleCheckbox('author', 'no-author')}
              />
              <span>N/A</span>
            </label>
            {employees.map((employee) => (
              <label key={employee.id} className="oh-dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={filters.author.includes(employee.id)}
                  onChange={() => toggleCheckbox('author', employee.id)}
                />
                <span>{employee.emoji ? `${employee.emoji} ` : ''}{employee.name}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`oh-filter-dropdown ${position === 'right' ? 'oh-filter-dropdown-right' : ''}`}
    >
      {renderContent()}
      {hasActiveFilter(columnName) && (
        <button
          className="oh-dropdown-clear"
          onClick={() => clearColumnFilter(columnName)}
        >
          Limpiar filtro
        </button>
      )}
    </div>
  );
});

FilterDropdown.displayName = 'FilterDropdown';

export default FilterDropdown;
