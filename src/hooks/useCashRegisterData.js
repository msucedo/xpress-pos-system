import { useState, useEffect } from 'react';
import {
  subscribeToEmployees,
  subscribeToCashRegisterClosures
} from '../services/firebaseService';

/**
 * Hook para manejar suscripciones a datos de Firebase (employees y closures)
 *
 * @returns {Object} { employees, closures, loading }
 */
export function useCashRegisterData() {
  const [employees, setEmployees] = useState([]);
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to employees
    const unsubscribeEmployees = subscribeToEmployees((employeesData) => {
      // Filter only active employees
      const activeEmployees = employeesData.filter(emp => emp.status === 'active');
      setEmployees(activeEmployees);
      setLoading(false);
    });

    // Subscribe to cash register closures
    const unsubscribeClosures = subscribeToCashRegisterClosures((closuresData) => {
      setClosures(closuresData);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeEmployees();
      unsubscribeClosures();
    };
  }, []);

  return {
    employees,
    closures,
    loading
  };
}
