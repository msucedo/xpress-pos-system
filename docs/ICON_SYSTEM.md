# Sistema de Iconos

Sistema centralizado de iconos con **Iconify** y **flat-color-icons** - Reemplaza emojis con iconos profesionales y consistentes.

## 📁 Estructura

```
src/
└── icons/
    ├── Icon.jsx       # Componente wrapper
    ├── iconMap.js     # Diccionario semántico
    └── index.js       # Exports centralizados
```

## 🎯 Uso Básico

### Componente Icon

```jsx
import { Icon } from '@/icons';

// Uso simple con nombre semántico
<Icon name="package" size={24} />
<Icon name="chart" size={32} />
<Icon name="success" size={20} />

// Con clases CSS adicionales
<Icon name="money" size={24} className="my-icon" />

// Con estilos inline
<Icon name="error" size={20} style={{ marginRight: '8px' }} />
```

**Props:**
- `name` (string): Nombre semántico del icono (ver iconMap)
- `size` (number): Tamaño en px (default: 24)
- `className` (string): Clases CSS adicionales
- `color` (string): Color (solo para iconos no-coloreados, default: 'inherit')
- `style` (object): Estilos inline adicionales

---

## 🗺️ Diccionario de Iconos (iconMap)

Los iconos se organizan por categorías semánticas. Usa el nombre semántico en lugar del emoji:

### Productos e Inventario
- `package` → 📦
- `box` → 📦
- `product` → 📦
- `inventory` → 🏪
- `shop` → 🏪
- `store` → 🏪

### Promociones y Celebraciones
- `celebration` → 🎉
- `promotion` → 🎉
- `offer` → 🎁
- `gift` → 🎁
- `sparkles` → ✨

### Success & Confirmaciones
- `success` → ✓
- `checkmark` → ✓
- `check` → ✓
- `approve` → 👍
- `thumbs-up` → 👍
- `like` → 👍

### Errores y Warnings
- `error` → ✕
- `cancel` → ✕
- `delete` → 🗑️
- `remove` → ✕
- `close` → ✕
- `warning` → ⚠️
- `alert` → ⚠️
- `danger` → ⚠️

### Reportes y Analytics
- `chart` → 📊
- `bar-chart` → 📊
- `line-chart` → 📈
- `pie-chart` → 🥧
- `statistics` → 📊
- `dashboard` → 📊
- `reports` → 📋

### Dinero y Finanzas
- `money` → 💰
- `cash` → 💵
- `payment` → 💳
- `credit-card` → 💳
- `wallet` → 👛
- `invoice` → 📄
- `expense` → 💸
- `withdraw` → 💸

### Documentos y Archivos
- `document` → 📋
- `file` → 📄
- `list` → 📝
- `history` → 📜
- `clipboard` → 📋
- `note` → 📝
- `archive` → 📁

### Calendario y Tiempo
- `calendar` → 📅
- `date` → 📅
- `time` → ⏰
- `clock` → ⏰
- `schedule` → 📅
- `deadline` → ⏱️

### Acciones
- `save` → 💾
- `backup` → 💾
- `edit` → ✏️
- `add` → ➕
- `plus` → ➕
- `minus` → ➖
- `search` → 🔍
- `filter` → 🔎
- `settings` → ⚙️
- `config` → ⚙️
- `print` → 🖨️
- `download` → ⬇️
- `upload` → ⬆️
- `share` → 📤
- `sync` → 🔄

### Usuarios y Personas
- `user` → 👤
- `client` → 👤
- `customer` → 👥
- `employee` → 👨‍💼
- `team` → 👥
- `profile` → 👤
- `admin` → 👨‍💼

### Comunicación
- `notification` → 🔔
- `message` → 💬
- `email` → 📧
- `phone` → 📞
- `call` → 📞
- `chat` → 💬

### Navegación
- `home` → 🏠
- `back` → ⬅️
- `forward` → ➡️
- `up` → ⬆️
- `down` → ⬇️
- `left` → ⬅️
- `right` → ➡️
- `menu` → ☰
- `more` → ⋯

### Estados
- `loading` → ⏳
- `processing` → ⚙️
- `pending` → ⏳
- `completed` → ✅
- `active` → ⚡
- `inactive` → 🔴
- `locked` → 🔒
- `unlocked` → 🔓

### Commerce & Shopping
- `cart` → 🛒
- `order` → 📦
- `delivery` → 🚚
- `shipping` → 📦
- `tag` → 🏷️
- `discount` → 💰
- `sale` → 💰

