/**
 * Componente para mostrar historial de conversación de WhatsApp
 */
export function WhatsAppHistory({ whatsappNotifications }) {
  if (!whatsappNotifications || whatsappNotifications.length === 0) {
    return null;
  }

  return (
    <div className="order-details-grid">
      <div className="detail-card">
        <h3 className="detail-card-title">💬 Conversación WhatsApp</h3>
        <div className="detail-card-content">
          <div className="whatsapp-chat-container">
            {whatsappNotifications.map((notification, index) => {
              const isIncoming = notification.type === 'received' || notification.direction === 'incoming';
              const timestamp = notification.sentAt || notification.timestamp || notification.receivedAt;

              return (
                <div
                  key={index}
                  className={`whatsapp-message ${isIncoming ? 'incoming' : 'outgoing'} ${notification.status || ''}`}
                >
                  <div className="message-content">
                    {notification.message && (
                      <div className="message-text">
                        {notification.message}
                      </div>
                    )}
                    {notification.error && (
                      <div className="message-error">
                        ❌ Error: {notification.error}
                      </div>
                    )}
                    <div className="message-footer">
                      <span className="message-timestamp">
                        {new Date(timestamp).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!isIncoming && notification.status === 'sent' && (
                        <span className="message-status">✓✓</span>
                      )}
                      {!isIncoming && notification.status === 'failed' && (
                        <span className="message-status">!</span>
                      )}
                    </div>
                  </div>
                  {isIncoming && (
                    <div className="message-label">Cliente</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
