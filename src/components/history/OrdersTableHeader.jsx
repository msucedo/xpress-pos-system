import FilterDropdown from './FilterDropdown';

/**
 * Header de la tabla de órdenes con 11 columnas y filtros
 */
export function OrdersTableHeader({
  filters,
  setFilters,
  openDropdown,
  setOpenDropdown,
  toggleDropdown,
  hasActiveFilter,
  clearColumnFilter,
  toggleCheckbox,
  uniqueServices,
  employees,
  dropdownRef
}) {
  return (
    <thead>
      <tr>
        {/* Order Number */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span># Orden</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('orderNumber') ? 'active' : ''}`}
              onClick={() => toggleDropdown('orderNumber')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="orderNumber"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Photo */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Foto</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('photo') ? 'active' : ''}`}
              onClick={() => toggleDropdown('photo')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="photo"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Cliente */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Cliente</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('client') ? 'active' : ''}`}
              onClick={() => toggleDropdown('client')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="client"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Fecha Creación */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Fecha Creación</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('createdDate') ? 'active' : ''}`}
              onClick={() => toggleDropdown('createdDate')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="createdDate"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Fecha Entrega */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Fecha Entrega</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('deliveryDate') ? 'active' : ''}`}
              onClick={() => toggleDropdown('deliveryDate')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="deliveryDate"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Estado Orden */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Estado Orden</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('statusOrder') ? 'active' : ''}`}
              onClick={() => toggleDropdown('statusOrder')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="statusOrder"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Servicios */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Servicios</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('services') ? 'active' : ''}`}
              onClick={() => toggleDropdown('services')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="services"
            position="left"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Total */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Total</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('total') ? 'active' : ''}`}
              onClick={() => toggleDropdown('total')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="total"
            position="right"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Estado Pago */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Estado Pago</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('paymentStatus') ? 'active' : ''}`}
              onClick={() => toggleDropdown('paymentStatus')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="paymentStatus"
            position="right"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Método de Pago */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Método de Pago</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('paymentMethod') ? 'active' : ''}`}
              onClick={() => toggleDropdown('paymentMethod')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="paymentMethod"
            position="right"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>

        {/* Autor */}
        <th className="oh-header-with-filter">
          <div className="oh-header-content">
            <span>Autor</span>
            <button
              className={`oh-filter-icon ${hasActiveFilter('author') ? 'active' : ''}`}
              onClick={() => toggleDropdown('author')}
            >
              ▼
            </button>
          </div>
          <FilterDropdown
            columnName="author"
            position="right"
            openDropdown={openDropdown}
            filters={filters}
            setFilters={setFilters}
            setOpenDropdown={setOpenDropdown}
            hasActiveFilter={hasActiveFilter}
            clearColumnFilter={clearColumnFilter}
            toggleCheckbox={toggleCheckbox}
            uniqueServices={uniqueServices}
            employees={employees}
            dropdownRef={dropdownRef}
          />
        </th>
      </tr>
    </thead>
  );
}
