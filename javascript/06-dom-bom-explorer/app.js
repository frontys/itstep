document.getElementById('inspectBomBtn').addEventListener('click', () => {
    const data = [
        `Window Dimensions: ${window.innerWidth} x ${window.innerHeight}`,
        `Screen Dimensions: ${window.screen.width} x ${window.screen.height}`,
        `User Agent: ${navigator.userAgent}`,
        `Platform: ${navigator.platform}`,
        `Language: ${navigator.language}`,
        `Current URL: ${window.location.href}`,
        `Protocol: ${window.location.protocol}`,
        `Online Status: ${navigator.onLine ? "Online" : "Offline"}`
    ];
    document.getElementById('bomOutput').textContent = data.join('\n');
});

let nodeCount = 0;
document.getElementById('addNodeBtn').addEventListener('click', () => {
    nodeCount++;
    const text = document.getElementById('nodeText').value || "Node";
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = `#${nodeCount} ${text}`;
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => badge.remove());
    document.getElementById('nodeContainer').appendChild(badge);
});

document.getElementById('clearNodesBtn').addEventListener('click', () => {
    document.getElementById('nodeContainer').innerHTML = '';
    nodeCount = 0;
});