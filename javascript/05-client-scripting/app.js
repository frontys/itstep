document.getElementById('randColorBtn').addEventListener('click', () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const box = document.getElementById('colorBox');
    box.style.backgroundColor = hex;
    box.textContent = hex.toUpperCase();
});

const trackArea = document.getElementById('trackArea');
trackArea.addEventListener('mousemove', (e) => {
    const rect = trackArea.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    document.getElementById('trackInfo').textContent = `Local Coordinates: X=${x}, Y=${y}`;
});
trackArea.addEventListener('dblclick', () => {
    document.getElementById('trackInfo').textContent = "Double click event captured successfully!";
});

const toggleBtn = document.getElementById('toggleMediaBtn');
const mediaBox = document.getElementById('mediaBox');
toggleBtn.addEventListener('click', () => {
    if (mediaBox.style.display === 'none') {
        mediaBox.style.display = 'flex';
        toggleBtn.textContent = 'Hide Element';
    } else {
        mediaBox.style.display = 'none';
        toggleBtn.textContent = 'Show Element';
    }
});

const categoryData = {
    laptops: "Selected Category: Laptops\n- ThinkPad X1 Carbon ($1850)\n- MacBook Pro M3 ($3499)",
    phones: "Selected Category: Phones\n- iPhone 16 Pro Max ($1199)\n- Samsung Galaxy S24 Ultra ($1299)",
    tablets: "Selected Category: Tablets\n- iPad Pro 13 ($1299)\n- Galaxy Tab S9 Ultra ($1099)"
};

document.querySelectorAll('.catBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.catBtn').forEach(b => b.classList.add('button-secondary'));
        btn.classList.remove('button-secondary');
        const cat = btn.getAttribute('data-cat');
        document.getElementById('catContent').textContent = categoryData[cat];
    });
});