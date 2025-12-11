import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

/**
 * Hook para acceder al sistema de notificaciones
 * @returns {Object} Context value con funciones de notificación y validación
 * @throws {Error} Si se usa fuera de NotificationProvider
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
