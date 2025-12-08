/**
 * Barra de controles de filtros y paginación para OrderHistory
 */
export function FilterControlsBar({
  currentCount,
  totalCount,
  activeFiltersCount,
  onClearFilters,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage
}) {
  return (
    <div className="oh-filter-controls-bar">
      <div className="oh-left-controls">
        <div className="oh-results-count">
          Mostrando {currentCount} de {totalCount} {totalCount === 1 ? 'orden' : 'órdenes'}
        </div>
        {activeFiltersCount > 0 && (
          <button
            className="oh-clear-filters-btn"
            onClick={onClearFilters}
            title="Limpiar todos los filtros"
          >
            Limpiar Filtros ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="oh-pagination-controls">
          <button
            className="oh-pagination-btn"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            title="Página anterior"
          >
            ←
          </button>
          <span className="oh-pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="oh-pagination-btn"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            title="Página siguiente"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
