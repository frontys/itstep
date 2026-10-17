import { useState } from 'react';

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onGoToCatalog,
}) {
  const [orderDone, setOrderDone] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleBuy() {
    if (cart.length === 0) return;
    setOrderSummary({
      count: totalCount,
      sum: totalSum,
    });
    setOrderDone(true);
    onCheckout();
  }

  if (orderDone && orderSummary) {
    return (
      <div className="cart-container">
        <h2>Order Confirmation</h2>
        <div className="order-success-box">
          <h3>Thank you for your purchase!</h3>
          <p>
            Your order for <strong>{orderSummary.count}</strong> item(s) totaling{' '}
            <strong>{orderSummary.sum} грн</strong> has been placed successfully.
          </p>
          <button type="button" className="btn-primary" onClick={onGoToCatalog}>
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="empty-box">
          <p>Your shopping cart is currently empty.</p>
          <button type="button" className="btn-primary" onClick={onGoToCatalog}>
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <span className="count-label">{totalCount} item(s)</span>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {cart.map(item => (
            <div key={item.id} className="cart-row">
              <img
                src={item.image && item.image.startsWith('./') ? `${import.meta.env.BASE_URL}${item.image.slice(2)}` : (item.image || `${import.meta.env.BASE_URL}images/fallback.svg`)}
                alt={item.title}
                className="cart-thumb"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `${import.meta.env.BASE_URL}images/fallback.svg`;
                }}
              />
              <div className="cart-item-info">
                <h4>{item.title}</h4>
                <div className="cart-item-meta">
                  <span>{item.publisher}</span> · <span>{item.genre}</span>
                </div>
                <div className="cart-unit-price">{item.price} грн each</div>
              </div>

              <div className="cart-qty-box">
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  title="Decrease"
                >
                  -
                </button>
                <span className="qty-number">{item.quantity}</span>
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  title="Increase"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                {item.price * item.quantity} грн
              </div>

              <button
                type="button"
                className="btn-remove"
                onClick={() => onRemove(item.id)}
                title="Remove item"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Items:</span>
            <span>{totalCount}</span>
          </div>
          <div className="summary-line summary-total">
            <span>Total:</span>
            <span>{totalSum} грн</span>
          </div>
          <button
            type="button"
            className="btn-buy-now btn-block"
            onClick={handleBuy}
          >
            Buy Now
          </button>
          <button
            type="button"
            className="btn-continue"
            onClick={onGoToCatalog}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
