import { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import CashRegisterTab from '../components/reports/CashRegisterTab';
import HistoryTab from '../components/reports/HistoryTab';
import ChartsTab from '../components/reports/ChartsTab';
import { useReportsData } from '../hooks/useReportsData';
import { useReportsFilters } from '../hooks/useReportsFilters';
import { useReportsTab } from '../hooks/useReportsTab';
import './Reports.css';
import '../components/CashRegister.css';

/**
 * Página de Reportes y Corte de Caja
 * Orchestrador que compone hooks y componentes especializados
 */
const Reports = () => {
  // Data subscriptions
  const { orders, todayDraft, closures } = useReportsData();

  // Tab management
  const {
    activeTab,
    setActiveTab,
    selectedClosure,
    isDetailModalOpen,
    handleViewClosureDetails,
    handleCloseDetailModal
  } = useReportsTab();

  // Filters management
  const {
    activeFilter,
    dateFilters,
    handleFilterChange,
    filteredOrders,
    filteredExpenses,
    filteredClosures,
    isTodayInRange,
    hasDraftData,
    getExpensesFromClosures
  } = useReportsFilters({ orders, todayDraft, closures, activeTab });

  // Forzar filtro "Hoy" cuando se entra a la tab "Corte de Caja"
  useEffect(() => {
    if (activeTab === 'corte') {
      handleFilterChange('Hoy');
    }
  }, [activeTab, handleFilterChange]);

  return (
    <div className="reports-page">
      {/* Header */}
      <PageHeader
        title="Reportes y Corte de Caja"
        filters={
          activeTab === 'reportes'
            ? dateFilters.map((filter) => ({
                label: filter,
                onClick: () => handleFilterChange(filter),
                active: activeFilter === filter
              }))
            : [] // Ocultar filtros en tabs "corte" e "historial"
        }
        tabs={
          <div className="reports-tabs">
            {/* Select para móvil (oculto en desktop por CSS) */}
            <select
              className="reports-tab-select-mobile"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="reportes">📊 Reportes</option>
              <option value="corte">💰 Corte de Caja</option>
              <option value="historial-cortes">📋 Historial de Cortes</option>
              <option value="historial-ordenes">📦 Historial de Órdenes</option>
            </select>

            {/* Botones para desktop/tablet (ocultos en móvil por CSS) */}
            <button
              className={`reports-tab ${activeTab === 'reportes' ? 'active' : ''}`}
              onClick={() => setActiveTab('reportes')}
            >
              📊 Reportes
            </button>
            <button
              className={`reports-tab ${activeTab === 'corte' ? 'active' : ''}`}
              onClick={() => setActiveTab('corte')}
            >
              💰 Corte de Caja
            </button>
            <button
              className={`reports-tab ${activeTab === 'historial-cortes' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial-cortes')}
            >
              📋 Historial de Cortes
            </button>
            <button
              className={`reports-tab ${activeTab === 'historial-ordenes' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial-ordenes')}
            >
              📦 Historial de Órdenes
            </button>
          </div>
        }
      />

      {/* Tab Content */}
      {activeTab === 'reportes' && (
        <ChartsTab
          orders={orders}
          todayDraft={todayDraft}
          closures={closures}
          filteredOrders={filteredOrders}
          filteredExpenses={filteredExpenses}
          filteredClosures={filteredClosures}
          activeFilter={activeFilter}
          isTodayInRange={isTodayInRange}
          hasDraftData={hasDraftData}
          getExpensesFromClosures={getExpensesFromClosures}
        />
      )}

      {activeTab === 'corte' && (
        <CashRegisterTab
          filteredOrders={filteredOrders}
          activeFilter={activeFilter}
        />
      )}

      {(activeTab === 'historial-cortes' || activeTab === 'historial-ordenes') && (
        <HistoryTab
          activeTab={activeTab}
          selectedClosure={selectedClosure}
          isDetailModalOpen={isDetailModalOpen}
          onViewDetails={handleViewClosureDetails}
          onCloseModal={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default Reports;
