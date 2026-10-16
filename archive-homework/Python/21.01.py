#    //   / /
#   //___         __        ___         __     __  ___     ___        ___     __  ___  __  ___
#  / ___        //  ) )   //   ) )   //   ) )   / /      //   ) )   ((   ) )   / /      / /
# //           //        //   / /   //   / /   / /      //   / /     \ \      / /      / /
#//           //        ((___/ /   //   / /   / /      ((___( (   //   ) )   / /      / /



#Ex. 1
class Task:
    def __init__(self, title, description, deadline):
        self.title = title
        self.description = description
        self.deadline = deadline
        self.completed = False

    def mark_as_completed(self):
        self.completed = True

    def __str__(self):
        status = "Выполнено" if self.completed else "Не выполнено"
        return f"Название: {self.title}, Описание: {self.description}, Дедлайн: {self.deadline}, Статус: {status}"

class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)

    def remove_task(self, title):
        self.tasks = [task for task in self.tasks if task.title != title]

    def mark_task_as_completed(self, title):
        for task in self.tasks:
            if task.title == title:
                task.mark_as_completed()

    def list_tasks(self):
        for task in self.tasks:
            print(task)

if __name__ == "__main__":
    manager = TaskManager()

    task1 = Task("Завдання 1", "Опис завдання 1", "2023-12-31")
    task2 = Task("Завдання 2", "Опис завдання 2", "2024-01-15")

    manager.add_task(task1)
    manager.add_task(task2)

    manager.list_tasks()

    manager.mark_task_as_completed("Завдання 1")
    print("После отметки как выполненное>>>")
    manager.list_tasks()

    manager.remove_task("Завдання 2")
    print("После удаления задания 2>>>")
    manager.list_tasks()



#Ex. 2
class Product:
    def __init__(self, name, price, in_stock):
        self.name = name
        self.price = price
        self.in_stock = in_stock

    def __str__(self):
        return f"Название: {self.name}, Цена: {self.price}, Наличие: {'Да' if self.in_stock else 'Нет'}"

class Cart:
    def __init__(self):
        self.items = []

    def add_product(self, product):
        if product.in_stock:
            self.items.append(product)
        else:
            print(f"Товар {product.name} не в наличии")

    def remove_product(self, name):
        self.items = [item for item in self.items if item.name != name]

    def total_price(self):
        return sum(item.price for item in self.items)

    def list_products(self):
        for item in self.items:
            print(item)

if __name__ == "__main__":
    cart = Cart()

    product1 = Product("Товар 1", 100, True)
    product2 = Product("Товар 2", 200, False)
    product3 = Product("Товар 3", 150, True)

    cart.add_product(product1)
    cart.add_product(product2)
    cart.add_product(product3)

    print("Список товаров в корзине>>>")
    cart.list_products()

    print(f"Общая стоимость>>> {cart.total_price()}")

    cart.remove_product("Товар 1")
    print("После удаления Товар 1>>>")
    cart.list_products()
    print(f"Общая стоимость>>> {cart.total_price()}")



#Ex. 3
class BankAccount:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Пополнение: {amount} >>> Новый баланс: {self.balance}")

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            print(f"Снятие: {amount} >>> Новый баланс: {self.balance}")
        else:
            print("Недостаточно средств для снятия")

    def __str__(self):
        return f"Владелец: {self.owner}, Номер счета: {self.account_number}, Баланс: {self.balance}"

class Bank:
    def __init__(self):
        self.accounts = []

    def add_account(self, account):
        self.accounts.append(account)
        print(f"Счет добавлен: {account}")

    def transfer(self, from_account_number, to_account_number, amount):
        from_account = next((acc for acc in self.accounts if acc.account_number == from_account_number), None)
        to_account = next((acc for acc in self.accounts if acc.account_number == to_account_number), None)

        if from_account and to_account:
            if from_account.balance >= amount:
                from_account.withdraw(amount)
                to_account.deposit(amount)
                print(f"Перевод {amount} от {from_account_number} до {to_account_number} успешный")
            else:
                print("Недостаточно средств для перевода")
        else:
            print("Один или оба счета не найдены")

if __name__ == "__main__":
    bank = Bank()

    account1 = BankAccount("Иван Иванов", "123456", 1000)
    account2 = BankAccount("Петр Петров", "654321", 500)

    bank.add_account(account1)
    bank.add_account(account2)

    print("Список счетов в банке>>>")
    for account in bank.accounts:
        print(account)

    account1.deposit(200)
    account2.withdraw(100)

    bank.transfer("123456", "654321", 300)

    print("Список счетов после операций>>>")
    for account in bank.accounts:
        print(account)



#Ex. 4
class Employee:
    def __init__(self, name, position, salary):
        self.name = name
        self.position = position
        self.salary = salary

    def __str__(self):
        return f"Имя>>> {self.name}, Должность>>> {self.position}, Зарплата>>> {self.salary}"


class Department:
    def __init__(self):
        self.employees = []

    def add_employee(self, employee):
        self.employees.append(employee)
        print(f"Сотрудник {employee.name} добавлен в отдел")

    def remove_employee(self, employee_name):
        self.employees = [emp for emp in self.employees if emp.name != employee_name]
        print(f"Сотрудник {employee_name} удален из отдела")

    def total_salary(self):
        total = sum(emp.salary for emp in self.employees)
        print(f"Общая зарплата отдела>>> {total}")
        return total

    def list_employees(self):
        print("Список сотрудников отдела>>>")
        for emp in self.employees:
            print(emp)

if __name__ == "__main__":
    emp1 = Employee("Иван Иванов", "Менеджер", 50000)
    emp2 = Employee("Петр Петров", "Разработчик", 60000)
    emp3 = Employee("Сергей Сергеев", "Тестировщик", 40000)

    department = Department()
    department.add_employee(emp1)
    department.add_employee(emp2)
    department.add_employee(emp3)

    department.list_employees()
    department.total_salary()

    department.remove_employee("Петр Петров")
    department.list_employees()
    department.total_salary()