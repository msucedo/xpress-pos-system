import { useState, useMemo, useEffect } from 'react';

/**
 * Hook genérico reutilizable para paginación de datos
 *
 * @param {Array} data - Array de datos a paginar
 * @param {number} itemsPerPage - Número de items por página
 * @returns {Object} Estado y funciones de paginación
 */
export function usePagination(data, itemsPerPage = 25) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Obtener datos de la página actual
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Resetear a página 1 cuando los datos cambien (ej: se aplica un filtro)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Ir a página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Ir a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Ir a página específica
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
}
