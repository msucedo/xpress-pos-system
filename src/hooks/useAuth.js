import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook para acceder al contexto de autenticación
 * @returns {Object} Context value con user, employee, loading, error, loginWithGoogle, logout
 * @throws {Error} Si se usa fuera de AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Custom hook para verificar si el usuario actual es admin
 * @returns {boolean} true si el usuario es admin y está activo
 */
export const useAdminCheck = () => {
  const { employee } = useAuth();
  return employee?.isAdmin === true && employee?.status === 'active';
};
