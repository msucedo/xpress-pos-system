# Sistema de Animaciones

Sistema centralizado de animaciones con **Framer Motion** - Estilo Apple (200-300ms, suaves y elegantes).

## 📁 Estructura

```
src/
├── animations/
│   ├── variants.js      # Variantes de animación
│   ├── transitions.js   # Configuraciones de timing
│   └── index.js         # Exports centralizados
└── components/
    └── animated/
        ├── AnimatedModal.jsx
        ├── AnimatedForm.jsx
        ├── AnimatedTabs.jsx
        ├── AnimatedCard.jsx
        ├── AnimatedNotification.jsx
        └── index.js
```

## 🎯 Componentes Animados

### AnimatedModal

Modal con animaciones de entrada/salida suaves.

**Uso:**
```jsx
import { AnimatedModal } from '@/components/animated';

<AnimatedModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Mi Modal"
  size="medium"
>
  <p>Contenido del modal</p>
</AnimatedModal>
```

**Props:**
- `isOpen` (boolean): Si el modal está abierto
- `onClose` (function): Función para cerrar
- `title` (string): Título del modal
- `headerContent` (ReactNode): Contenido custom del header (opcional)
- `size` (string): 'small' | 'medium' | 'large' | 'full'

**Animaciones:**
- Backdrop: Fade in/out (200ms)
- Content: Slide up + scale (300ms)
- Responsive con ESC key y click outside

---

### AnimatedForm

Formulario con feedback visual animado.

**Uso:**
```jsx
import { AnimatedForm } from '@/components/animated';

const [isSubmitting, setIsSubmitting] = useState(false);
const [feedback, setFeedback] = useState(null);

<AnimatedForm
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
  feedback={feedback}
  feedbackType="success"
  submitButtonProps={{
    text: 'Guardar',
    loadingText: 'Guardando...',
    successText: 'Guardado',
  }}
>
  <input name="email" />
  <input name="password" />
</AnimatedForm>
```

**Props:**
- `onSubmit` (function): Handler del submit
- `isSubmitting` (boolean): Estado de loading
- `feedback` (string): Mensaje de feedback
- `feedbackType` (string): 'success' | 'error'
- `submitButtonProps` (object): Config del botón

**Animaciones:**
- Submit button: Scale on click (100ms)
- Loading: Spinner rotation (600ms)
- Success: Scale bounce (spring)
- Error: Shake (300ms)

---

### AnimatedTabs

Sistema de tabs con transiciones suaves entre contenido.

**Uso:**
```jsx
import { AnimatedTabs } from '@/components/animated';
import { Icon } from '@/icons';

const tabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    icon: <Icon name="chart" size={20} />,
    content: <Component1 />,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    icon: <Icon name="money" size={20} />,
    content: <Component2 />,
  },
];

<AnimatedTabs
  tabs={tabs}
  defaultTab="tab1"
  onTabChange={(tabId) => console.log(tabId)}
  responsive={true}
/>
```

**Props:**
- `tabs` (array): Array de objetos { id, label, icon, content }
- `defaultTab` (string): ID de la tab por defecto
- `onTabChange` (function): Callback cuando cambia la tab
- `responsive` (boolean): Mostrar select en móvil

**Animaciones:**
- Content slide: Direccional (300ms)
- Active indicator: Spring motion (smooth)
- Responsive: Select en mobile, buttons en desktop

**Ejemplo completo:** Ver `src/pages/Reports.jsx`

---

### AnimatedCard

Card con micro-interactions (hover, tap).

**Uso:**
```jsx
import { AnimatedCard } from '@/components/animated';

<AnimatedCard
  hoverable={true}
  clickable={true}
  onClick={handleClick}
  className="my-card"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</AnimatedCard>
```

**Props:**
- `hoverable` (boolean): Efecto hover (default: true)
- `clickable` (boolean): Efecto tap (default: false)
- `onClick` (function): Handler de click
- `className` (string): Clases CSS adicionales

