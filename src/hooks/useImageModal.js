import { useState } from 'react';

/**
 * Hook simple para manejar modal de imagen ampliada
 *
 * @returns {Object} Estado y funciones para el modal de imagen
 */
export function useImageModal() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Abrir modal de imagen
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Cerrar modal de imagen
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    openImageModal,
    closeImageModal
  };
}