### Tech & System
- `database` → 🗄️
- `server` → 🖥️
- `api` → 🔌
- `code` → 💻
- `bug` → 🐛
- `launch` → 🚀
- `rocket` → 🚀

### Misc
- `info` → ℹ️
- `help` → ❓
- `question` → ❓
- `star` → ⭐
- `favorite` → ❤️
- `bookmark` → 🔖
- `flag` → 🚩

---

## 📝 Guía de Migración

### Migrar Emojis a Iconos

**Antes:**
```jsx
<button>📦 Productos</button>
<div className="icon">🎉</div>
<span>{emoji}</span>
```

**Después:**
```jsx
import { Icon } from '@/icons';

<button><Icon name="package" size={20} /> Productos</button>
<div className="icon"><Icon name="celebration" size={24} /></div>
<span><Icon name={iconName} size={18} /></span>
```

### Migrar en Componentes de Tab

**Antes:**
```jsx
<button className="tab">
  📊 Reportes
</button>
```

**Después:**
```jsx
import { Icon } from '@/icons';

<button className="tab">
  <Icon name="chart" size={20} /> Reportes
</button>
```

### Migrar en Constantes/Utils

**Antes:**
```js
// inventoryConstants.js
export const DEFAULT_EMOJI = '📦';
```

**Después:**
```jsx
// No uses emoji directo en constantes, usa Icon en el componente:
import { Icon } from '@/icons';

// En el componente:
<Icon name="package" size={24} />
```

O si necesitas el nombre:
```js
// inventoryConstants.js
export const DEFAULT_ICON = 'package';

// En el componente:
import { DEFAULT_ICON } from '../utils/inventoryConstants';
<Icon name={DEFAULT_ICON} size={24} />
```

### Migrar IconPicker (Selección de Usuario)

Para permitir que usuarios seleccionen iconos (ej. para productos/promociones):

```jsx
import { Icon } from '@/icons';
import { iconMap } from '@/icons';

// Lista de iconos permitidos para selección
const allowedIcons = [
  'package', 'gift', 'celebration', 'money',
  'cart', 'star', 'tag', 'heart'
];

<div className="icon-picker">
  {allowedIcons.map((iconName) => (
    <button
      key={iconName}
      onClick={() => setSelectedIcon(iconName)}
      className={selectedIcon === iconName ? 'active' : ''}
    >
      <Icon name={iconName} size={32} />
    </button>
  ))}
</div>

// Guardar el nombre del icono en la base de datos
// En el display:
<Icon name={product.icon} size={24} />
```

---

## 🔍 Encontrar Iconos

### Buscar en el catálogo completo

