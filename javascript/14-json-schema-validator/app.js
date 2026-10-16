document.getElementById('validateJsonBtn').addEventListener('click', () => {
    const raw = document.getElementById('jsonInput').value;
    const status = document.getElementById('jsonStatus');
    try {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 2);
        document.getElementById('jsonInput').value = formatted;
        status.textContent = `Valid JSON! Object contains ${Object.keys(parsed).length} top-level keys: [${Object.keys(parsed).join(', ')}]`;
        status.style.borderColor = '#22c55e';
    } catch (err) {
        status.textContent = `JSON Syntax Error: ${err.message}`;
        status.style.borderColor = '#e63956';
    }
});

document.getElementById('exportJsonBtn').addEventListener('click', () => {
    const raw = document.getElementById('jsonInput').value;
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
});