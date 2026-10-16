const products = [
    { id: 1, name: "Mechanical Gaming Keyboard", desc: "RGB Per-Key with tactile switches", price: 129.99 },
    { id: 2, name: "Precision Optical Mouse", desc: "26,000 DPI wireless sensor", price: 79.99 },
    { id: 3, name: "Spatial Audio Headset", desc: "Active noise cancellation and mic", price: 149.99 },
    { id: 4, name: "UltraFast NVMe SSD 2TB", desc: "PCIe 4.0 up to 7450 MB/s", price: 169.99 },
    { id: 5, name: "Curved 27" QHD Monitor", desc: "165Hz IPS 1ms response", price: 289.99 },
    { id: 6, name: "Ergonomic Desk Mat", desc: "Extended waterproof surface", price: 34.99 }
];

let cart = [];

function render() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div>
                <span class="badge">Product #${p.id}</span>
                <h3 style="margin-top:8px; font-size:16px;">${p.name}</h3>
                <p style="color:#9ca3af; font-size:13px; margin-top:4px;">${p.desc}</p>
            </div>
            <div>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <button onclick="addToCart(${p.id})">Add To Cart</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCart();
    }
};

function updateCart() {
    document.getElementById('cartCount').textContent = cart.length;
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

document.getElementById('clearCartBtn').addEventListener('click', () => {
    cart = [];
    updateCart();
});

render();