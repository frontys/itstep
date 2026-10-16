document.getElementById('delivBtn').addEventListener('click', () => {
    const item = parseFloat(document.getElementById('itemPrice').value) || 0;
    const ship = parseFloat(document.getElementById('shipPrice').value) || 0;
    document.getElementById('delivOut').textContent = `Total Order Cost: $${(item + ship).toFixed(2)}`;
});

document.getElementById('areaBtn').addEventListener('click', () => {
    const len = parseFloat(document.getElementById('roomLength').value) || 0;
    const wid = parseFloat(document.getElementById('roomWidth').value) || 0;
    document.getElementById('areaOut').textContent = `Room Area: ${len * wid} m²`;
});

document.getElementById('discBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('purchaseVal').value) || 0;
    let discPercent = 0;
    if (amount > 2000) discPercent = 15;
    const discount = (amount * discPercent) / 100;
    const finalAmount = amount - discount;
    document.getElementById('discOut').textContent = 
        `Original: $${amount.toFixed(2)}
Discount (${discPercent}%): -$${discount.toFixed(2)}
Final Total: $${finalAmount.toFixed(2)}`;
});

document.getElementById('ageBtn').addEventListener('click', () => {
    const age = parseInt(document.getElementById('userAge').value, 10);
    const out = document.getElementById('ageOut');
    if (age >= 16) {
        out.textContent = "Registration Allowed (Age >= 16)";
        out.style.borderColor = "#22c55e";
    } else {
        out.textContent = "Registration Forbidden (Under 16)";
        out.style.borderColor = "#e63956";
    }
});