import { useState } from 'react';

/**
 * Hook para manejar imágenes de la orden
 *
 * @returns {Object} - { orderImages, setOrderImages }
 */
export function useOrderImages() {
  const [orderImages, setOrderImages] = useState([]);

  return {
    orderImages,
    setOrderImages
  };
}
