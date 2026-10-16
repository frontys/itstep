let draggedItem = null;
document.querySelectorAll('.drag-box').forEach(item => {
    item.addEventListener('dragstart', () => draggedItem = item);
    item.addEventListener('dragend', () => draggedItem = null);
});

[document.getElementById('zoneA'), document.getElementById('zoneB')].forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', () => {
        if (draggedItem) zone.appendChild(draggedItem);
    });
});

let debounceTimer;
document.getElementById('debounceInput').addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const val = e.target.value.trim();
        document.getElementById('searchResult').textContent = val ? `Debounced Query: "${val}" (Length: ${val.length})` : "Waiting for input...";
    }, 300);
});

const overlay = document.getElementById('modalOverlay');
document.getElementById('openModalBtn').addEventListener('click', () => overlay.style.display = 'flex');
document.getElementById('closeModalBtn').addEventListener('click', () => overlay.style.display = 'none');
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
});