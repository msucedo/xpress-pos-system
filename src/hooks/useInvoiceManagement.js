import { useState } from 'react';
import { getBusinessProfile, updateOrder } from '../services/firebaseService';
import { generateInvoicePDF } from '../utils/invoiceGenerator';
import { generateInvoiceFileName, dataURItoBlob, isMobileDevice } from '../utils/orders/orderHelpers';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para manejar generación, visualización y descarga de facturas
 *
 * @param {Object} order - Orden completa
 * @returns {Object} Estados y funciones para manejar facturas
 */
export function useInvoiceManagement(order) {
  const { showSuccess, showInfo } = useNotification();
  const { user } = useAuth();

  const [localInvoice, setLocalInvoice] = useState(order.invoice || null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Handler para generar factura - genera PDF y lo guarda en Firebase
  const handleGenerateInvoice = async () => {
    // Prevenir múltiples clics
    if (isGeneratingInvoice) {
      showInfo('Ya se está generando la factura, por favor espera...');
      return;
    }

    setIsGeneratingInvoice(true);

    try {
      const businessProfile = await getBusinessProfile();
      const pdf = await generateInvoicePDF(order, businessProfile);

      // Convertir PDF a base64 para guardar en Firebase
      const pdfBase64 = pdf.output('datauristring');

      // Guardar factura en la orden
      const invoiceData = {
        pdfData: pdfBase64,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email || 'unknown'
      };

      // Actualizar orden en Firebase con la factura
      await updateOrder(order.id, {
        invoice: invoiceData
      });

      // Actualizar estado local para que los botones se actualicen inmediatamente
      setLocalInvoice(invoiceData);

      // Detectar si es móvil
      const mobile = isMobileDevice();

      if (mobile) {
        // En móvil: abrir modal de preview automáticamente
        setIsPdfPreviewOpen(true);
        showSuccess('Factura generada y guardada exitosamente');
      } else {
        // En escritorio: abrir en nueva pestaña
        window.open(pdf.output('bloburl'), '_blank');
        showSuccess('Factura generada y guardada exitosamente');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      showInfo('Error al generar la factura');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  // Handler para ver factura guardada
  const handleViewSavedInvoice = () => {
    try {
      if (localInvoice && localInvoice.pdfData) {
        // Abrir modal de preview
        setIsPdfPreviewOpen(true);
      } else {
        showInfo('No hay factura guardada para esta orden');
      }
    } catch (error) {
      console.error('Error viewing saved invoice:', error);
      showInfo('Error al abrir la factura guardada');
    }
  };

  // Handler para descargar factura guardada
  const handleDownloadInvoice = async () => {
    try {
      if (localInvoice && localInvoice.pdfData) {
        // Generar nombre de archivo
        const fileName = generateInvoiceFileName(order);

        // Detectar si es móvil o tablet
        const mobile = isMobileDevice();

        if (mobile) {
          // En móviles: intentar usar Web Share API
          if (navigator.share && navigator.canShare) {
            try {
              // Convertir data URI a Blob
              const blob = dataURItoBlob(localInvoice.pdfData);
              const file = new File([blob], fileName, { type: 'application/pdf' });

              // Verificar si se puede compartir
              if (navigator.canShare({ files: [file] })) {
                // IMPORTANTE: En iOS/iPadOS no se debe incluir title, text o url junto con files
                // Esto causa que iOS cree archivos de texto adicionales no deseados
                await navigator.share({
                  files: [file]
                });
                showSuccess('Factura compartida exitosamente');
                return;
              }
            } catch (shareError) {
              console.log('Web Share API no disponible o cancelada:', shareError);
              // Si falla, continuar con el método de abrir en nueva ventana
            }
          }

          // Si Web Share API no está disponible o falló, abrir en nueva ventana
          // El usuario puede usar las opciones del navegador para descargar
          const newWindow = window.open(localInvoice.pdfData, '_blank');
          if (newWindow) {
            showSuccess('Factura abierta. Usa las opciones del navegador para descargar o compartir');
          } else {
            showInfo('Por favor, permite las ventanas emergentes para ver la factura');
          }
        } else {
          // En escritorio: descarga directa tradicional
          const link = document.createElement('a');
          link.href = localInvoice.pdfData;
          link.download = fileName;

          // Disparar descarga
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showSuccess('Factura descargada exitosamente');
        }
      } else {
        showInfo('No hay factura guardada para esta orden');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showInfo('Error al descargar la factura');
    }
  };

  return {
    localInvoice,
    isPdfPreviewOpen,
    setIsPdfPreviewOpen,
    isGeneratingInvoice,
    handleGenerateInvoice,
    handleViewSavedInvoice,
    handleDownloadInvoice
  };
}
