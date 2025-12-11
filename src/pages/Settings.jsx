import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import PrinterSettings from '../components/PrinterSettings';
import SettingsFormSkeleton from '../components/SettingsFormSkeleton';
import ToggleSkeleton from '../components/ToggleSkeleton';
import { downloadBackup, getBackupInfo } from '../utils/backup';
import { saveBusinessProfile, getBusinessProfile, saveWhatsAppConfig, getWhatsAppConfig } from '../services/firebaseService';
import { useNotification } from '../hooks/useNotification';
import { useAdminCheck } from '../hooks/useAuth';
import {
  getPrinterMethodPreference,
  setPrinterMethodPreference,
  PRINTER_METHODS,
  PRINTER_METHOD_LABELS,
  PRINTER_METHOD_DESCRIPTIONS
} from '../utils/printerConfig';
import { detectPlatform } from '../services/printService';
import './Settings.css';

const Settings = () => {
  const { showSuccess, showError } = useNotification();
  const isAdmin = useAdminCheck();

  // Business Profile State
  const [businessName, setBusinessName] = useState('Clean Master Shoes');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Backup State
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupInfo, setBackupInfo] = useState(null);

  // Printer Method State
  const [printerMethod, setPrinterMethod] = useState(PRINTER_METHODS.AUTO);
  const [detectedPlatform, setDetectedPlatform] = useState(null);

  // WhatsApp Config State
  const [enableOrderReceived, setEnableOrderReceived] = useState(null);
  const [enableDeliveryReady, setEnableDeliveryReady] = useState(null);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(true);

  // Load business profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getBusinessProfile();

        setBusinessName(profile.businessName || 'Clean Master Shoes');
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
      } catch (error) {
        console.error('Error loading business profile:', error);
        showError('Error al cargar el perfil del negocio');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [showError]);

  // Load WhatsApp config on component mount
  useEffect(() => {
    const loadWhatsAppConfig = async () => {
      try {
        setWhatsappLoading(true);
        const config = await getWhatsAppConfig();

        setEnableOrderReceived(config.enableOrderReceived ?? true);
        setEnableDeliveryReady(config.enableDeliveryReady ?? true);
      } catch (error) {
        console.error('Error loading WhatsApp config:', error);
        showError('Error al cargar configuración de WhatsApp');
      } finally {
        setWhatsappLoading(false);
      }
    };

    loadWhatsAppConfig();
  }, [showError]);

  // Load printer method preference and detect platform
  useEffect(() => {
    const preference = getPrinterMethodPreference();
    setPrinterMethod(preference);

    const platform = detectPlatform();
    setDetectedPlatform(platform);
  }, []);

  const handleSaveProfile = async () => {
    // Verificar permisos de admin
    if (!isAdmin) {
      showError('Solo los administradores pueden guardar cambios de configuración');
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        businessName,
        phone,
        address
      };

      await saveBusinessProfile(profileData);

      showSuccess('Perfil guardado exitosamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      showError(error.message || 'Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = async () => {
    try {
      setLoading(true);
      const profile = await getBusinessProfile();

      setBusinessName(profile.businessName || 'Clean Master Shoes');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');

      showSuccess('Cambios descartados');
    } catch (error) {
      console.error('Error reloading profile:', error);
      showError('Error al recargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    setBackupLoading(true);
    try {
      const result = await downloadBackup();
      showSuccess(`Backup descargado: ${result.filename}`);

      // Get updated backup info
      const info = await getBackupInfo();
      setBackupInfo(info);
    } catch (error) {
      console.error('Error downloading backup:', error);
      showError('Error al descargar el backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleGetBackupInfo = async () => {
    try {
      const info = await getBackupInfo();
      setBackupInfo(info);
    } catch (error) {
      console.error('Error getting backup info:', error);
      showError('Error al obtener información del backup');
    }
  };

  const handlePrinterMethodChange = (method) => {
    setPrinterMethod(method);
    const success = setPrinterMethodPreference(method);
    if (success) {
      showSuccess('Método de impresión guardado');
    } else {
      showError('Error al guardar el método de impresión');
    }
  };

  const handleSaveWhatsAppConfig = async () => {
    // Verificar permisos de admin
    if (!isAdmin) {
      showError('Solo los administradores pueden guardar cambios de configuración');
      return;
    }

    setWhatsappSaving(true);
    try {
      const configData = {
        enableOrderReceived,
        enableDeliveryReady
      };

      await saveWhatsAppConfig(configData);

      showSuccess('Configuración de WhatsApp guardada exitosamente');
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      showError(error.message || 'Error al guardar configuración de WhatsApp');
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleCancelWhatsAppConfig = async () => {
    try {
      setWhatsappLoading(true);
      const config = await getWhatsAppConfig();

      setEnableOrderReceived(config.enableOrderReceived ?? true);
      setEnableDeliveryReady(config.enableDeliveryReady ?? true);

      showSuccess('Cambios descartados');
    } catch (error) {
      console.error('Error reloading WhatsApp config:', error);
      showError('Error al recargar configuración');
    } finally {
      setWhatsappLoading(false);
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <PageHeader title="Configuración" />

      {/* Settings Grid */}
      <div className="settings-grid">
        {/* Perfil del Negocio */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon profile">🏪</div>
            <div>
              <div className="section-title">Perfil del Negocio</div>
              <div className="section-subtitle">Información básica</div>
            </div>
          </div>

          {loading ? (
            <SettingsFormSkeleton rows={3} />
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Nombre del Negocio</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Nombre del negocio"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Teléfono de contacto"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección del local"
                />
              </div>

              <div className="btn-group">
                <button
                  className="btn-primary"
                  onClick={handleSaveProfile}
                  disabled={saving || loading}
                >
                  {saving ? '⏳ Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCancelProfile}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Backup de Datos */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon backup">💾</div>
            <div>
              <div className="section-title">Backup de Datos</div>
              <div className="section-subtitle">Respalda tu información</div>
            </div>
          </div>

          <div className="backup-info">
            <p className="backup-description">
              Descarga una copia de seguridad completa de todos tus datos en formato JSON.
              Incluye órdenes, servicios, clientes, empleados, inventario, gastos, cortes de caja y configuraciones.
            </p>

            {backupInfo && (
              <div className="backup-stats">
                <div className="stat-item">
                  <div className="stat-label">Órdenes</div>
                  <div className="stat-value">{backupInfo.ordersCount}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Servicios</div>
                  <div className="stat-value">{backupInfo.servicesCount}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Clientes</div>
                  <div className="stat-value">{backupInfo.clientsCount}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Empleados</div>
                  <div className="stat-value">{backupInfo.employeesCount}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Inventario</div>
                  <div className="stat-value">{backupInfo.inventoryCount || 0}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Gastos</div>
                  <div className="stat-value">{backupInfo.expensesCount || 0}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Cortes de Caja</div>
                  <div className="stat-value">{backupInfo.cashClosuresCount || 0}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Configuración</div>
                  <div className="stat-value">{backupInfo.settingsCount}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Tamaño</div>
                  <div className="stat-value">{backupInfo.size}</div>
                </div>
              </div>
            )}

            <div className="btn-group">
              <button
                className="btn-primary"
                onClick={handleDownloadBackup}
                disabled={backupLoading}
              >
                {backupLoading ? '⏳ Generando...' : '💾 Descargar Backup'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleGetBackupInfo}
                disabled={backupLoading}
              >
                📊 Ver Info
              </button>
            </div>

            <div className="backup-note">
              <strong>Nota:</strong> Tus datos también están respaldados automáticamente en Firebase.
              Este backup manual es una copia adicional de seguridad.
            </div>
          </div>
        </div>

        {/* Configuración de WhatsApp */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon whatsapp">💬</div>
            <div>
              <div className="section-title">Configuración de WhatsApp</div>
              <div className="section-subtitle">Controla el envío de notificaciones</div>
            </div>
          </div>

          {whatsappLoading ? (
            <ToggleSkeleton count={2} />
          ) : (
            <div className="whatsapp-config">
              <p className="config-description">
                Activa o desactiva el envío de notificaciones automáticas de WhatsApp a tus clientes.
              </p>

              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <div className="toggle-title">Notificación de Orden Recibida</div>
                    <div className="toggle-description">
                      Envía mensaje automático cuando se crea una orden (plantilla: orden_recibida_foto)
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={enableOrderReceived}
                      onChange={(e) => setEnableOrderReceived(e.target.checked)}
                      disabled={whatsappLoading}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <div className="toggle-title">Notificación de Orden Lista</div>
                    <div className="toggle-description">
                      Envía mensaje automático cuando la orden está lista para entrega (plantilla: orden_lista_entrega)
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={enableDeliveryReady}
                      onChange={(e) => setEnableDeliveryReady(e.target.checked)}
                      disabled={whatsappLoading}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="btn-group">
                <button
                  className="btn-primary"
                  onClick={handleSaveWhatsAppConfig}
                  disabled={whatsappSaving || whatsappLoading}
                >
                  {whatsappSaving ? '⏳ Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCancelWhatsAppConfig}
                  disabled={whatsappLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Método de Impresión */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon printer">🖨️</div>
            <div>
              <div className="section-title">Método de Impresión</div>
              <div className="section-subtitle">Selecciona cómo imprimir tickets</div>
            </div>
          </div>

          <div className="printer-method-options">
            {Object.entries(PRINTER_METHODS).map(([key, value]) => (
              <div key={value} className="radio-option">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="printerMethod"
                    value={value}
                    checked={printerMethod === value}
                    onChange={(e) => handlePrinterMethodChange(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-content">
                    <div className="radio-title">{PRINTER_METHOD_LABELS[value]}</div>
                    <div className="radio-description">{PRINTER_METHOD_DESCRIPTIONS[value]}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Configuración de Impresora Bluetooth - Solo visible cuando método es Bluetooth */}
          {printerMethod === PRINTER_METHODS.BLUETOOTH && (
            <div className="bluetooth-settings-container">
              <PrinterSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
