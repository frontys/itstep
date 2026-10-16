let students = JSON.parse(localStorage.getItem('exam_students') || '[]');
let crmTickets = JSON.parse(localStorage.getItem('exam_crm') || '[]');

function updateGradebook(filterLow = false) {
    let list = students;
    if (filterLow) {
        list = students.filter(s => s.avg < 6);
    }
    document.getElementById('gradebookOut').textContent = list.length === 0 ? "No records found." :
        list.map(s => `${s.name} (${s.group}) - Grades: [${s.grades.join(', ')}] -> Avg: ${s.avg}`).join('\n');
}

document.getElementById('addStudentBtn').addEventListener('click', () => {
    const name = document.getElementById('stName').value.trim();
    const group = document.getElementById('stGroup').value.trim();
    const grades = document.getElementById('stGrades').value.split(',').map(g => parseFloat(g.trim())).filter(g => !isNaN(g));
    if (!name || grades.length === 0) return;
    const avg = parseFloat((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1));
    students.push({ name, group, grades, avg });
    localStorage.setItem('exam_students', JSON.stringify(students));
    updateGradebook();
});

document.getElementById('showLowBtn').addEventListener('click', () => updateGradebook(true));

function updateCrm() {
    document.getElementById('crmList').textContent = crmTickets.length === 0 ? "No active tickets." :
        crmTickets.map((t, idx) => `[Ticket #${idx + 1}] ${t.client} (${t.phone}) - Service: ${t.service} - Status: ${t.status}`).join('\n');
}

document.getElementById('addCrmBtn').addEventListener('click', () => {
    const client = document.getElementById('crmClient').value.trim();
    const phone = document.getElementById('crmPhone').value.trim();
    const service = document.getElementById('crmService').value;
    if (!client) return;
    crmTickets.push({ client, phone, service, status: "NEW", createdAt: new Date().toLocaleDateString() });
    localStorage.setItem('exam_crm', JSON.stringify(crmTickets));
    updateCrm();
});

updateGradebook();
updateCrm();