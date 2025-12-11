import CashClosureHistory from '../CashClosureHistory';
import OrderHistory from '../OrderHistory';
import Modal from '../Modal';
import CashClosureDetail from '../CashClosureDetail';

/**
 * Tabs de Historial (Cortes y Órdenes) en Reports
 * @param {Object} props
 * @param {string} props.activeTab - Tab activo
 * @param {Object} props.selectedClosure - Corte seleccionado para modal
 * @param {boolean} props.isDetailModalOpen - Estado del modal de detalles
 * @param {Function} props.onViewDetails - Handler para ver detalles de corte
 * @param {Function} props.onCloseModal - Handler para cerrar modal
 */
const HistoryTab = ({
  activeTab,
  selectedClosure,
  isDetailModalOpen,
  onViewDetails,
  onCloseModal
}) => {
  return (
    <>
      {/* History Tab - Cortes */}
      {activeTab === 'historial-cortes' && (
        <CashClosureHistory onViewDetails={onViewDetails} />
      )}

      {/* History Tab - Órdenes */}
      {activeTab === 'historial-ordenes' && (
        <OrderHistory />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedClosure && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={onCloseModal}
          title=""
          size="large"
        >
          <CashClosureDetail
            closure={selectedClosure}
            onClose={onCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

export default HistoryTab;
