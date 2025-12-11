import { useState, useEffect } from 'react';
import { subscribeToOrders, subscribeToCashRegisterClosures, subscribeToCashRegisterDraft } from '../services/firebaseService';

/**
 * Hook para manejar las suscripciones a datos de Firebase para Reports
 * @returns {Object} orders, todayDraft, closures
 */
export const useReportsData = () => {
  const [orders, setOrders] = useState({
    recibidos: [],
    proceso: [],
    listos: [],
    enEntrega: [],
    completados: [],
    cancelado: []
  });
  const [todayDraft, setTodayDraft] = useState(null);
  const [closures, setClosures] = useState([]);

  // Subscribe to orders for cash register
  useEffect(() => {
    const unsubscribe = subscribeToOrders((ordersData) => {
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to today's draft
  useEffect(() => {
    const unsubscribe = subscribeToCashRegisterDraft((draftData) => {
      setTodayDraft(draftData);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to cash register closures
  useEffect(() => {
    const unsubscribe = subscribeToCashRegisterClosures((closuresData) => {
      setClosures(closuresData);
    });

    return () => unsubscribe();
  }, []);

  return {
    orders,
    todayDraft,
    closures
  };
};
