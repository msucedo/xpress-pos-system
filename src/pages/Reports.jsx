import { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import CashRegisterTab from '../components/reports/CashRegisterTab';
import HistoryTab from '../components/reports/HistoryTab';
import ChartsTab from '../components/reports/ChartsTab';
import { useReportsData } from '../hooks/useReportsData';
import { useReportsFilters } from '../hooks/useReportsFilters';
import { useReportsTab } from '../hooks/useReportsTab';
import { AnimatedTabs } from '../components/animated';
import { Icon } from '../icons';
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

  // Preparar tabs para AnimatedTabs
  const tabs = [
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <Icon name="chart" size={20} />,
      content: (
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
      ),
    },
    {
      id: 'corte',
      label: 'Corte de Caja',
      icon: <Icon name="money" size={20} />,
      content: (
        <CashRegisterTab
          filteredOrders={filteredOrders}
          activeFilter={activeFilter}
        />
      ),
    },
    {
      id: 'historial-cortes',
      label: 'Historial de Cortes',
      icon: <Icon name="document" size={20} />,
      content: (
        <HistoryTab
          activeTab={activeTab}
          selectedClosure={selectedClosure}
          isDetailModalOpen={isDetailModalOpen}
          onViewDetails={handleViewClosureDetails}
          onCloseModal={handleCloseDetailModal}
        />
      ),
    },
    {
      id: 'historial-ordenes',
      label: 'Historial de Órdenes',
      icon: <Icon name="package" size={20} />,
      content: (
        <HistoryTab
          activeTab={activeTab}
          selectedClosure={selectedClosure}
          isDetailModalOpen={isDetailModalOpen}
          onViewDetails={handleViewClosureDetails}
          onCloseModal={handleCloseDetailModal}
        />
      ),
    },
  ];

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
      />

      {/* Animated Tabs */}
      <AnimatedTabs
        tabs={tabs}
        defaultTab={activeTab}
        onTabChange={setActiveTab}
        responsive={true}
      />
    </div>
  );
};

export default Reports;
