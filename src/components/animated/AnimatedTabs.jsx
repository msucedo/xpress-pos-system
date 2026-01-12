import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tabContentVariants, tabTransition } from '../../animations';
import OrderStatusDropdown from '../orderDetail/OrderStatusDropdown';
import './AnimatedTabs.css';

/**
 * Sistema de tabs animadas con transiciones suaves
 *
 * @param {Array} tabs - Array de objetos con { id, label, icon, content }
 * @param {string} defaultTab - ID de la tab por defecto
 * @param {function} onTabChange - Callback cuando cambia la tab (opcional)
 * @param {boolean} responsive - Si debe mostrar select en móvil (default: true)
 *
 * @example
 * <AnimatedTabs
 *   tabs={[
 *     { id: 'tab1', label: 'Tab 1', icon: <Icon />, content: <Component1 /> },
 *     { id: 'tab2', label: 'Tab 2', icon: <Icon />, content: <Component2 /> }
 *   ]}
 *   defaultTab="tab1"
 *   onTabChange={(tabId) => console.log(tabId)}
 * />
 */
const AnimatedTabs = ({
  tabs = [],
  defaultTab,
  onTabChange,
  responsive = true,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [direction, setDirection] = useState(0);

  const handleTabChange = (newTabId) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.id === newTabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTabId);
    onTabChange?.(newTabId);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  // Transformar tabs al formato esperado por OrderStatusDropdown
  const dropdownOptions = tabs.map((tab) => ({
    value: tab.id,
    label: tab.label,
    icon: tab.icon?.props?.name, // Extraer nombre del icono del componente <Icon>
    count: tab.count // Pasar el conteo al dropdown
  }));

  return (
    <div className="animated-tabs-container">
      {/* Tab Buttons */}
      <div className="animated-tabs-header">
        {/* Dropdown para móvil (si responsive está activado) */}
        {responsive && (
          <div className="animated-tabs-select-mobile">
            <OrderStatusDropdown
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              options={dropdownOptions}
              placeholder="Seleccionar estado"
            />
          </div>
        )}

        {/* Botones para desktop/tablet */}
        <div className="animated-tabs-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`animated-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
              {tab.count !== undefined && <span className="tab-count">{tab.count}</span>}

              {/* Indicador animado */}
              {activeTab === tab.id && (
                <motion.div
                  className="tab-indicator"
                  layoutId="tabIndicator"
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content con animaciones */}
      <div className="animated-tabs-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={tabTransition}
            className="tab-content-wrapper"
          >
            {activeTabData?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTabs;
