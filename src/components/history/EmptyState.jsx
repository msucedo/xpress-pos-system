/**
 * Componente de estado vacío para cuando no hay órdenes
 */
export function EmptyState() {
  return (
    <div className="oh-empty">
      <div className="oh-empty-icon">📦</div>
      <h3 className="oh-empty-title">No hay órdenes registradas</h3>
      <p className="oh-empty-text">Las órdenes creadas aparecerán aquí</p>
    </div>
  );
}
