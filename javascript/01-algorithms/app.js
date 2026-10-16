document.getElementById('calcBtn').addEventListener('click', () => {
    const raw = document.getElementById('numInput').value;
    const nums = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const sum = nums.reduce((acc, val) => acc + val, 0);
    const avg = (sum / nums.length).toFixed(2);
    const sorted = [...nums].sort((a, b) => a - b);
    document.getElementById('algoOutput').textContent = 
        `Numbers: [${nums.join(', ')}]
` +
        `Count: ${nums.length}
` +
        `Minimum: ${min}
` +
        `Maximum: ${max}
` +
        `Sum: ${sum}
` +
        `Average: ${avg}
` +
        `Sorted Ascending: [${sorted.join(', ')}]`;
});

document.getElementById('primesBtn').addEventListener('click', () => {
    const primes = [];
    for (let i = 2; i <= 100; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) primes.push(i);
    }
    document.getElementById('algoOutput').textContent = 
        `Primes up to 100 (${primes.length} found):
[${primes.join(', ')}]`;
});

document.getElementById('fibBtn').addEventListener('click', () => {
    const fib = [0, 1];
    for (let i = 2; i < 20; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    document.getElementById('algoOutput').textContent = 
        `First 20 Fibonacci numbers:
[${fib.join(', ')}]`;
});