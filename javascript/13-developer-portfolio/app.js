const projects = [
    { title: "GameCatalog & eCommerce Store", cat: "react", desc: "Interactive game discovery catalog with cart and instant filter.", tech: "React 19, TypeScript, CSS3" },
    { title: "High-Throughput Network Engine", cat: "dotnet", desc: "Asynchronous TCP server handling multi-client message streaming.", tech: ".NET 9, Sockets, Async" },
    { title: "Thread Synchronization Suite", cat: "dotnet", desc: "Lock and Interlocked atomic operations benchmarks.", tech: ".NET 9, Multithreading" },
    { title: "Responsive Web Services Hub", cat: "react", desc: "Single page dashboard consuming real-time JSON endpoints.", tech: "TypeScript, REST API" }
];

function renderProjects(filter = 'all') {
    const list = filter === 'all' ? projects : projects.filter(p => p.cat === filter);
    document.getElementById('portfolioProjects').innerHTML = list.map(p => `
        <div class="project-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="color:#ffffff;">${p.title}</h3>
                <span class="badge">${p.cat.toUpperCase()}</span>
            </div>
            <p style="color:#9ca3af; font-size:14px; margin:8px 0;">${p.desc}</p>
            <small style="color:#e63956;">${p.tech}</small>
        </div>
    `).join('');
}

document.querySelectorAll('.portBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.portBtn').forEach(b => b.classList.add('button-secondary'));
        btn.classList.remove('button-secondary');
        renderProjects(btn.getAttribute('data-filter'));
    });
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('contactStatus');
    status.style.display = 'block';
    status.textContent = "Thank you! Your message has been recorded successfully.";
    document.getElementById('contactForm').reset();
});

renderProjects();