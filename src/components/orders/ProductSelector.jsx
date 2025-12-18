import { Icon } from '../../icons';

/**
 * Selector de productos disponibles del inventario
 * Extraído de OrderForm.jsx para reutilización
 */
export function ProductSelector({ products, onAddToCart }) {
  return (
    <>
      <div className="form-section-header" style={{ marginTop: '24px' }}>
        <h3 className="step-title-large">Productos Disponibles</h3>
      </div>

      <div className="order-services-grid">
        {products.length === 0 ? (
          <div className="empty-products">
            <span className="empty-icon">📦</span>
            <p>No hay productos disponibles en inventario</p>
          </div>
        ) : (
          products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="service-icon-button"
              onClick={() => onAddToCart(product, 'product')}
              title={`${product.name} - $${product.salePrice} (Stock: ${product.stock})`}
            >
              <span className="service-icon-large"><Icon name={product.emoji || 'package'} size={48} /></span>
              {product.stock <= product.minStock && (
                <span className="stock-warning">⚠️</span>
              )}
            </button>
          ))
        )}
      </div>
    </>
  );
}
