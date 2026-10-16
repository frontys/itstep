let cachedPosts = [];

document.getElementById('fetchApiBtn').addEventListener('click', async () => {
    const statusEl = document.getElementById('apiStatus');
    const out = document.getElementById('apiResults');
    statusEl.textContent = "Loading data from remote API...";

    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!resp.ok) throw new Error(`HTTP Error ${resp.status}`);
        cachedPosts = await resp.json();
        statusEl.textContent = `Successfully loaded ${cachedPosts.length} items.`;
        displayPosts(cachedPosts);
    } catch (err) {
        statusEl.textContent = `Network fallback triggered: ${err.message}`;
        cachedPosts = [
            { id: 1, title: "Offline Architecture Patterns", body: "Reliable fallback implementations." },
            { id: 2, title: "Client Side Caching Strategy", body: "LocalStorage response storage." }
        ];
        displayPosts(cachedPosts);
    }
});

function displayPosts(posts) {
    const query = document.getElementById('apiFilter').value.toLowerCase();
    const filtered = posts.filter(p => p.title.toLowerCase().includes(query));
    document.getElementById('apiResults').textContent = filtered.map(p => 
        `[#${p.id}] ${p.title.toUpperCase()}
${p.body}
`
    ).join('\n------------------------------------\n');
}

document.getElementById('apiFilter').addEventListener('input', () => {
    if (cachedPosts.length > 0) displayPosts(cachedPosts);
});