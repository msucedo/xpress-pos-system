# Guía de Refactorización - Xpress POS System

## Resumen Ejecutivo

Este documento detalla el proceso de refactorización aplicado a **OrderForm.jsx** y proporciona una guía paso a paso para continuar refactorizando los demás componentes grandes del sistema.

### Logros Alcanzados

- **OrderForm.jsx**: Reducido de 1,368 líneas a 498 líneas (63.5% de reducción)
- **18 nuevos archivos creados**: 4 utilidades, 5 hooks personalizados, 9 componentes
- **Bug crítico resuelto**: Infinite loop en validación de promociones
- **Arquitectura modular**: Código organizado, testeable y reutilizable

---

## Índice

1. [Cambios Realizados](#cambios-realizados)
2. [Estructura Nueva](#estructura-nueva)
3. [Patrón de Refactorización](#patrón-de-refactorización)
4. [Próximos Archivos](#próximos-archivos-a-refactorizar)
5. [Guía Paso a Paso](#guía-paso-a-paso)
6. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Cambios Realizados

### Archivo Refactorizado

#### OrderForm.jsx
- **Antes**: 1,368 líneas - componente monolítico con toda la lógica mezclada
- **Después**: 498 líneas - componente orquestador que usa hooks y componentes pequeños
- **Respaldo**: `src/components/OrderForm.ORIGINAL.jsx` (preservado para referencia)

### Archivos Creados

#### Utilidades (src/utils/)

1. **`promotions/promotionHelpers.js`** (230 líneas)
   - `isPromotionRelevantForCart()` - Determina si una promoción aplica al carrito
   - `getPromotionPriority()` - Calcula prioridad de promociones (1-3)
   - `getItemsWithPromoBadge()` - Identifica items que deben mostrar badge de promo

2. **`promotions/promotionCalculations.js`** (45 líneas)
   - `calculateSubtotal()` - Suma total de items en carrito
   - `calculateTotalDiscount()` - Suma total de descuentos aplicados
   - `calculateTotalPrice()` - Calcula precio final después de descuentos
   - `calculateTotalItems()` - Cuenta total de items considerando cantidades

3. **`cart/cartHelpers.js`** (188 líneas)
   - `generateCartItemId()` - Genera IDs únicos para items del carrito
   - `addServiceToCart()` - Agrega servicio o incrementa cantidad
   - `addProductToCart()` - Agrega producto con validación de stock
   - `expandServicesForOrder()` - Expande items con cantidad para Firebase
   - `hasExpressService()` - Detecta si hay servicio express

4. **`employees/employeeHelpers.js`** (43 líneas)
   - `getEmployeeOrderCount()` - Cuenta órdenes activas por empleado
   - `autoSelectEmployeeWithLeastOrders()` - Auto-asigna empleado con menos carga

#### Hooks Personalizados (src/hooks/)

1. **`usePromotionsCalculation.js`** (64 líneas)
   - Maneja validación y cálculo de promociones aplicables
   - **IMPORTANTE**: Usa `useCallback` para evitar infinite loops
   - Retorna: `{ appliedPromotions, promotionValidations, refetchPromotions }`

2. **`useOrderFormData.js`** (100+ líneas)
   - Maneja estado del formulario y validaciones
   - Retorna: `{ formData, errors, handleChange, validateForm, ... }`

3. **`useCartManagement.js`** (80+ líneas)
   - Maneja estado del carrito (agregar, eliminar items)
   - Retorna: `{ cart, setCart, handleAddToCart, handleRemoveFromCart }`

4. **`useEmployeeAssignment.js`** (30+ líneas)
   - Maneja selección y auto-asignación de empleados
   - Retorna: `{ selectedEmployee, setSelectedEmployee }`

5. **`useOrderImages.js`** (15 líneas)
   - Maneja estado de imágenes de la orden
   - Retorna: `{ orderImages, setOrderImages }`

#### Componentes UI (src/components/orders/)

1. **`CustomerInfoSection.jsx`** - Formulario de información del cliente
2. **`ServiceSelector.jsx`** - Grid de servicios disponibles
3. **`ProductSelector.jsx`** - Grid de productos disponibles
4. **`CartItem.jsx`** - Item individual del carrito con promoción
5. **`PromotionsBanner.jsx`** - Banner de promociones disponibles/aplicadas
6. **`EmployeeAssignment.jsx`** - Selector de empleado con carga de trabajo
7. **`CartSummary.jsx`** - Resumen completo del carrito
8. **`PaymentSection.jsx`** - Formulario de pago y fecha de entrega
9. **`PhotoUploadSection.jsx`** - Sección de carga de fotos

---

## Estructura Nueva

```
xpress-pos-system/
├── src/
│   ├── components/
│   │   ├── OrderForm.jsx                    # Refactorizado (498 líneas)
│   │   ├── OrderForm.ORIGINAL.jsx           # Backup (1,368 líneas)
│   │   └── orders/                          # NUEVO directorio
│   │       ├── CustomerInfoSection.jsx
│   │       ├── ServiceSelector.jsx
│   │       ├── ProductSelector.jsx
│   │       ├── CartItem.jsx
│   │       ├── PromotionsBanner.jsx
│   │       ├── EmployeeAssignment.jsx
│   │       ├── CartSummary.jsx
│   │       ├── PaymentSection.jsx
│   │       └── PhotoUploadSection.jsx
│   │
│   ├── hooks/                               # NUEVO directorio
│   │   ├── usePromotionsCalculation.js
│   │   ├── useOrderFormData.js
│   │   ├── useCartManagement.js
│   │   ├── useEmployeeAssignment.js
│   │   └── useOrderImages.js
│   │
│   └── utils/
│       ├── promotions/                      # NUEVO directorio
│       │   ├── promotionHelpers.js
│       │   └── promotionCalculations.js
│       ├── cart/                            # NUEVO directorio
│       │   └── cartHelpers.js
│       └── employees/                       # NUEVO directorio
│           └── employeeHelpers.js
│
└── REFACTORING_GUIDE.md                     # Este documento
```

---

## Patrón de Refactorización

Este es el patrón probado y exitoso aplicado a OrderForm.jsx. Seguir estos pasos para refactorizar otros componentes grandes.

### Fase 1: Extracción de Utilidades (Pure Functions)

**Objetivo**: Extraer toda la lógica de negocio pura (sin dependencias de React)

**Proceso**:
1. Identificar funciones puras en el componente
2. Agrupar por dominio (cart, promotions, employees, etc.)
3. Crear archivos en `src/utils/[dominio]/[nombre]Helpers.js`
4. Exportar como named exports
5. Importar dinámicamente cuando sea posible para code splitting

**Ejemplo**:
```javascript
// ❌ ANTES: Dentro del componente
const calculateSubtotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ✅ DESPUÉS: src/utils/promotions/promotionCalculations.js
export const calculateSubtotal = (cart) => {
  return cart.reduce((total, item) =>
    total + (item.price || 0) * (item.quantity || 1), 0);
};
```

**Beneficios**:
- Funciones testables sin mockear React
- Reutilizables en otros componentes
- Sin efectos secundarios

### Fase 2: Creación de Custom Hooks

**Objetivo**: Encapsular lógica con estado de React

**Proceso**:
1. Identificar grupos de `useState` relacionados
2. Identificar `useEffect` y su lógica asociada
3. Crear hooks en `src/hooks/use[Funcionalidad].js`
4. Extraer validaciones y transformaciones
5. **CRUCIAL**: Usar `useCallback` para funciones que se pasan a `useEffect`

**Ejemplo**:
```javascript
// ❌ ANTES: Dentro del componente (causa infinite loop)
const [cart, setCart] = useState([]);

const addToCart = (item) => {
  setCart(prev => [...prev, item]);
};

useEffect(() => {
  validateCart();
}, [cart]); // Se recrea en cada render

// ✅ DESPUÉS: src/hooks/useCartManagement.js
export function useCartManagement(initialData = null) {
  const [cart, setCart] = useState([]);

  const handleAddToCart = useCallback((item, type = 'service') => {
    if (type === 'service') {
      setCart(prev => addServiceHelper(prev, item));
    }
  }, []); // Memoizado, no cambia

  return { cart, setCart, handleAddToCart };
}
```

**Patrón crítico para evitar infinite loops**:
```javascript
// Paso 1: Memoizar funciones asíncronas con useCallback
const checkApplicablePromotions = useCallback(async () => {
  // ... lógica asíncrona
}, [cart, clientPhone, activePromotions]); // Dependencias reales

// Paso 2: useEffect depende de la función memoizada, no de las dependencias directas
useEffect(() => {
  checkApplicablePromotions();
}, [checkApplicablePromotions]); // ✅ Solo cambia cuando dependencias cambian
```

### Fase 3: Creación de Componentes UI

**Objetivo**: Dividir el UI en componentes pequeños y enfocados

**Proceso**:
1. Identificar secciones visuales independientes
2. Crear componentes en `src/components/[dominio]/[ComponentName].jsx`
3. Componentes deben recibir datos vía props (no leer contexto directamente)
4. Cada componente debe tener una responsabilidad única
5. Usar PropTypes o TypeScript para documentar props

**Ejemplo**:
```javascript
// ✅ Componente enfocado y reutilizable
export function CartItem({ item, assignedPromo, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-name">{item.name}</span>
        {assignedPromo && (
          <span className="promo-badge">{assignedPromo.name}</span>
        )}
      </div>
      <button onClick={() => onRemove(item.id)}>Eliminar</button>
    </div>
  );
}
```

**Principios**:
- Máximo 150 líneas por componente
- Single Responsibility Principle
- Props explícitas y bien nombradas
- No más de 7-8 props (considerar objeto si son más)

### Fase 4: Refactorización del Componente Principal

**Objetivo**: Convertir el componente monolítico en orquestador

**Proceso**:
1. Crear backup: `[ComponentName].ORIGINAL.jsx`
2. Importar todos los hooks personalizados
3. Importar todos los componentes UI
4. Mantener solo:
   - Llamadas a hooks
   - Cálculos derivados (con `useMemo` si son costosos)
   - Lógica de coordinación entre secciones
   - Estructura JSX de alto nivel
5. Pasar datos via props a componentes hijos

**Ejemplo**:
```javascript
// ✅ Componente orquestador limpio
const OrderForm = ({ onSubmit, onCancel, initialData, employees, allOrders }) => {
  // Hooks personalizados
  const { formData, errors, handleChange, validateForm } = useOrderFormData(initialData);
  const { cart, handleAddToCart, handleRemoveFromCart } = useCartManagement(initialData);
  const { appliedPromotions, promotionValidations } = usePromotionsCalculation(
    cart, formData.phone, activePromotions
  );
  const { selectedEmployee, setSelectedEmployee } = useEmployeeAssignment(employees, allOrders);
  const { orderImages, setOrderImages } = useOrderImages();

  // Estado UI local
  const [showPayment, setShowPayment] = useState(false);

  // Cálculos derivados (memoizados si son costosos)
  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
  const totalPrice = useMemo(() =>
    calculateTotalPrice(cart, appliedPromotions),
    [cart, appliedPromotions]
  );

  // Handlers de coordinación
  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    // Coordinar datos de múltiples hooks
    await onSubmit({
      ...formData,
      cart: expandServicesForOrder(cart),
      images: orderImages,
      employeeId: selectedEmployee?.id,
      totalPrice
    });
  };

  return (
    <div className="order-form-container">
      <CustomerInfoSection
        formData={formData}
        errors={errors}
        onClientChange={handleChange}
        onSelectClient={handleSelectClient}
      />
      <ServiceSelector services={services} onAddToCart={handleAddToCart} />
      <CartSummary
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        appliedPromotions={appliedPromotions}
        totalPrice={totalPrice}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
      />
      <PaymentSection
        formData={formData}
        totalPrice={totalPrice}
        onChange={handleChange}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
};
```

---

## Próximos Archivos a Refactorizar

Lista priorizada de componentes grandes que requieren refactorización:

### 1. OrderDetailView.jsx (1,328 líneas)
**Prioridad**: Alta
**Complejidad**: Alta
**Razón**: Componente crítico para visualización y edición de órdenes

**Dominios a extraer**:
- `utils/orders/orderHelpers.js` - Estado de órdenes, validaciones
- `utils/orders/statusHelpers.js` - Lógica de cambio de estados
- `hooks/useOrderDetail.js` - Estado de la orden
- `hooks/useOrderActions.js` - Acciones (actualizar, eliminar, cambiar estado)
- `components/orderDetail/OrderHeader.jsx`
- `components/orderDetail/OrderServices.jsx`
- `components/orderDetail/OrderTimeline.jsx`
- `components/orderDetail/OrderActions.jsx`

### 2. OrderHistory.jsx (1,279 líneas)
**Prioridad**: Alta
**Complejidad**: Media-Alta
**Razón**: Gestión compleja de filtros y estados

**Dominios a extraer**:
- `utils/history/filterHelpers.js` - Lógica de filtrado
- `utils/history/sortHelpers.js` - Ordenamiento de órdenes
- `hooks/useOrderFilters.js` - Estado de filtros
- `hooks/useOrderSearch.js` - Búsqueda y filtrado
- `components/history/FilterBar.jsx`
- `components/history/OrdersList.jsx`
- `components/history/OrderCard.jsx`

### 3. CashRegister.jsx (1,241 líneas)
**Prioridad**: Media-Alta
**Complejidad**: Alta
**Razón**: Lógica financiera crítica

**Dominios a extraer**:
- `utils/cash/cashCalculations.js` - Cálculos de caja
- `utils/cash/transactionHelpers.js` - Validación de transacciones
- `hooks/useCashRegister.js` - Estado de caja
- `hooks/useCashTransactions.js` - Transacciones
- `components/cash/CashSummary.jsx`
- `components/cash/TransactionList.jsx`
- `components/cash/CashActions.jsx`

### 4. PromotionForm.jsx (1,226 líneas)
**Prioridad**: Media
**Complejidad**: Alta
**Razón**: Formulario complejo con muchas validaciones

**Dominios a extraer**:
- `utils/promotions/promotionValidations.js` - Validaciones de promociones
- `utils/promotions/promotionTypes.js` - Tipos y configuraciones
- `hooks/usePromotionForm.js` - Estado del formulario
- `hooks/usePromotionPreview.js` - Preview de promoción
- `components/promotions/PromotionTypeSelector.jsx`
- `components/promotions/PromotionRules.jsx`
- `components/promotions/PromotionPreview.jsx`

### 5. OrderFormMobile.jsx (1,140 líneas)
**Prioridad**: Baja (posiblemente puede reutilizar del refactor de OrderForm.jsx)
**Complejidad**: Media
**Razón**: Versión móvil, muchos componentes ya creados

**Estrategia**: Reutilizar hooks y componentes de OrderForm.jsx, solo adaptar layout

---

## Guía Paso a Paso

### Refactorización de un Componente Grande

#### Paso 1: Análisis y Backup (30 min)

```bash
# 1. Abrir el componente y analizar
code src/components/[ComponentName].jsx

# 2. Identificar:
#    - Número de líneas
#    - useState (¿cuántos?, ¿relacionados?)
#    - useEffect (¿cuántos?, ¿qué hacen?)
#    - Funciones helpers (¿puras?, ¿con efectos?)
#    - Secciones JSX independientes

# 3. Crear backup
cp src/components/[ComponentName].jsx src/components/[ComponentName].ORIGINAL.jsx
```

**Checklist de análisis**:
- [ ] Contar líneas de código
- [ ] Listar todos los useState y agrupar por dominio
- [ ] Listar todos los useEffect y sus dependencias
- [ ] Identificar funciones puras (candidatas a utils)
- [ ] Identificar funciones con efectos (candidatas a hooks)
- [ ] Mapear secciones JSX independientes

#### Paso 2: Crear Estructura de Directorios (10 min)

```bash
# Crear directorios según dominios identificados
mkdir -p src/utils/[dominio]
mkdir -p src/hooks
mkdir -p src/components/[dominio]
```

#### Paso 3: Extraer Utilidades (1-2 horas)

```javascript
// Ejemplo: src/utils/orders/orderHelpers.js

/**
 * Genera ID único para nueva orden
 */
export function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Valida que una orden tenga todos los campos requeridos
 */
export function validateOrderData(orderData) {
  const errors = {};

  if (!orderData.client) errors.client = 'Cliente es requerido';
  if (!orderData.phone) errors.phone = 'Teléfono es requerido';
  if (!orderData.deliveryDate) errors.deliveryDate = 'Fecha de entrega es requerida';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calcula tiempo estimado de entrega
 */
export function calculateEstimatedDelivery(services, isExpress) {
  const baseHours = services.reduce((total, s) => total + (s.estimatedHours || 24), 0);
  return isExpress ? baseHours * 0.5 : baseHours;
}
```

**Checklist**:
- [ ] Funciones son puras (mismo input = mismo output)
- [ ] No usan hooks de React
- [ ] No tienen efectos secundarios
- [ ] Están documentadas con JSDoc
- [ ] Tienen nombres descriptivos
- [ ] Agrupadas por dominio lógico

#### Paso 4: Crear Custom Hooks (2-3 horas)

```javascript
// Ejemplo: src/hooks/useOrderFilters.js
import { useState, useCallback, useMemo } from 'react';

export function useOrderFilters(orders) {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  // Memoizar función de filtrado
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filtro por estado
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }

      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesClient = order.client?.toLowerCase().includes(searchLower);
        const matchesPhone = order.phone?.includes(filters.search);
        if (!matchesClient && !matchesPhone) return false;
      }

      // Filtro por fechas
      if (filters.dateFrom && order.date < filters.dateFrom) return false;
      if (filters.dateTo && order.date > filters.dateTo) return false;

      return true;
    });
  }, [orders, filters]);

  // Memoizar handler de cambio
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  return {
    filters,
    filteredOrders,
    handleFilterChange,
    clearFilters
  };
}
```

**Checklist**:
- [ ] Hook empieza con `use`
- [ ] Encapsula estado relacionado
- [ ] Usa `useCallback` para funciones que se pasan como dependencias
- [ ] Usa `useMemo` para cálculos costosos
- [ ] Retorna objeto con API clara
- [ ] Documenta parámetros y retorno

#### Paso 5: Crear Componentes UI (2-3 horas)

```javascript
// Ejemplo: src/components/history/FilterBar.jsx

/**
 * Barra de filtros para histórico de órdenes
 */
export function FilterBar({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Estado:</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="recibido">Recibidos</option>
          <option value="proceso">En Proceso</option>
          <option value="listo">Listos</option>
          <option value="entregado">Entregados</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Buscar:</label>
        <input
          type="text"
          placeholder="Cliente o teléfono..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Desde:</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Hasta:</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange('dateTo', e.target.value)}
        />
      </div>

      <button className="btn-secondary" onClick={onClearFilters}>
        Limpiar Filtros
      </button>
    </div>
  );
}
```

**Checklist**:
- [ ] Componente tiene menos de 150 líneas
- [ ] Props están claramente definidas
- [ ] Solo maneja UI, no lógica de negocio
- [ ] Usa callbacks para comunicarse con padre
- [ ] Nombres de props son descriptivos

#### Paso 6: Refactorizar Componente Principal (1-2 horas)

```javascript
// src/components/OrderHistory.jsx - REFACTORIZADO

import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { FilterBar } from './history/FilterBar';
import { OrdersList } from './history/OrdersList';
import { OrderDetailModal } from './history/OrderDetailModal';

const OrderHistory = () => {
  // Hooks personalizados
  const { orders, isLoading, refetch } = useOrders();
  const { filters, filteredOrders, handleFilterChange, clearFilters } = useOrderFilters(orders);

  // Estado UI local
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handlers de coordinación
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="order-history">
      <h2>Histórico de Órdenes</h2>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <OrdersList
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
      />

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default OrderHistory;
```

**Checklist**:
- [ ] Componente usa solo hooks personalizados
- [ ] Lógica de negocio está en hooks/utils
- [ ] JSX está dividido en componentes pequeños
- [ ] Solo coordina entre componentes hijos
- [ ] Fácil de leer y entender el flujo

#### Paso 7: Testing y Verificación (30 min - 1 hora)

```bash
# 1. Verificar que no hay errores de importación
npm run dev

# 2. Probar todas las funcionalidades:
#    - Crear orden
#    - Editar orden
#    - Filtrar órdenes
#    - Cambiar estados
#    - Etc.

# 3. Verificar consola del navegador
#    - No debe haber errores
#    - No debe haber warnings de infinite loops
#    - No debe haber warnings de dependencies

# 4. Verificar performance
#    - No debe haber lag al escribir
#    - Filtros deben responder instantáneamente
```

**Checklist de pruebas**:
- [ ] Aplicación carga sin errores
- [ ] Todas las funcionalidades previas funcionan
- [ ] No hay infinite loops (revisar consola)
- [ ] No hay warnings de React
- [ ] Performance es buena (no lag)
- [ ] Hot Module Replacement funciona

#### Paso 8: Commit (15 min)

```bash
# Ver cambios
git status
git diff

# Crear commit descriptivo
git add .
git commit -m "Refactor [ComponentName]: Modular architecture ([ANTES] → [DESPUÉS] lines)

- Extract utilities to src/utils/[dominio]/
- Create custom hooks in src/hooks/
- Break UI into small components in src/components/[dominio]/
- Reduce complexity and improve maintainability

Files created:
- src/utils/[dominio]/[helpers].js
- src/hooks/use[Hook].js
- src/components/[dominio]/[Component].jsx

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Errores Comunes y Soluciones

### Error 1: Infinite Loop - "Maximum update depth exceeded"

**Síntoma**: Consola muestra error de máxima profundidad de actualizaciones

**Causa común**:
```javascript
// ❌ INCORRECTO
const [data, setData] = useState([]);

const processData = async () => {
  const result = await fetchData();
  setData(result);
};

// Arrays/objetos se recrean en cada render
useEffect(() => {
  processData();
}, [data]); // ❌ Infinite loop!
```

**Solución**:
```javascript
// ✅ CORRECTO - Opción 1: Memoizar la función
const processData = useCallback(async () => {
  const result = await fetchData();
  setData(result);
}, []); // Solo se crea una vez

useEffect(() => {
  processData();
}, [processData]); // Solo se ejecuta cuando processData cambia

// ✅ CORRECTO - Opción 2: No incluir state en dependencias si no es necesario
useEffect(() => {
  const processData = async () => {
    const result = await fetchData();
    setData(result);
  };
  processData();
}, []); // Solo se ejecuta una vez al montar
```

### Error 2: Stale Closures

**Síntoma**: Callback usa valor antiguo de state

**Causa**:
```javascript
// ❌ INCORRECTO
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1); // Si se llama múltiples veces rápido, usa valor viejo
};
```

**Solución**:
```javascript
// ✅ CORRECTO - Usar functional update
const increment = useCallback(() => {
  setCount(prev => prev + 1); // Siempre usa valor actual
}, []); // No depende de count
```

### Error 3: Props Drilling Excesivo

**Síntoma**: Pasando 5+ props a través de múltiples niveles

**Solución**:
```javascript
// ❌ INCORRECTO
<Parent data={data} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} config={config}>
  <Child data={data} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} config={config}>
    <GrandChild data={data} onUpdate={onUpdate} />
  </Child>
</Parent>

// ✅ CORRECTO - Usar Context para datos globales
const OrderContext = createContext();

<OrderContext.Provider value={{ data, onUpdate, onDelete, onEdit, config }}>
  <Parent>
    <Child>
      <GrandChild />
    </Child>
  </Parent>
</OrderContext.Provider>

// En GrandChild:
const { data, onUpdate } = useContext(OrderContext);
```

### Error 4: Dependencias Faltantes en useEffect

**Síntoma**: ESLint warning "React Hook useEffect has a missing dependency"

**Solución**:
```javascript
// ❌ Ignorar el warning es peligroso
useEffect(() => {
  processData(externalValue);
}, []); // eslint-disable-line react-hooks/exhaustive-deps

// ✅ CORRECTO - Agregar todas las dependencias
useEffect(() => {
  processData(externalValue);
}, [externalValue]); // Si externalValue es objeto/array, memoizarlo

// ✅ O memoizar la función si es el problema
const processData = useCallback((value) => {
  // ... lógica
}, []);

useEffect(() => {
  processData(externalValue);
}, [processData, externalValue]);
```

### Error 5: Mutación Directa de State

**Síntoma**: UI no se actualiza aunque el valor cambió

**Causa**:
```javascript
// ❌ INCORRECTO
const [items, setItems] = useState([]);

const addItem = (item) => {
  items.push(item); // Mutación directa!
  setItems(items); // React no detecta el cambio (misma referencia)
};
```

**Solución**:
```javascript
// ✅ CORRECTO - Crear nuevo array
const addItem = (item) => {
  setItems(prev => [...prev, item]); // Nueva referencia
};

// Para objetos:
const updateUser = (key, value) => {
  setUser(prev => ({ ...prev, [key]: value })); // Nuevo objeto
};
```

---

## Mejores Prácticas

### 1. Nomenclatura Consistente

```javascript
// Utilidades: verbos o sustantivos descriptivos
calculateSubtotal()
validateOrderData()
getEmployeeOrderCount()

// Hooks: siempre empiezan con "use"
useOrderFilters()
useCartManagement()
usePromotionsCalculation()

// Componentes: sustantivos en PascalCase
CustomerInfoSection
CartItem
PromotionsBanner

// Handlers: siempre empiezan con "handle"
handleAddToCart()
handleFilterChange()
handleSubmitOrder()
```

### 2. Organización de Imports

```javascript
// 1. React y librerías externas
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Contextos y hooks personalizados
import { useAuth } from '../contexts/AuthContext';
import { useOrderFilters } from '../hooks/useOrderFilters';

// 3. Componentes
import { FilterBar } from './history/FilterBar';
import { OrdersList } from './history/OrdersList';

// 4. Utilidades
import { calculateSubtotal } from '../utils/promotions/promotionCalculations';
import { validateOrderData } from '../utils/orders/orderHelpers';

// 5. Estilos (si aplica)
import './OrderHistory.css';
```

### 3. Estructura de Componente

```javascript
const MyComponent = ({ prop1, prop2, onAction }) => {
  // 1. Hooks de contexto
  const { user } = useAuth();

  // 2. Hooks de datos
  const { data, isLoading } = useQuery(['key'], fetchFn);

  // 3. Hooks personalizados
  const { filters, handleFilterChange } = useOrderFilters(data);

  // 4. Estado local
  const [showModal, setShowModal] = useState(false);

  // 5. Efectos
  useEffect(() => {
    // ...
  }, []);

  // 6. Callbacks memoizados
  const handleClick = useCallback(() => {
    // ...
  }, []);

  // 7. Valores memoizados
  const expensiveValue = useMemo(() => {
    // ...
  }, [dependency]);

  // 8. Handlers normales (si no necesitan memoización)
  const handleSimpleClick = () => {
    // ...
  };

  // 9. Early returns
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // 10. Render principal
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### 4. Cuándo Usar useMemo y useCallback

```javascript
// ✅ Usar useMemo para:
// - Cálculos costosos
const sortedList = useMemo(() =>
  items.sort((a, b) => a.price - b.price),
  [items]
);

// - Objetos que se pasan como props/dependencias
const config = useMemo(() => ({
  theme: 'dark',
  locale: 'es'
}), []);

// ✅ Usar useCallback para:
// - Funciones que se pasan a useEffect
const fetchData = useCallback(async () => {
  // ...
}, [dependency]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// - Funciones que se pasan a componentes memoizados
const MemoizedChild = React.memo(Child);
const handleClick = useCallback(() => {
  // ...
}, []);

<MemoizedChild onClick={handleClick} />

// ❌ NO usar useMemo/useCallback para:
// - Valores primitivos simples
const count = data.length; // No necesita useMemo

// - Funciones que solo se usan en el JSX actual
const handleClick = () => setCount(c => c + 1); // No necesita useCallback
<button onClick={handleClick}>Click</button>
```

### 5. Manejo de Errores

```javascript
// En utilidades: throw errors o return error objects
export function validateOrderData(data) {
  const errors = {};
  if (!data.client) errors.client = 'Requerido';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// En hooks: return error state
export function useOrderSubmit() {
  const [error, setError] = useState(null);

  const submit = async (data) => {
    try {
      setError(null);
      await api.createOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { submit, error };
}

// En componentes: mostrar errors al usuario
const { submit, error } = useOrderSubmit();

return (
  <>
    {error && <div className="error">{error}</div>}
    <button onClick={submit}>Submit</button>
  </>
);
```

### 6. Documentación con JSDoc

```javascript
/**
 * Calcula el subtotal del carrito sumando precio × cantidad de cada item
 *
 * @param {Array<Object>} cart - Array de items del carrito
 * @param {string} cart[].id - ID único del item
 * @param {number} cart[].price - Precio unitario del item
 * @param {number} cart[].quantity - Cantidad de items
 * @returns {number} Subtotal calculado
 *
 * @example
 * const cart = [
 *   { id: '1', price: 100, quantity: 2 },
 *   { id: '2', price: 50, quantity: 1 }
 * ];
 * const subtotal = calculateSubtotal(cart); // 250
 */
export function calculateSubtotal(cart) {
  return cart.reduce((total, item) =>
    total + (item.price || 0) * (item.quantity || 1),
    0
  );
}
```

---

## Checklist Final para Cada Refactorización

### Pre-Refactorización
- [ ] Componente identificado y analizado
- [ ] Backup creado (`.ORIGINAL.jsx`)
- [ ] Directorios necesarios creados
- [ ] Plan de extracción definido

### Durante Refactorización
- [ ] Utilidades extraídas y testeadas
- [ ] Hooks personalizados creados con `useCallback` apropiado
- [ ] Componentes UI creados (< 150 líneas cada uno)
- [ ] Componente principal refactorizado
- [ ] Imports organizados correctamente

### Post-Refactorización
- [ ] Aplicación corre sin errores
- [ ] Todas las funcionalidades funcionan
- [ ] No hay infinite loops
- [ ] No hay warnings de React/ESLint
- [ ] Performance es buena
- [ ] Commit creado con mensaje descriptivo

---

## Recursos y Referencias

### Commits de Referencia

- **Commit 1**: `21d411a` - "Refactor OrderForm.jsx: Modular architecture (1,368 → 498 lines)"
  - Ver este commit para estructura completa de refactorización

- **Commit 2**: `afa65e0` - "Fix: Infinite loop en usePromotionsCalculation hook"
  - Ver este commit para ejemplo de cómo resolver infinite loops

### Archivos de Referencia

- `src/components/OrderForm.jsx` - Componente refactorizado (modelo a seguir)
- `src/components/OrderForm.ORIGINAL.jsx` - Versión original (para comparar)
- `src/hooks/usePromotionsCalculation.js` - Hook con patrón correcto de useCallback
- `src/utils/promotions/promotionHelpers.js` - Ejemplo de utilidades bien documentadas

### Patrones de React

- [React Hooks Documentation](https://react.dev/reference/react)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useEffect](https://react.dev/reference/react/useEffect)

---

## Próximos Pasos Sugeridos

1. **Continuar refactorizando componentes grandes** siguiendo este guía
   - Empezar con OrderDetailView.jsx
   - Seguir con OrderHistory.jsx
   - Luego CashRegister.jsx

2. **Crear tests unitarios** para utilidades y hooks
   - Usar Vitest (ya incluido en el proyecto)
   - Empezar con utils (no dependen de React)
   - Seguir con hooks usando @testing-library/react-hooks

3. **Extraer biblioteca de componentes** una vez refactorizado
   - Identificar componentes verdaderamente genéricos
   - Crear paquete separado o directorio compartido
   - Documentar uso y props

4. **Implementar TypeScript** (opcional)
   - Mejora seguridad de tipos
   - Mejor autocompletado
   - Documentación automática de interfaces

---

## Contacto y Soporte

Para dudas o problemas durante la refactorización:

1. Revisar esta guía completa
2. Comparar con commits de referencia
3. Revisar archivos ya refactorizados como modelo
4. Consultar documentación oficial de React

**Última actualización**: Diciembre 2025
**Versión**: 1.0

---

Este documento es un trabajo vivo. Actualízalo según aprendas nuevos patrones o encuentres mejores soluciones durante el proceso de refactorización.
