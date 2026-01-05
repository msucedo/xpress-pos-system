import { useNotification } from '../hooks/useNotification';
import { Icon } from '../icons';
import { motion, AnimatePresence, notificationVariants, transitions } from '../animations';
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
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification notification-${notification.type}`}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
              delay: 0.2
            }}
            layout
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
