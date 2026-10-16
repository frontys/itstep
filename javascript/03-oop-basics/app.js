class BankAccount {
    constructor(owner, initialBalance = 0) {
        this.owner = owner;
        this.balance = initialBalance;
    }
    deposit(amount) {
        if (amount <= 0) return "Deposit must be greater than zero.";
        this.balance += amount;
        return `Deposited $${amount}. Current balance: $${this.balance}`;
    }
    withdraw(amount) {
        if (amount <= 0) return "Withdrawal amount must be greater than zero.";
        if (amount > this.balance) return `Insufficient funds! Requested $${amount}, available: $${this.balance}`;
        this.balance -= amount;
        return `Withdrew $${amount}. Current balance: $${this.balance}`;
    }
}

class Student {
    constructor(name, age, group, grades) {
        this.name = name;
        this.age = age;
        this.group = group;
        this.grades = grades;
    }
    getAverage() {
        return (this.grades.reduce((a, b) => a + b, 0) / this.grades.length).toFixed(1);
    }
    getInfo() {
        return `${this.name} (${this.group}) - Average: ${this.getAverage()}`;
    }
}

class Car {
    constructor(make, model, year, price) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.price = price;
    }
    isNew() {
        return this.year >= 2022;
    }
}

class Book {
    constructor(title, author, isAvailable = true) {
        this.title = title;
        this.author = author;
        this.isAvailable = isAvailable;
    }
    checkout() {
        if (!this.isAvailable) return `"${this.title}" is already checked out.`;
        this.isAvailable = false;
        return `"${this.title}" successfully checked out.`;
    }
    returnBook() {
        this.isAvailable = true;
        return `"${this.title}" returned to library.`;
    }
}

const account = new BankAccount("Paul", 1000);
const bankOut = document.getElementById('bankOutput');

document.getElementById('depositBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('amountInput').value);
    bankOut.textContent = account.deposit(val);
});

document.getElementById('withdrawBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('amountInput').value);
    bankOut.textContent = account.withdraw(val);
});

const oopOut = document.getElementById('oopOutput');

document.getElementById('testStudentBtn').addEventListener('click', () => {
    const students = [
        new Student("Alice", 20, "CS-101", [9, 8, 10, 9]),
        new Student("Bob", 21, "CS-101", [6, 7, 5, 8]),
        new Student("Charlie", 19, "CS-102", [10, 10, 9, 10]),
        new Student("David", 22, "CS-102", [7, 6, 7, 6])
    ];
    const highAchievers = students.filter(s => parseFloat(s.getAverage()) > 8.0);
    oopOut.textContent = "STUDENTS WITH AVERAGE > 8.0:\n" + highAchievers.map(s => s.getInfo()).join('\n');
});

document.getElementById('testCarsBtn').addEventListener('click', () => {
    const cars = [
        new Car("Toyota", "Camry", 2020, 24000),
        new Car("BMW", "M4", 2023, 78000),
        new Car("Tesla", "Model 3", 2024, 42000),
        new Car("Audi", "A6", 2019, 31000)
    ];
    const newCars = cars.filter(c => c.isNew());
    oopOut.textContent = "NEW VEHICLES (>= 2022):\n" + newCars.map(c => `${c.make} ${c.model} (${c.year}) - $${c.price}`).join('\n');
});

document.getElementById('testBooksBtn').addEventListener('click', () => {
    const b1 = new Book("Clean Code", "Robert Martin");
    let log = b1.checkout() + "\n";
    log += b1.checkout() + "\n";
    log += b1.returnBook();
    oopOut.textContent = log;
});