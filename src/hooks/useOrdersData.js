import { useState, useEffect } from 'react';
import { subscribeToOrders, subscribeToEmployees } from '../services/firebaseService';

/**
 * Hook para manejar suscripciones a datos de Firebase (órdenes y empleados)
 *
 * @returns {Object} { orders, employees, loading }
 */
export function useOrdersData() {
  const [orders, setOrders] = useState({
    recibidos: [],
    proceso: [],
    listos: [],
    enEntrega: [],
    completados: [],
    cancelado: []
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeOrders = subscribeToOrders((ordersData) => {
      setOrders(ordersData);
      setLoading(false);
    });

    const unsubscribeEmployees = subscribeToEmployees((employeesData) => {
      setEmployees(employeesData);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeEmployees();
    };
  }, []);

  return {
    orders,
    employees,
    loading
  };
}
