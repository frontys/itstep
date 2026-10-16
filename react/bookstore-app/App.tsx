const booksData = [
    { id: 1, title: "Clean Architecture", author: "Robert C. Martin", price: 39.99, genre: "Software", rating: 4.8 },
    { id: 2, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", price: 49.99, genre: "Software", rating: 4.9 },
    { id: 3, title: "Neuromancer", author: "William Gibson", price: 16.50, genre: "Cyberpunk", rating: 4.7 },
    { id: 4, title: "Snow Crash", author: "Neal Stephenson", price: 18.00, genre: "Cyberpunk", rating: 4.6 },
    { id: 5, title: "Dune", author: "Frank Herbert", price: 22.00, genre: "Sci-Fi", rating: 4.9 },
    { id: 6, title: "Hyperion", author: "Dan Simmons", price: 21.00, genre: "Sci-Fi", rating: 4.8 }
];

function App() {
    const [books] = React.useState(booksData);
    const [genre, setGenre] = React.useState('All');
    const [search, setSearch] = React.useState('');
    const [cart, setCart] = React.useState([]);

    const filtered = books.filter(b => {
        const matchesGenre = genre === 'All' || b.genre === genre;
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    const addToCart = (book) => {
        setCart(prev => [...prev, book]);
    };

    const cartTotal = cart.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="container">
            <header>
                <div>
                    <h1>Crimson Book Store</h1>
                    <p className="subtitle">Comprehensive literature discovery, filtering and instant ordering</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span>Cart: <strong style={{ color: '#e63956' }}>{cart.length}</strong> items (${cartTotal.toFixed(2)})</span>
                    {cart.length > 0 && <button className="button-secondary" onClick={() => setCart([])}>Clear</button>}
                </div>
            </header>
            <div className="card">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <input placeholder="Search title or author..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: '220px', marginBottom: 0 }} />
                    <button className={genre === 'All' ? '' : 'button-secondary'} onClick={() => setGenre('All')}>All</button>
                    <button className={genre === 'Software' ? '' : 'button-secondary'} onClick={() => setGenre('Software')}>Software</button>
                    <button className={genre === 'Cyberpunk' ? '' : 'button-secondary'} onClick={() => setGenre('Cyberpunk')}>Cyberpunk</button>
                    <button className={genre === 'Sci-Fi' ? '' : 'button-secondary'} onClick={() => setGenre('Sci-Fi')}>Sci-Fi</button>
                </div>
            </div>
            <div className="grid">
                {filtered.map(b => (
                    <div key={b.id} className="product-card">
                        <div>
                            <span className="badge">{b.genre}</span>
                            <h3 style={{ marginTop: '8px', fontSize: '17px' }}>{b.title}</h3>
                            <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 12px' }}>By {b.author}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#e63956' }}>${b.price.toFixed(2)}</span>
                            <button onClick={() => addToCart(b)}>Add To Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}