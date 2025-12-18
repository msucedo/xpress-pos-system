import { useNotification } from '../hooks/useNotification';
import { Icon } from '../icons';
import './Notification.css';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  const getIconName = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            <Icon name={getIconName(notification.type)} size={20} />
          </div>
          <div className="notification-message">{notification.message}</div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Cerrar notificación"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
