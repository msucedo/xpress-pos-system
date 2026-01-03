import { Icon } from '../../icons';

/**
 * Componente para lista de productos de la orden
 */
export function ProductsList({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="order-pairs-section">
      <h3 className="section-title"><Icon name="package" size={20} /> Productos ({products.length})</h3>
      <div className="pairs-grid">
        {products.map((product, index) => (
          <div key={product.id || index} className="pair-detail-card product-card">
            <div className="pair-card-header">
              <div className="pair-header-left">
                <span className="pair-number"><Icon name={product.emoji || 'package'} size={20} /> Producto #{index + 1}</span>
                <span className="product-quantity-badge">x{product.quantity}</span>
              </div>
              <span className="pair-price-badge">${product.salePrice * product.quantity}</span>
            </div>

            <div className="pair-card-body">
              <div className="pair-info-row">
                <span className="pair-info-label">Producto:</span>
                <span className="pair-info-value">{product.name}</span>
              </div>

              <div className="pair-info-row">
                <span className="pair-info-label">SKU:</span>
                <span className="pair-info-value">{product.sku}</span>
              </div>

              {product.barcode && (
                <div className="pair-info-row">
                  <span className="pair-info-label">Código de Barras:</span>
                  <span className="pair-info-value">{product.barcode}</span>
                </div>
              )}

              <div className="pair-info-row">
                <span className="pair-info-label">Categoría:</span>
                <span className="pair-info-value">{product.category}</span>
              </div>

              <div className="pair-info-row">
                <span className="pair-info-label">Precio Unitario:</span>
                <span className="pair-info-value">${product.salePrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
