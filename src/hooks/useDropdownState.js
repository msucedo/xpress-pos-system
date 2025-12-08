import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para manejar estado de dropdown con click outside detection
 *
 * @returns {Object} Estado y funciones de dropdown
 */
export function useDropdownState() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = useCallback((columnName) => {
    setOpenDropdown(prev => prev === columnName ? null : columnName);
  }, []);

  // Click outside handler con lógica especial para date pickers
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Para dropdowns de fecha, permitir libertad para que funcione el date picker nativo
      const isDateDropdown = openDropdown === 'createdDate' || openDropdown === 'deliveryDate';

      if (isDateDropdown) {
        // Solo cerrar si se hace clic en otro ícono de filtro o fuera de la tabla
        const clickedOnTable = event.target.closest('.oh-table');
        const clickedOnFilterIcon = event.target.closest('.oh-filter-icon');

        if (!clickedOnTable || clickedOnFilterIcon) {
          setOpenDropdown(null);
        }
        return;
      }

      // Para otros dropdowns, comportamiento normal
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return {
    openDropdown,
    setOpenDropdown,
    toggleDropdown,
    dropdownRef
  };
}
