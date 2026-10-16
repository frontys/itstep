const laptops = [
    { model: "ThinkPad X1", cpu: "Intel i7", ram: "32GB", price: 1850 },
    { model: "MacBook Pro 16", cpu: "M3 Max", ram: "64GB", price: 3499 },
    { model: "ROG Zephyrus", cpu: "Ryzen 9", ram: "32GB", price: 2200 },
    { model: "Dell XPS 15", cpu: "Intel i9", ram: "32GB", price: 2450 }
];

const gymVisitors = [
    { name: "Alexander", age: 28, pass: "Gold", visits: 34 },
    { name: "Elena", age: 24, pass: "Standard", visits: 18 },
    { name: "Dmitry", age: 35, pass: "Platinum", visits: 52 },
    { name: "Maria", age: 31, pass: "Gold", visits: 41 }
];

const orders = [
    { id: 101, client: "James", amount: 450, status: "delivered" },
    { id: 102, client: "Sophia", amount: 120, status: "pending" },
    { id: 103, client: "Lucas", amount: 980, status: "delivered" },
    { id: 104, client: "Mia", amount: 310, status: "processing" }
];

const warehouse = [
    { name: "Mechanical Keyboard", price: 120, stock: 45 },
    { name: "Gaming Mouse", price: 75, stock: 90 },
    { name: "UltraWide Monitor", price: 450, stock: 15 },
    { name: "USB-C Docking Station", price: 180, stock: 25 }
];

const movies = [
    { title: "Interstellar", genre: "Sci-Fi", year: 2014, rating: 8.7 },
    { title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0 },
    { title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8 },
    { title: "Generic Action Movie", genre: "Action", year: 2021, rating: 5.4 }
];

const out = document.getElementById('objOutput');

document.getElementById('laptopsBtn').addEventListener('click', () => {
    const highest = laptops.reduce((prev, curr) => curr.price > prev.price ? curr : prev);
    let res = "LAPTOPS CATALOG:\n" + laptops.map(l => `${l.model} | CPU: ${l.cpu} | RAM: ${l.ram} | $${l.price}`).join('\n');
    res += `\n\nMost expensive: ${highest.model} ($${highest.price})`;
    out.textContent = res;
});

document.getElementById('gymBtn').addEventListener('click', () => {
    const leader = gymVisitors.reduce((prev, curr) => curr.visits > prev.visits ? curr : prev);
    let res = "GYM VISITORS:\n" + gymVisitors.map(v => `${v.name} (${v.age}yo) - ${v.pass} pass - ${v.visits} visits`).join('\n');
    res += `\n\nMost active visitor: ${leader.name} with ${leader.visits} visits`;
    out.textContent = res;
});

document.getElementById('ordersBtn').addEventListener('click', () => {
    const delivered = orders.filter(o => o.status === 'delivered');
    let res = "DELIVERED ORDERS:\n" + delivered.map(o => `Order #${o.id} | Client: ${o.client} | Total: $${o.amount}`).join('\n');
    out.textContent = res;
});

document.getElementById('warehouseBtn').addEventListener('click', () => {
    const total = warehouse.reduce((acc, item) => acc + (item.price * item.stock), 0);
    let res = "WAREHOUSE INVENTORY:\n" + warehouse.map(i => `${i.name}: $${i.price} x ${i.stock} units = $${i.price * i.stock}`).join('\n');
    res += `\n\nTotal warehouse stock value: $${total}`;
    out.textContent = res;
});

document.getElementById('moviesBtn').addEventListener('click', () => {
    const top = movies.filter(m => m.rating > 8.0);
    let res = "TOP RATED MOVIES (Rating > 8.0):\n" + top.map(m => `${m.title} (${m.year}) - Genre: ${m.genre} - Rating: ${m.rating}/10`).join('\n');
    out.textContent = res;
});