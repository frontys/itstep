const userJson = JSON.stringify({
    name: "Alex Vance",
    age: 27,
    city: "Seattle",
    email: "alex.vance@techcorp.internal",
    roles: ["Engineer", "Contributor"]
});

const stockJson = JSON.stringify([
    { name: "Pro Monitor", category: "Hardware", price: 399, inStock: true },
    { name: "Legacy Cable", category: "Accessories", price: 12, inStock: false },
    { name: "Wireless Keypad", category: "Peripherals", price: 65, inStock: true },
    { name: "Discontinued Adapter", category: "Accessories", price: 25, inStock: false }
]);

const booksJson = JSON.stringify([
    { title: "Clean Code", author: "Robert C. Martin", year: 2008, available: true },
    { title: "Refactoring", author: "Martin Fowler", year: 1999, available: false },
    { title: "Design Patterns", author: "Gang of Four", year: 1994, available: true }
]);

document.getElementById('loadUserBtn').addEventListener('click', () => {
    const user = JSON.parse(userJson);
    document.getElementById('userCard').textContent = 
        `USER PROFILE:
Name: ${user.name}
Age: ${user.age}
City: ${user.city}
Email: ${user.email}
Roles: ${user.roles.join(', ')}`;
});

document.getElementById('filterStockBtn').addEventListener('click', () => {
    const items = JSON.parse(stockJson);
    const available = items.filter(i => i.inStock);
    document.getElementById('stockOutput').textContent = 
        "IN-STOCK ITEMS:\n" + available.map(i => `${i.name} [${i.category}] - $${i.price}`).join('\n');
});

document.getElementById('searchBookBtn').addEventListener('click', () => {
    const query = document.getElementById('bookSearchInput').value.toLowerCase();
    const books = JSON.parse(booksJson);
    const matched = books.filter(b => b.title.toLowerCase().includes(query));
    if (matched.length > 0) {
        document.getElementById('bookOutput').textContent = 
            matched.map(b => `"${b.title}" by ${b.author} (${b.year}) - Available: ${b.available}`).join('\n');
    } else {
        document.getElementById('bookOutput').textContent = "No books found matching query.";
    }
});