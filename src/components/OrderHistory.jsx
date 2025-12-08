import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useOrdersData } from '../hooks/useOrdersData';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { usePagination } from '../hooks/usePagination';
import { useDropdownState } from '../hooks/useDropdownState';
import { useImageModal } from '../hooks/useImageModal';
import { combineAndSortOrders, extractUniqueServices } from '../utils/orders/orderHelpers';
import { ITEMS_PER_PAGE } from '../utils/history/filterConstants';
import OrderHistorySkeleton from './OrderHistorySkeleton';
import { EmptyState } from './history/EmptyState';
import { FilterControlsBar } from './history/FilterControlsBar';
import { OrdersTable } from './history/OrdersTable';
import { ImagePreviewModal } from './history/ImagePreviewModal';
import './OrderHistory.css';

/**
 * Componente de histórico de órdenes refactorizado
 * Componente orquestador que usa hooks personalizados y componentes modulares
 */
const OrderHistory = () => {
  // Hooks de datos
  const { orders, employees, loading } = useOrdersData();

  // Combinar y ordenar todas las órdenes
  const allOrders = useMemo(() => combineAndSortOrders(orders), [orders]);

  // Extraer servicios únicos para filtros
  const uniqueServices = useMemo(() => extractUniqueServices(allOrders), [allOrders]);

  // Hooks de filtros
  const {
    filters,
    setFilters,
    filteredOrders,
    activeFiltersCount,
    handleClearFilters,
    clearColumnFilter,
    toggleCheckbox,
    hasActiveFilter
  } = useOrderFilters(allOrders, employees);

  // Hook de paginación
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedOrders,
    goToNextPage,
    goToPreviousPage
  } = usePagination(filteredOrders, ITEMS_PER_PAGE);

  // Hook de dropdown
  const {
    openDropdown,
    setOpenDropdown,
    toggleDropdown,
    dropdownRef
  } = useDropdownState();

  // Hook de preview de imagen (REUTILIZADO)
  const {
    selectedImage,
    openImageModal,
    closeImageModal
  } = useImageModal();

  // Loading state
  if (loading) {
    return <OrderHistorySkeleton />;
  }

  // Empty state
  if (allOrders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="order-history">
      {/* Filter Controls Bar */}
      <FilterControlsBar
        currentCount={paginatedOrders.length}
        totalCount={filteredOrders.length}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />

      {/* Orders Table */}
      <OrdersTable
        paginatedOrders={paginatedOrders}
        employees={employees}
        filters={filters}
        setFilters={setFilters}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        toggleDropdown={toggleDropdown}
        hasActiveFilter={hasActiveFilter}
        clearColumnFilter={clearColumnFilter}
        toggleCheckbox={toggleCheckbox}
        uniqueServices={uniqueServices}
        dropdownRef={dropdownRef}
        onImageClick={openImageModal}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={selectedImage}
        onClose={closeImageModal}
      />
    </div>
  );
};

OrderHistory.propTypes = {};

export default OrderHistory;