**Animaciones:**
- Hover: Lift (scale 1.02, translateY -4px) - 200ms
- Tap: Press (scale 0.98) - 100ms

---

### AnimatedNotification

Notificación toast con auto-close.

**Uso:**
```jsx
import { AnimatedNotification } from '@/components/animated';

<AnimatedNotification
  isVisible={showNotif}
  message="Cambios guardados"
  type="success"
  onClose={() => setShowNotif(false)}
  duration={3000}
/>
```

**Props:**
- `isVisible` (boolean): Si está visible
- `message` (string): Mensaje
- `type` (string): 'success' | 'error' | 'warning' | 'info'
- `onClose` (function): Callback al cerrar
- `duration` (number): Auto-close en ms (0 = no auto-close)

**Animaciones:**
- Enter: Slide from right + scale (300ms)
- Exit: Slide to right + scale (300ms)
- Position: Fixed top-right

---

## 🎨 Sistema de Variantes y Transiciones

### Usar variantes directamente

```jsx
import { motion } from 'framer-motion';
import { fadeVariants, transitions } from '@/animations';

<motion.div
  variants={fadeVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={transitions.normal}
>
  Contenido
</motion.div>
```

### Variantes disponibles

Ver `src/animations/variants.js`:
- `modalBackdropVariants`
- `modalContentVariants`
- `formSubmitVariants`
- `formFeedbackVariants`
- `tabContentVariants`
- `cardVariants`
- `notificationVariants`
- `fadeVariants`
- `scaleVariants`
- `slideVariants` (fromBottom, fromTop, fromRight, fromLeft)
- `spinnerVariants`
- `pulseVariants`
- `pageVariants`

### Transiciones disponibles

Ver `src/animations/transitions.js`:
- `transitions.fast` (200ms)
- `transitions.normal` (300ms)
- `transitions.slow` (500ms)
- `transitions.spring` (suave)
- `transitions.bouncy` (rebote)

---

## 📝 Guía de Migración

### Migrar un Modal

**Antes:**
```jsx
import Modal from '../components/Modal';

<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</Modal>
```

**Después:**
```jsx
import { AnimatedModal } from '../components/animated';

<AnimatedModal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</AnimatedModal>
```

La API es idéntica, solo cambiar el import.

### Migrar Tabs

**Antes:**
```jsx
<div className="tabs">
  <button onClick={() => setTab('tab1')}>Tab 1</button>
  <button onClick={() => setTab('tab2')}>Tab 2</button>
</div>
{tab === 'tab1' && <Content1 />}
{tab === 'tab2' && <Content2 />}
```

**Después:**
```jsx
import { AnimatedTabs } from '../components/animated';
import { Icon } from '../icons';

const tabs = [
  { id: 'tab1', label: 'Tab 1', icon: <Icon name="chart" />, content: <Content1 /> },
  { id: 'tab2', label: 'Tab 2', icon: <Icon name="money" />, content: <Content2 /> },
];

<AnimatedTabs tabs={tabs} defaultTab="tab1" onTabChange={setTab} />
```

---

## ⚡ Performance

- **Tree-shaking**: Solo importa las variantes que uses
- **Motion values**: Usa GPU para animaciones smooth
- **AnimatePresence**: Maneja mount/unmount correctamente
- **Reduced motion**: Respeta `prefers-reduced-motion` (futuro)

---

## 🎯 Mejores Prácticas

1. **Usa los componentes animados** en lugar de crear animaciones custom
2. **Mantén las duraciones consistentes** (200-300ms)
3. **No animes demasiadas propiedades** a la vez (max 2-3)
4. **Usa `layoutId`** para animaciones compartidas entre elementos
5. **AnimatePresence** es necesario para exit animations

---

## 🔗 Referencias

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Variants](https://www.framer.com/motion/animation/##variants)
- [AnimatePresence](https://www.framer.com/motion/animate-presence/)
