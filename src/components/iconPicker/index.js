/**
 * Icon Picker Components
 * Sistema de selección visual de iconos
 *
 * @example
 * import { IconPickerButton } from '@/components/iconPicker';
 *
 * <IconPickerButton
 *   label="Icono del Servicio"
 *   value={formData.emoji}
 *   onChange={(iconName) => setFormData({ ...formData, emoji: iconName })}
 *   category="services"
 *   required={true}
 * />
 */

export { default as IconPickerButton } from './IconPickerButton';
export { default as IconPickerModal } from './IconPickerModal';
export { default as IconGrid } from './IconGrid';
export { default as IconCategories } from './IconCategories';
