import { useState, useCallback } from 'react';
import { BILLETES_INITIAL_STATE, MONEDAS_INITIAL_STATE } from '../utils/cash/denominationHelpers';

/**
 * Hook para manejar el estado y handlers del conteo de dinero
 * (billetes, monedas, tarjetas, transferencias)
 *
 * @returns {Object} Estado y handlers para conteo de dinero
 */
export function useCashCounting() {
  const [dineroInicial, setDineroInicial] = useState('');
  const [billetes, setBilletes] = useState(BILLETES_INITIAL_STATE);
  const [monedas, setMonedas] = useState(MONEDAS_INITIAL_STATE);
  const [cobrosTarjeta, setCobrosTarjeta] = useState([{ monto: '', tipo: 'debito' }]);
  const [transferencias, setTransferencias] = useState([{ monto: '' }]);

  // ===== HANDLERS DE BILLETES =====

  const handleBilleteChange = useCallback((denominacion, valor) => {
    setBilletes(prev => ({
      ...prev,
      [denominacion]: parseInt(valor) || 0
    }));
  }, []);

  const incrementarBillete = useCallback((denominacion) => {
    setBilletes(prev => ({
      ...prev,
      [denominacion]: (prev[denominacion] || 0) + 1
    }));
  }, []);

  const decrementarBillete = useCallback((denominacion) => {
    setBilletes(prev => ({
      ...prev,
      [denominacion]: Math.max(0, (prev[denominacion] || 0) - 1)
    }));
  }, []);

  // ===== HANDLERS DE MONEDAS =====

  const handleMonedaChange = useCallback((denominacion, valor) => {
    setMonedas(prev => ({
      ...prev,
      [denominacion]: parseInt(valor) || 0
    }));
  }, []);

  const incrementarMoneda = useCallback((denominacion) => {
    setMonedas(prev => ({
      ...prev,
      [denominacion]: (prev[denominacion] || 0) + 1
    }));
  }, []);

  const decrementarMoneda = useCallback((denominacion) => {
    setMonedas(prev => ({
      ...prev,
      [denominacion]: Math.max(0, (prev[denominacion] || 0) - 1)
    }));
  }, []);

  // ===== HANDLERS DE TARJETA =====

  const handleCobroTarjetaChange = useCallback((index, valor) => {
    setCobrosTarjeta(prev => {
      const nuevosCobros = [...prev];
      nuevosCobros[index].monto = valor;
      return nuevosCobros;
    });
  }, []);

  const handleTipoTarjetaChange = useCallback((index, tipo) => {
    setCobrosTarjeta(prev => {
      const nuevosCobros = [...prev];
      nuevosCobros[index].tipo = tipo;
      return nuevosCobros;
    });
  }, []);

  const agregarCobroTarjeta = useCallback(() => {
    setCobrosTarjeta(prev => [...prev, { monto: '', tipo: 'debito' }]);
  }, []);

  const eliminarCobroTarjeta = useCallback((index) => {
    setCobrosTarjeta(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  // ===== HANDLERS DE TRANSFERENCIA =====

  const handleTransferenciaChange = useCallback((index, valor) => {
    setTransferencias(prev => {
      const nuevasTransferencias = [...prev];
      nuevasTransferencias[index].monto = valor;
      return nuevasTransferencias;
    });
  }, []);

  const agregarTransferencia = useCallback(() => {
    setTransferencias(prev => [...prev, { monto: '' }]);
  }, []);

  const eliminarTransferencia = useCallback((index) => {
    setTransferencias(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  // ===== FUNCIÓN DE RESET =====

  const resetCounting = useCallback(() => {
    setDineroInicial('');
    setBilletes(BILLETES_INITIAL_STATE);
    setMonedas(MONEDAS_INITIAL_STATE);
    setCobrosTarjeta([{ monto: '', tipo: 'debito' }]);
    setTransferencias([{ monto: '' }]);
  }, []);

  // ===== FUNCIÓN DE CARGA DE DATOS (para draft) =====

  const loadCountingData = useCallback((data) => {
    if (data) {
      setDineroInicial(data.dineroInicial || '');
      setBilletes(data.billetes || BILLETES_INITIAL_STATE);
      setMonedas(data.monedas || MONEDAS_INITIAL_STATE);
      setCobrosTarjeta(data.cobrosTarjeta || [{ monto: '', tipo: 'debito' }]);
      setTransferencias(data.transferencias || [{ monto: '' }]);
    }
  }, []);

  return {
    // Estado
    dineroInicial,
    billetes,
    monedas,
    cobrosTarjeta,
    transferencias,

    // Setters directos
    setDineroInicial,
    setBilletes,
    setMonedas,

    // Handlers de billetes
    handleBilleteChange,
    incrementarBillete,
    decrementarBillete,

    // Handlers de monedas
    handleMonedaChange,
    incrementarMoneda,
    decrementarMoneda,

    // Handlers de tarjeta
    handleCobroTarjetaChange,
    handleTipoTarjetaChange,
    agregarCobroTarjeta,
    eliminarCobroTarjeta,

    // Handlers de transferencia
    handleTransferenciaChange,
    agregarTransferencia,
    eliminarTransferencia,

    // Utilidades
    resetCounting,
    loadCountingData
  };
}
