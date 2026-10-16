class Seat {
    #isOccupied = false;
    #price = 12;

    constructor(id) {
        this.id = id;
    }
    get isOccupied() { return this.#isOccupied; }
    get price() { return this.#price; }
    book() {
        if (this.#isOccupied) return false;
        this.#isOccupied = true;
        return true;
    }
}

class CinemaHall {
    constructor(totalSeats = 32) {
        this.seats = [];
        for (let i = 1; i <= totalSeats; i++) {
            this.seats.push(new Seat(i));
        }
    }
    getSeat(id) {
        return this.seats.find(s => s.id === id);
    }
}

const hall = new CinemaHall(32);
let selectedIds = new Set();

function renderHall() {
    const grid = document.getElementById('hallGrid');
    grid.innerHTML = hall.seats.map(s => {
        let cls = 'seat';
        if (s.isOccupied) cls += ' occupied';
        else if (selectedIds.has(s.id)) cls += ' selected';
        return `<div class="${cls}" onclick="toggleSeat(${s.id})">#${s.id}</div>`;
    }).join('');
    document.getElementById('selectedCount').textContent = selectedIds.size;
    document.getElementById('bookingTotal').textContent = `$${selectedIds.size * 12}`;
}

window.toggleSeat = function(id) {
    const seat = hall.getSeat(id);
    if (seat.isOccupied) return;
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
    renderHall();
};

document.getElementById('bookSeatsBtn').addEventListener('click', () => {
    if (selectedIds.size === 0) return;
    const booked = [];
    selectedIds.forEach(id => {
        const seat = hall.getSeat(id);
        if (seat.book()) booked.push(id);
    });
    const receipt = document.getElementById('bookingReceipt');
    receipt.style.display = 'block';
    receipt.textContent = `RESERVATION RECEIPT:
Seats: [${booked.join(', ')}]
Total Paid: $${booked.length * 12}
Date: ${new Date().toLocaleString()}
Status: CONFIRMED`;
    selectedIds.clear();
    renderHall();
});

renderHall();