Ver todos los iconos disponibles (329 iconos):
- [Iconify Icon Sets - Flat Color Icons](https://icon-sets.iconify.design/flat-color-icons/)
- [React Icons - FC](https://react-icons.github.io/react-icons/icons/fc/)

### Usar un icono no mapeado

Si necesitas un icono específico que no está en el iconMap:

```jsx
// Usar directamente el nombre de flat-color-icons
<Icon name="flat-color-icons:nombre-del-icono" size={24} />

// O agregarlo al iconMap.js:
export const iconMap = {
  // ...
  'mi-nuevo-icono': 'flat-color-icons:nombre-del-icono',
};
```

---

## 🎨 Personalización

### Iconos con Tamaño Dinámico

```jsx
const sizes = { sm: 16, md: 24, lg: 32, xl: 48 };

<Icon name="package" size={sizes.lg} />
```

### Iconos con Clases CSS

```jsx
<Icon name="success" size={20} className="text-green-500" />
<Icon name="error" size={20} className="text-red-500" />
```

### Iconos Inline

```jsx
<p>
  Tu pedido <Icon name="package" size={16} style={{ verticalAlign: 'middle' }} />
  ha sido enviado!
</p>
```

---

## ✅ Beneficios vs Emojis

| Aspecto | Emojis | Flat Color Icons |
|---------|--------|------------------|
| **Consistencia** | ❌ Diferente en cada OS | ✅ Idéntico en todos los OS |
| **Profesional** | ⚠️ Casual | ✅ Profesional |
| **Control** | ❌ No customizable | ✅ Tamaño, color, estilo |
| **Accesibilidad** | ⚠️ Limitado | ✅ aria-label, semantic |
| **Performance** | ✅ Ligero | ✅ SVG optimizado |
| **Branding** | ❌ Genérico | ✅ Consistente |

---

## ✅ Ejemplos Prácticos de Migración

### Páginas Completadas

#### 1. Reports.jsx ✅
**Migración:** AnimatedTabs + Icon
**Ubicación:** `src/pages/Reports.jsx`

```jsx
import { AnimatedTabs } from '../components/animated';
import { Icon } from '../icons';

const tabs = [
  {
    id: 'reportes',
    label: 'Reportes',
    icon: <Icon name="chart" size={20} />,
    content: <ChartsTab {...props} />
  },
  // ...más tabs
];

<AnimatedTabs tabs={tabs} defaultTab="reportes" onTabChange={setActiveTab} />
```

#### 2. Orders.jsx ✅
**Migración:** AnimatedTabs + Icon + Botón icon-only
**Ubicación:** `src/pages/Orders.jsx`

**Botón Nueva Orden:**
```jsx
<PageHeader
  title="Órdenes"
  buttonIcon={<Icon name="add" size={32} />}  // Sin buttonLabel
  onButtonClick={handleOpenNewOrder}
/>
```

**Tabs con AnimatedTabs:**
```jsx
const renderOrdersList = (tabKey) => (
  <div className="orders-list">
    {/* contenido de la tab */}
  </div>
);

const tabs = [
  {
    id: 'recibidos',
    label: 'Recibidos',
    icon: <Icon name="download" size={20} />,
    content: renderOrdersList('recibidos')
  },
  // ...más tabs
];

<AnimatedTabs tabs={tabs} defaultTab="recibidos" onTabChange={setActiveTab} responsive={true} />
```

#### 3. Empleados.jsx ✅
**Migración:** Icon + Botón icon-only
**Ubicación:** `src/pages/Empleados.jsx`

**Antes:**
```jsx
buttonLabel="Agregar Empleado"
buttonIcon="➕"
```

**Después:**
```jsx
buttonIcon={<Icon name="add" size={32} />}  // Sin buttonLabel
```

**Empty State:**
```jsx
// Antes
<div className="empty-icon">😕</div>

// Después
<div className="empty-icon"><Icon name="question" size={48} /></div>
```

#### 4. Dashboard.jsx ✅
**Migración:** Icon (sin tabs)
**Ubicación:** `src/pages/Dashboard.jsx`

```jsx
const stats = [
  { icon: <Icon name="delivery" size={32} />, label: 'Para Entregar', value: '5' },
  { icon: <Icon name="processing" size={32} />, label: 'En Proceso', value: '12' },
  { icon: <Icon name="money" size={32} />, label: 'Pagos Pendientes', value: '3' },
  // ...más stats
];
```

---

## 🚀 Migración Masiva

### Archivos a Migrar

**✅ Completado:**
1. `src/pages/Reports.jsx` - AnimatedTabs + Icon
2. `src/pages/Orders.jsx` - AnimatedTabs + Icon
3. `src/pages/Empleados.jsx` - Icon
4. `src/pages/Dashboard.jsx` - Icon

**Prioridad Alta:**
1. `src/components/PromotionCard.jsx`
2. `src/components/InventoryCard.jsx`
3. `src/utils/inventoryConstants.js`
4. `src/utils/promotions/promotionInitialState.js`

**Prioridad Media:**
- Todos los componentes de formulario (15+ archivos)
- Componentes de modal
- Empty states en otros componentes

**Prioridad Baja:**
- Contexts (AuthContext, CartContext)
- Utils helpers
- Mensajes de error

### Estrategia de Migración

1. **Buscar y reemplazar** emojis comunes:
   - Busca: `📦` → Reemplaza con: `<Icon name="package" size={20} />`
   - Busca: `🎉` → Reemplaza con: `<Icon name="celebration" size={20} />`
   - Busca: `📊` → Reemplaza con: `<Icon name="chart" size={20} />`
   - etc.

2. **Agregar import** en cada archivo:
   ```jsx
   import { Icon } from '../icons'; // Ajustar ruta según nivel
   ```

3. **Verificar tamaños** según contexto:
   - Tabs/Buttons: 20px
   - Cards/Headers: 24px
   - Iconos grandes: 32-48px
   - Inline text: 16-18px

---

## 🔗 Referencias

- [Iconify React Docs](https://iconify.design/docs/icon-components/react/)
- [Flat Color Icons Catalog](https://icon-sets.iconify.design/flat-color-icons/)
- [Icon Component Source](../src/icons/Icon.jsx)
- [Icon Map Source](../src/icons/iconMap.js)
