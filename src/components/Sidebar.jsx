import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminBadge from './AdminBadge';
import { Icon } from '../icons';
import './Sidebar.css';

const Sidebar = () => {
  const { employee, logout } = useAuth();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const menuItems = [
    { path: '/', icon: 'home', label: 'Dashboard' },
    { path: '/orders', icon: 'order', label: 'Órdenes' },
    { path: '/clients', icon: 'team', label: 'Clientes' },
    { path: '/services', icon: 'services', label: 'Servicios' },
    { path: '/employees', icon: 'employee', label: 'Empleados' },
    { path: '/inventory', icon: 'package', label: 'Inventario' },
    { path: '/promotions', icon: 'promotion', label: 'Promociones' },
    { path: '/reports', icon: 'reports', label: 'Reportes' },
    { path: '/settings', icon: 'settings', label: 'Config' },
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
              {employee.emoji ? <Icon name={employee.emoji} size={20} /> : getInitials(employee.name)}
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
                <span className="sidebar-logout-icon"><Icon name="close" size={16} /></span>
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
            <span className="menu-icon"><Icon name={item.icon} size={20} /></span>
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
