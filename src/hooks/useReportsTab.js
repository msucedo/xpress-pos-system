import { useState, useEffect } from 'react';

/**
 * Hook para manejar el estado de las tabs en Reports
 * Incluye lógica para forzar filtro "Hoy" en tab de corte de caja
 * @param {string} initialTab - Tab inicial (default: 'corte')
 * @returns {Object} Tab state and handlers
 */
export const useReportsTab = (initialTab = 'corte') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewClosureDetails = (closure) => {
    setSelectedClosure(closure);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedClosure(null);
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,

    // Modal state for closure details
    selectedClosure,
    isDetailModalOpen,

    // Handlers
    handleViewClosureDetails,
    handleCloseDetailModal
  };
};
