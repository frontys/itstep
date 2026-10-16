document.getElementById('registerBtn').addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const age = document.getElementById('regAge').value;
    const course = document.getElementById('regCourse').value;
    const pass = document.getElementById('regPass').value;

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (users.some(u => u.email === email)) {
        document.getElementById('regStatus').textContent = `Error: User with email "${email}" is already registered!`;
        return;
    }

    users.push({ name, email, age, course, pass, registeredAt: new Date().toISOString() });
    localStorage.setItem('registered_users', JSON.stringify(users));
    document.getElementById('regStatus').textContent = `Success! Registered "${name}" to course "${course}". Total users: ${users.length}`;
});

function loadHomeworks() {
    const list = JSON.parse(localStorage.getItem('hw_assignments') || '[]');
    const container = document.getElementById('hwList');
    container.innerHTML = list.map((item, idx) => `
        <div style="background:#1f202c; padding:10px; border-radius:6px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${item.subject}</strong>: ${item.desc}
                <div style="font-size:12px; color:${item.done ? '#22c55e' : '#e63956'};">${item.done ? 'COMPLETED' : 'PENDING'}</div>
            </div>
            <div>
                <button class="button-secondary" onclick="toggleHw(${idx})">Toggle</button>
                <button onclick="deleteHw(${idx})">Delete</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('addHwBtn').addEventListener('click', () => {
    const subject = document.getElementById('hwSubject').value.trim();
    const desc = document.getElementById('hwDesc').value.trim();
    if (!subject || !desc) return;
    const list = JSON.parse(localStorage.getItem('hw_assignments') || '[]');
    list.push({ subject, desc, done: false });
    localStorage.setItem('hw_assignments', JSON.stringify(list));
    loadHomeworks();
});

window.toggleHw = function(idx) {
    const list = JSON.parse(localStorage.getItem('hw_assignments') || '[]');
    list[idx].done = !list[idx].done;
    localStorage.setItem('hw_assignments', JSON.stringify(list));
    loadHomeworks();
};

window.deleteHw = function(idx) {
    const list = JSON.parse(localStorage.getItem('hw_assignments') || '[]');
    list.splice(idx, 1);
    localStorage.setItem('hw_assignments', JSON.stringify(list));
    loadHomeworks();
};

loadHomeworks();