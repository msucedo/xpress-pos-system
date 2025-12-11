import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminBadge from './AdminBadge';
import './Sidebar.css';

const Sidebar = () => {
  const { employee, logout } = useAuth();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard', badge: 'Nuevo' },
    { path: '/orders', icon: '📦', label: 'Órdenes' },
    { path: '/clients', icon: '👥', label: 'Clientes' },
    { path: '/services', icon: '💼', label: 'Servicios' },
    { path: '/employees', icon: '👨‍💼', label: 'Empleados' },
    { path: '/inventory', icon: '📦', label: 'Inventario' },
    { path: '/promotions', icon: '🎉', label: 'Promociones', badge: 'BETA' },
    { path: '/reports', icon: '📊', label: 'Reportes' },
    { path: '/settings', icon: '⚙️', label: 'Config' },
  ];

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src="/logo2.png" alt="Clean Master Shoes" className="logo-icon logo-icon-desktop" />
        <img src="/logo2.png" alt="Clean Master Shoes" className="logo-icon logo-icon-mobile" />
      </div>

      {/* Employee Info */}
      {employee && (
        <div className="sidebar-employee-wrapper">
          <div
            className="sidebar-employee-info"
            onClick={toggleLogoutMenu}
          >
            <div className={`sidebar-employee-avatar ${employee.emoji ? 'sidebar-employee-with-emoji' : ''}`}>
              {employee.emoji || getInitials(employee.name)}
            </div>
            <div className="sidebar-employee-details">
              <div className="sidebar-employee-name">
                {employee.name}
              </div>
              <div className="sidebar-employee-role">{employee.role || 'Sin rol asignado'}</div>
              <div className='sidebar-employee-admin'>{employee.isAdmin && <AdminBadge inline small />}</div>
            </div>
            <div className="sidebar-employee-chevron">
              {showLogoutMenu ? '▲' : '▼'}
            </div>
          </div>

          {/* Logout Menu - Shown on click */}
          {showLogoutMenu && (
            <div className="sidebar-logout-dropdown">
              <button onClick={logout} className="sidebar-logout-btn">
                <span className="sidebar-logout-icon">✕</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-item-label">
              {item.label}
              {item.badge && <span className="menu-item-badge">{item.badge}</span>}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
