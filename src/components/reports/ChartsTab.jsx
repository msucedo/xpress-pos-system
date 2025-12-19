import { useMemo } from 'react';
import { Icon } from '../../icons';
import RevenueChart from '../RevenueChart';
import ServicesChart from '../ServicesChart';
import PaymentMethodsChart from '../PaymentMethodsChart';
import ExpensesByCategoryChart from '../ExpensesByCategoryChart';
import ProfitTrendChart from '../ProfitTrendChart';
import PeriodComparisonChart from '../PeriodComparisonChart';

/**
 * Tab de Reportes y Charts en Reports
 * Contiene todos los cálculos de estadísticas, charts y rankings
 * @param {Object} props
 * @param {Object} props.orders - Todas las órdenes organizadas por estado
 * @param {Object} props.todayDraft - Borrador del día actual
 * @param {Array} props.closures - Cortes de caja
 * @param {Array} props.filteredOrders - Órdenes filtradas
 * @param {Array} props.filteredExpenses - Gastos filtrados
 * @param {Array} props.filteredClosures - Cortes filtrados
 * @param {string} props.activeFilter - Filtro activo
 * @param {Function} props.isTodayInRange - Helper para verificar si hoy está en rango
 * @param {Function} props.hasDraftData - Helper para verificar si draft tiene datos
 * @param {Function} props.getExpensesFromClosures - Obtiene gastos de cortes
 */
