import { useState, useEffect } from 'react';
import { useAdminCheck } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { ValidatedTextInput, ValidatedPhoneInput, ValidatedEmailInput } from './inputs';
import { IconPickerButton } from './iconPicker';
import './EmpleadoForm.css';

const EmpleadoForm = ({ onSubmit, onCancel, onDelete, initialData }) => {
  const isCurrentUserAdmin = useAdminCheck();
  const { showValidationErrors } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    hireDate: '',
    status: 'active',
    notes: '',
    emoji: '',
    isAdmin: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        role: initialData.role || '',
        hireDate: initialData.hireDate || '',
        status: initialData.status || 'active',
        notes: initialData.notes || '',
        emoji: initialData.emoji || '',
        isAdmin: initialData.isAdmin || false
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Debe ser un correo de Gmail (@gmail.com)';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'El rol es requerido';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'La fecha de contratación es requerida';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir múltiples clics
    if (isSubmitting) {
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      showValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting employee:', error);
      // El error ya se maneja en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (initialData && initialData.id) {
      onDelete(initialData.id);
    }
  };

  return (
    <form className="empleado-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <ValidatedTextInput
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Nombre Completo"
          placeholder="Juan Pérez"
          required={true}
          error={errors.name}
        />

        <ValidatedPhoneInput
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          label="Teléfono"
          placeholder="1234567890"
          required={true}
          error={errors.phone}
        />

        <ValidatedEmailInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email (Gmail)"
          placeholder="empleado@gmail.com"
          required={true}
          error={errors.email}
          hint="Debe ser una cuenta de Gmail (@gmail.com)"
        />

        <ValidatedTextInput
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Rol/Puesto"
          placeholder="Ej: Técnico, Vendedor, Gerente"
          required={true}
          error={errors.role}
        />

        <div className="form-group">
          <label htmlFor="hireDate">Fecha de Contratación *</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className={errors.hireDate ? 'error' : ''}
          />
          {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        {/* Campo Administrador - Solo visible para admins */}
        {isCurrentUserAdmin && (
          <div className="form-group">
            <label htmlFor="isAdmin" className="checkbox-label">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
              />
              <span className="checkbox-text">
                👑 Administrador
              </span>
            </label>
            <span className="field-hint">
              Los administradores pueden eliminar, cancelar órdenes y agregar servicios/inventario
            </span>
          </div>
        )}

        <IconPickerButton
          label="Icono del Empleado (opcional)"
          value={formData.emoji}
          onChange={(iconName) => setFormData({ ...formData, emoji: iconName })}
          category="characters"
          placeholder="Seleccionar personaje"
        />

        <div className="form-group full-width">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Información adicional sobre el empleado..."
            rows="4"
          />
        </div>
      </div>

      <div className="form-actions">
        <div className="form-actions-left">
          {initialData && isCurrentUserAdmin && (
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}
        </div>
        <div className="form-actions-right">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting
              ? '⏳ Guardando...'
              : (initialData ? 'Guardar Cambios' : 'Agregar Empleado')
            }
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmpleadoForm;
