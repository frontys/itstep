const catalogData = [
    { id: 1, title: "Tactical Keyboard MX", price: 139.99, tag: "Peripherals" },
    { id: 2, title: "Pro Gaming Mouse 8K", price: 89.99, tag: "Peripherals" },
    { id: 3, title: "Studio Monitor Speakers", price: 219.00, tag: "Audio" },
    { id: 4, title: "Thunderbolt 4 Dock", price: 199.50, tag: "Accessories" }
];

function App() {
    const [items] = React.useState(catalogData);
    const [cart, setCart] = React.useState([]);

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = p.qty + delta;
                return newQty > 0 ? { ...p, qty: newQty } : null;
            }
            return p;
        }).filter(Boolean));
    };

    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

    return (
        <div className="container">
            <header>
                <div>
                    <h1>Interactive Shop with Cart Mechanics</h1>
                    <p className="subtitle">Quantity increments, line item recalculation and order summary</p>
                </div>
            </header>
            <div className="grid">
                <div>
                    <h2 style={{ color: '#e63956', marginBottom: '14px' }}>Product Catalog</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map(p => (
                            <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                                <div>
                                    <span className="badge">{p.tag}</span>
                                    <h3 style={{ marginTop: '6px' }}>{p.title}</h3>
                                    <p style={{ color: '#e63956', fontWeight: 700, marginTop: '4px' }}>${p.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => addToCart(p)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h2 style={{ color: '#e63956' }}>Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p style={{ color: '#9ca3af', margin: '20px 0' }}>Your cart is empty.</p>
                    ) : (
                        <div style={{ margin: '14px 0' }}>
                            {cart.map(c => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1f202c', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                                    <div>
                                        <strong>{c.title}</strong>
                                        <p style={{ fontSize: '13px', color: '#9ca3af' }}>${c.price.toFixed(2)} x {c.qty}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button className="button-secondary" style={{ padding: '6px 12px' }} onClick={() => updateQty(c.id, -1)}>-</button>
                                        <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{c.qty}</span>
                                        <button className="button-secondary" style={{ padding: '6px 12px' }} onClick={() => updateQty(c.id, 1)}>+</button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid #262837', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
                                <span>Total:</span>
                                <span style={{ color: '#e63956' }}>${subtotal.toFixed(2)}</span>
                            </div>
                            <button style={{ width: '100%', marginTop: '14px' }} onClick={() => alert('Order Placed Successfully!')}>Checkout Now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}