const ChartsTab = ({
  orders,
  todayDraft,
  closures,
  filteredOrders,
  filteredExpenses,
  filteredClosures,
  activeFilter,
  isTodayInRange,
  hasDraftData,
  getExpensesFromClosures
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Calculate statistics from closures
  const calculateStatsFromClosures = useMemo(() => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalOrders = 0;

    filteredClosures.forEach(closure => {
      // Calcular ingresos sin incluir dinero inicial (usar conteo real)
      const ingresosContados = parseFloat(closure.conteoIngresos?.totalGeneral || 0);
      const dineroInicial = parseFloat(closure.dineroInicial || 0);
      totalRevenue += ingresosContados - dineroInicial;

      totalExpenses += parseFloat(closure.resultados?.gastosTotal || 0);
      totalOrders += parseInt(closure.totalOrdenes || 0);
    });

    // Include today's draft data if applicable (for Semana, Mes, Año filters)
    if (activeFilter !== 'Hoy') {
      const now = new Date();
      let startDate, endDate;

      // Calculate date range for current filter
      switch (activeFilter) {
        case 'Semana': {
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          break;
        }
        case 'Mes':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'Año':
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
        default:
          startDate = null;
          endDate = null;
      }

      // Add revenue from today only if there's no closure (avoid duplication)
      if (startDate && endDate && isTodayInRange(startDate, endDate) && hasDraftData()) {
        // Add revenue from today's completed orders
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        const allOrders = [
          ...orders.recibidos,
          ...orders.proceso,
          ...orders.listos,
          ...orders.enEntrega,
          ...orders.completados
        ];

        const todayOrders = allOrders.filter(order => {
          if (!order.completedDate) return false;
          const orderDate = new Date(order.completedDate);
          return orderDate >= todayStart && orderDate <= todayEnd;
        });

        todayOrders.forEach(order => {
          const total = parseFloat(order.totalPrice) || 0;
          const advance = parseFloat(order.advancePayment) || 0;

          if (order.paymentStatus === 'paid') {
            totalRevenue += total;
            totalOrders++;
          } else if (order.paymentStatus === 'partial') {
            totalRevenue += advance;
            totalOrders++;
          }
        });
      }

      // ALWAYS add expenses from draft when today is in range (independent of closures)
      if (startDate && endDate && isTodayInRange(startDate, endDate) && todayDraft?.gastos) {
        todayDraft.gastos.forEach(expense => {
          totalExpenses += parseFloat(expense.amount) || 0;
        });
      }
    }

    const totalProfit = totalRevenue - totalExpenses;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalOrders,
      averageTicket
    };
  }, [filteredClosures, activeFilter, isTodayInRange, hasDraftData, todayDraft, orders]);

  // Calculate period comparison from closures
  const calculatePeriodComparisonFromClosures = useMemo(() => {
    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    switch (activeFilter) {
      case 'Hoy':
        currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        break;
      case 'Semana': {
        const dayOfWeek = now.getDay();
        currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
        currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - 7, 0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - 1, 23, 59, 59, 999);
        break;
      }
      case 'Mes':
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      case 'Año':
        currentStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        previousStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      default:
        currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    }

    const calculatePeriodDataFromClosures = (startDate, endDate) => {
      const periodClosures = closures.filter(closure => {
        if (!closure.fechaCorte) return false;
        const closureDate = new Date(closure.fechaCorte);
        return closureDate >= startDate && closureDate <= endDate;
      });

      let revenue = 0;
      let expenses = 0;

      periodClosures.forEach(closure => {
        // Calcular ingresos sin incluir dinero inicial (usar conteo real)
        const ingresosContados = parseFloat(closure.conteoIngresos?.totalGeneral || 0);
        const dineroInicial = parseFloat(closure.dineroInicial || 0);
        revenue += ingresosContados - dineroInicial;

        expenses += parseFloat(closure.resultados?.gastosTotal || 0);
      });

      // Add revenue from today only if there's no closure (avoid duplication)
      if (isTodayInRange(startDate, endDate) && hasDraftData()) {
        // Add revenue from today's completed orders
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        const allOrders = [
          ...orders.recibidos,
          ...orders.proceso,
          ...orders.listos,
          ...orders.enEntrega,
          ...orders.completados
        ];

        const todayOrders = allOrders.filter(order => {
          if (!order.completedDate) return false;
          const orderDate = new Date(order.completedDate);
          return orderDate >= todayStart && orderDate <= todayEnd;
        });

        todayOrders.forEach(order => {
          const total = parseFloat(order.totalPrice) || 0;
          const advance = parseFloat(order.advancePayment) || 0;

          if (order.paymentStatus === 'paid') {
            revenue += total;
          } else if (order.paymentStatus === 'partial') {
            revenue += advance;
          }
        });
      }

      // ALWAYS add expenses from draft when today is in range (independent of closures)
      if (isTodayInRange(startDate, endDate) && todayDraft?.gastos) {
        todayDraft.gastos.forEach(expense => {
          expenses += parseFloat(expense.amount) || 0;
        });
      }

      return {
        revenue,
        expenses,
        profit: revenue - expenses
      };
    };

    return {
      current: calculatePeriodDataFromClosures(currentStart, currentEnd),
      previous: calculatePeriodDataFromClosures(previousStart, previousEnd)
    };
  }, [activeFilter, closures, isTodayInRange, hasDraftData, orders, todayDraft]);

  // Calculate statistics based on filtered orders
  const calculateStats = useMemo(() => {
    let totalRevenue = 0;
    let completedOrders = 0;
    let pendingAmount = 0;

    filteredOrders.forEach(order => {
      const total = parseFloat(order.totalPrice) || 0;
      const advance = parseFloat(order.advancePayment) || 0;

      if (order.paymentStatus === 'paid') {
        totalRevenue += total;
        completedOrders++;
      } else if (order.paymentStatus === 'partial') {
        totalRevenue += advance;
        pendingAmount += (total - advance);
      } else if (order.paymentStatus === 'pending') {
        pendingAmount += total;
      }
    });

    const averageTicket = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      totalRevenue,
      completedOrders,
      averageTicket,
      pendingAmount
    };
  }, [filteredOrders]);

  // Calculate top 5 clients based on filtered orders
  const calculateTopClients = useMemo(() => {
    const clientData = {};

    filteredOrders.forEach(order => {
      // Use clientId as key to avoid grouping clients with same name
      const clientId = order.clientId || order.client || 'sin-id';
      const clientName = order.client || 'Sin nombre';
      const total = parseFloat(order.totalPrice) || 0;
      const advance = parseFloat(order.advancePayment) || 0;

      let revenue = 0;
      if (order.paymentStatus === 'paid') {
        revenue = total;
      } else if (order.paymentStatus === 'partial') {
        revenue = advance;
      }

      if (!clientData[clientId]) {
        clientData[clientId] = {
          name: clientName,
          orders: 0,
          revenue: 0
        };
      }

      clientData[clientId].orders += 1;
      clientData[clientId].revenue += revenue;
    });

    // Sort by revenue and get top 5
    return Object.entries(clientData)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([id, data], index) => ({
        rank: index + 1,
        name: data.name,
        detail: `${data.orders} ${data.orders === 1 ? 'orden' : 'órdenes'}`,
        value: data.revenue,
        gold: index < 3
      }));
  }, [filteredOrders]);

  // Calculate top services based on filtered orders
  const calculateTopServices = useMemo(() => {
    const serviceData = {};

    filteredOrders.forEach(order => {
      if (!order.services || order.services.length === 0) return;

      order.services.forEach(service => {
        const serviceName = service.serviceName || 'Sin nombre';
        const servicePrice = parseFloat(service.price) || 0;

        if (!serviceData[serviceName]) {
          serviceData[serviceName] = {
            count: 0,
            revenue: 0
          };
        }

        serviceData[serviceName].count += 1;
        serviceData[serviceName].revenue += servicePrice;
      });
    });

    // Sort by revenue and get top services
    return Object.entries(serviceData)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 4)
      .map(([name, data], index) => ({
        rank: index + 1,
        name,
        detail: `${data.count} ${data.count === 1 ? 'orden' : 'órdenes'}`,
        value: data.revenue,
        gold: index < 3
      }));
  }, [filteredOrders]);

  // Calculate period comparison data (current vs previous) - for "Hoy" filter
  const calculatePeriodComparison = useMemo(() => {
    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    switch (activeFilter) {
      case 'Hoy':
        currentStart = new Date(now.setHours(0, 0, 0, 0));
        currentEnd = new Date(now.setHours(23, 59, 59, 999));
        previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd = new Date(previousStart);
        previousEnd.setHours(23, 59, 59, 999);
        break;
      case 'Semana': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        currentStart = new Date(startOfWeek.setHours(0, 0, 0, 0));
        currentEnd = new Date();
        previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd = new Date(currentStart);
        previousEnd.setSeconds(previousEnd.getSeconds() - 1);
        break;
      }
      case 'Mes':
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'Año':
        currentStart = new Date(now.getFullYear(), 0, 1);
        currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      default:
        currentStart = new Date(now.setHours(0, 0, 0, 0));
        currentEnd = new Date(now.setHours(23, 59, 59, 999));
        previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd = new Date(previousStart);
        previousEnd.setHours(23, 59, 59, 999);
    }

    // Helper function to calculate data for a period
    const calculatePeriodData = (startDate, endDate) => {
      // Get all orders
      const allOrders = [
        ...orders.recibidos,
        ...orders.proceso,
        ...orders.listos,
        ...orders.enEntrega,
        ...orders.completados
      ];

      // Filter orders by date
      const periodOrders = allOrders.filter(order => {
        if (!order.completedDate) return false;
        const orderDate = new Date(order.completedDate);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Calculate revenue
      let revenue = 0;
      periodOrders.forEach(order => {
        const total = parseFloat(order.totalPrice) || 0;
        const advance = parseFloat(order.advancePayment) || 0;

        if (order.paymentStatus === 'paid') {
          revenue += total;
        } else if (order.paymentStatus === 'partial') {
          revenue += advance;
        }
      });

      // Get expenses for this period
      let periodExpenses = [];

      // Check if this period is today
      const today = new Date();
      const isTodayPeriod =
        startDate.getFullYear() === today.getFullYear() &&
        startDate.getMonth() === today.getMonth() &&
        startDate.getDate() === today.getDate() &&
        endDate.getFullYear() === today.getFullYear() &&
        endDate.getMonth() === today.getMonth() &&
        endDate.getDate() === today.getDate();

      if (isTodayPeriod) {
        // Use draft for today's expenses
        periodExpenses = todayDraft?.gastos || [];
      } else {
        // Use closures for historical expenses
        const periodClosures = closures.filter(closure => {
          if (!closure.fechaCorte) return false;
          const closureDate = new Date(closure.fechaCorte);
          return closureDate >= startDate && closureDate <= endDate;
        });

        periodClosures.forEach(closure => {
          if (closure.gastos?.items) {
            periodExpenses.push(...closure.gastos.items);
          }
        });
      }

      // Calculate total expenses
      const totalExpenses = periodExpenses.reduce((sum, expense) => {
        return sum + (parseFloat(expense.amount) || 0);
      }, 0);

      return {
        revenue,
        expenses: totalExpenses,
        profit: revenue - totalExpenses
      };
    };

    return {
      current: calculatePeriodData(currentStart, currentEnd),
      previous: calculatePeriodData(previousStart, previousEnd)
    };
  }, [activeFilter, orders, todayDraft, closures]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.amount) || 0);
    }, 0);
  }, [filteredExpenses]);

  const stats = calculateStats;
  const topClients = calculateTopClients;
  const topServices = calculateTopServices;
  const totalProfit = stats.totalRevenue - totalExpenses;
  const periodComparison = calculatePeriodComparison;
  const statsFromClosures = calculateStatsFromClosures;
  const periodComparisonFromClosures = calculatePeriodComparisonFromClosures;

  return (
    <div className="reports-content">
      {/* Financial Summary Section */}
      <div className="cr-section">
        <div className="cr-section-header">
          <h3><Icon name="money" size={20} /> Resumen Financiero</h3>
          <div className="cr-period-badge">
            {activeFilter === 'Hoy'
              ? <><Icon name="lightning" size={16} /> Tiempo Real</>
              : (() => {
                  // Determine if draft is included
                  const now = new Date();
                  let startDate, endDate;

                  switch (activeFilter) {
                    case 'Semana': {
                      const dayOfWeek = now.getDay();
                      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
                      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                      break;
                    }
                    case 'Mes':
                      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                      break;
                    case 'Año':
                      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                      break;
                    default:
                      startDate = null;
                      endDate = null;
                  }

                  const includingToday = startDate && endDate && isTodayInRange(startDate, endDate) && hasDraftData();
                  return includingToday
                    ? <><Icon name="book" size={16} /> {activeFilter} (incluyendo hoy)</>
                    : <><Icon name="book" size={16} /> {activeFilter} - Histórico</>;
                })()
            }
          </div>
        </div>

        <div className="cr-stats-grid">
          <div className="cr-stat-card total">
            <div className="cr-stat-icon"><Icon name="money" size={32} /></div>
            <div className="cr-stat-info">
              <div className="cr-stat-label">Total Ingresos</div>
              <div className="cr-stat-value">
                {formatCurrency(
                  activeFilter !== 'Hoy'
                    ? statsFromClosures.totalRevenue
                    : stats.totalRevenue
                )}
              </div>
            </div>
          </div>

          <div className="cr-stat-card cash">
            <div className="cr-stat-icon"><Icon name="expenses" size={32} /></div>
            <div className="cr-stat-info">
              <div className="cr-stat-label">Total Gastos</div>
              <div className="cr-stat-value">
                {formatCurrency(
                  activeFilter !== 'Hoy'
                    ? statsFromClosures.totalExpenses
                    : totalExpenses
                )}
              </div>
            </div>
          </div>

          <div className="cr-stat-card card">
            <div className="cr-stat-icon"><Icon name="money" size={32} /></div>
            <div className="cr-stat-info">
              <div className="cr-stat-label">Ganancia Neta</div>
              <div className="cr-stat-value">
                {formatCurrency(
                  activeFilter !== 'Hoy'
                    ? statsFromClosures.totalProfit
                    : totalProfit
                )}
              </div>
            </div>
          </div>

          <div className="cr-stat-card transfer">
            <div className="cr-stat-icon"><Icon name="credit-card" size={32} /></div>
            <div className="cr-stat-info">
              <div className="cr-stat-label">Ticket Promedio</div>
              <div className="cr-stat-value">
                {formatCurrency(
                  activeFilter !== 'Hoy'
                    ? statsFromClosures.averageTicket
                    : stats.averageTicket
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section Title */}
      <div className="reports-section-title">
        <span className="reports-section-icon"><Icon name="chart" size={24} /></span>
        Análisis de Ingresos
      </div>

      {/* Revenue Analysis Charts */}
      <div className="reports-charts-grid-2col">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Ingresos {activeFilter === 'Hoy' ? 'del Día' : activeFilter === 'Semana' ? 'de la Semana' : activeFilter === 'Mes' ? 'del Mes' : 'del Año'}</div>
              <div className="chart-subtitle">{filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}</div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <RevenueChart orders={filteredOrders} dateFilter={activeFilter} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Métodos de Pago</div>
              <div className="chart-subtitle">Distribución de ingresos</div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <PaymentMethodsChart orders={filteredOrders} />
          </div>
        </div>
      </div>

      {/* Expenses Section Title */}
      <div className="reports-section-title">
        <span className="reports-section-icon"><Icon name="expenses" size={24} /></span>
        Análisis de Gastos
      </div>

      {/* Expenses Chart */}
      <div className="reports-charts-grid-1col">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Gastos por Categoría</div>
              <div className="chart-subtitle">
                {activeFilter !== 'Hoy'
                  ? `${getExpensesFromClosures().length} ${getExpensesFromClosures().length === 1 ? 'gasto' : 'gastos'} registrados`
                  : `${filteredExpenses.length} ${filteredExpenses.length === 1 ? 'gasto' : 'gastos'} registrados`
                }
              </div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <ExpensesByCategoryChart
              expenses={activeFilter !== 'Hoy' ? getExpensesFromClosures() : filteredExpenses}
            />
          </div>
        </div>
      </div>

      {/* Trends Section Title */}
      <div className="reports-section-title">
        <span className="reports-section-icon"><Icon name="trending-up" size={24} /></span>
        Tendencias y Comparación
      </div>

      {/* Trends and Comparison Charts */}
      <div className="reports-charts-grid-2col">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Tendencia de Ganancia</div>
              <div className="chart-subtitle">Ingresos - Gastos</div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <ProfitTrendChart
              orders={filteredOrders}
              expenses={activeFilter !== 'Hoy' ? getExpensesFromClosures() : filteredExpenses}
              dateFilter={activeFilter}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Comparación de Períodos</div>
              <div className="chart-subtitle">Actual vs Anterior</div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <PeriodComparisonChart
              currentData={
                activeFilter !== 'Hoy'
                  ? periodComparisonFromClosures.current
                  : periodComparison.current
              }
              previousData={
                activeFilter !== 'Hoy'
                  ? periodComparisonFromClosures.previous
                  : periodComparison.previous
              }
              dateFilter={activeFilter}
            />
          </div>
        </div>
      </div>

      {/* Services Section Title */}
      <div className="reports-section-title">
        <span className="reports-section-icon"><Icon name="fire" size={24} /></span>
        Servicios Populares
      </div>

      {/* Services Chart */}
      <div className="reports-charts-grid-1col">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Servicios Más Vendidos</div>
              <div className="chart-subtitle">Top 6 servicios</div>
            </div>
          </div>
          <div style={{ height: '300px', padding: '20px' }}>
            <ServicesChart orders={filteredOrders} />
          </div>
        </div>
      </div>

      {/* Top Lists */}
      <div className="lists-grid">
        <div className="list-card">
          <div className="list-header"><Icon name="trophy" size={20} /> Top 5 Clientes</div>
          {topClients.length > 0 ? (
            topClients.map((client) => (
              <div key={client.rank} className="list-item">
                <div className={`list-rank ${client.gold ? 'gold' : ''}`}>{client.rank}</div>
                <div className="list-info">
                  <div className="list-name">{client.name}</div>
                  <div className="list-detail">{client.detail}</div>
                </div>
                <div className="list-value">{formatCurrency(client.value)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No hay datos para mostrar
            </div>
          )}
        </div>

        <div className="list-card">
          <div className="list-header"><Icon name="fire" size={20} /> Servicios Más Vendidos</div>
          {topServices.length > 0 ? (
            topServices.map((service) => (
              <div key={service.rank} className="list-item">
                <div className={`list-rank ${service.gold ? 'gold' : ''}`}>{service.rank}</div>
                <div className="list-info">
                  <div className="list-name">{service.name}</div>
                  <div className="list-detail">{service.detail}</div>
                </div>
                <div className="list-value">{formatCurrency(service.value)}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No hay datos para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsTab;
