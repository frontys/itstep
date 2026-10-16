#    //   / /
#   //___         __        ___         __     __  ___     ___        ___     __  ___  __  ___
#  / ___        //  ) )   //   ) )   //   ) )   / /      //   ) )   ((   ) )   / /      / /                 
# //           //        //   / /   //   / /   / /      //   / /     \ \      / /      / /                  + 5
#//           //        ((___/ /   //   / /   / /      ((___( (   //   ) )   / /      / /



import random

class Human:
    def __init__(self, name):
        self.name = name  # имя
        self.money = 100  # деньги
        self.happiness = 50  # счастье
        self.satiety = 50  # сытость
        self.health = 100  # здоровье
        self.social = 50  # социальность
        self.job = None  # работа
        self.car = None  # машина
        self.house = None  # дом
        self.bladder = 50  # Скибиди туалеты нападают

    def get_house(self, house):
        self.house = house

    def get_job(self, job):
        self.job = job

    def get_car(self, car):
        self.car = car

    # Еда
    def eat(self):
        if self.house and self.house.food > 0:
            self.satiety += 20
            self.house.food -= 1
            self.bladder += 10 
            print(f"{self.name} поел. Сытость: {self.satiety}")
        else:
            print(f"У {self.name} нет еды.")

    # Работа
    def work(self):
        if self.job:
            self.money += self.job.salary
            self.happiness -= self.job.happiness_decrease
            self.satiety -= 10
            self.bladder += 5 
            print(f"{self.name} поработал. Деньги: {self.money}, Счастье: {self.happiness}, Сытость: {self.satiety}")
        else:
            print(f"У {self.name} нет работы.")

    # Магазин
    def shop(self, item):
        if item == 'food':
            if self.money >= 10:
                self.house.food += 1
                self.money -= 10
                print(f"{self.name} купил еду. Деньги: {self.money}, Еда: {self.house.food}")
            else:
                print(f"У {self.name} недостаточно денег на еду.")
        elif item == 'fuel':
            if self.money >= 20:
                self.car.fuel += 10
                self.money -= 20
                print(f"{self.name} купил топливо. Деньги: {self.money}, Топливо: {self.car.fuel}")
            else:
                print(f"У {self.name} недостаточно денег на топливо.")
        elif item == 'medicine':
            if self.money >= 30:
                self.health += 20
                self.money -= 30
                print(f"{self.name} купил лекарства. Деньги: {self.money}, Здоровье: {self.health}")
            else:
                print(f"У {self.name} недостаточно денег на лекарства.")

    # Отдых
    def rest(self):
        self.happiness += 10
        self.satiety -= 5
        print(f"{self.name} отдохнул. Счастье: {self.happiness}, Сытость: {self.satiety}")

    # Уборка
    def clean(self):
        if self.house:
            self.house.mess = 0
            self.happiness += 5
            print(f"{self.name} убрался в доме. Счастье: {self.happiness}")
        else:
            print(f"У {self.name} нет дома для уборки.")
     
    # Ремонт машины
    def repair_car(self):
        if self.car:
            self.car.durability = 100
            self.money -= 50
            print(f"{self.name} починил машину. Деньги: {self.money}, Прочность машины: {self.car.durability}")
        else:
            print(f"У {self.name} нет машины для ремонта.")

    # Социальное взаимодействие
    def socialize(self):
        self.social += 10
        self.happiness += 5
        print(f"{self.name} пообщался с друзьями. Социальность: {self.social}, Счастье: {self.happiness}")

    # Поход в туалет
    def use_toilet(self):
        if self.bladder > 0:
            self.bladder = 0
            self.happiness += 5
            print(f"{self.name} сходил в туалет. Счастье: {self.happiness}")
        else:
            print(f"{self.name} не хочет в туалет.")

    # Проверка жизнеспособности
    def check_vitality(self):
        if self.satiety <= 0 or self.happiness <= 0 or self.money < 0 or self.health <= 0:
            print(f"{self.name} не смог выжить.")
            return False
        return True

    # Показать статус
    def show_status(self):
        print(f"Статус {self.name}: Деньги: {self.money}, Счастье: {self.happiness}, Сытость: {self.satiety}, Здоровье: {self.health}, Социальность: {self.social}, Потребность в туалете: {self.bladder}")
        
class Auto:
    def __init__(self, brand, fuel, durability, fuel_consumption):
        self.brand = brand
        self.fuel = fuel
        self.durability = durability
        self.fuel_consumption = fuel_consumption

    def drive(self):
        if self.fuel > 0 and self.durability > 0:
            self.fuel -= self.fuel_consumption
            self.durability -= 1
            print(f"Езда на машине. Топливо: {self.fuel}, Прочность: {self.durability}")
        else:
            print("Машина не может ехать.")

class House:
    def __init__(self):
        self.mess = 0
        self.food = 0

class Job:
    def __init__(self, position, salary, happiness_decrease):
        self.position = position
        self.salary = salary
        self.happiness_decrease = happiness_decrease

house = House()
car = Auto("Zhigul", 50, 100, 5)
job = Job("Developer", 100, 10)
human = Human("John")
human.get_house(house)
human.get_car(car)
human.get_job(job)

actions = {
    '1': human.eat,
    '2': human.work,
    '3': lambda: human.shop('food'),
    '4': lambda: human.shop('fuel'),
    '5': human.rest,
    '6': human.clean,
    '7': human.repair_car,
    '8': human.socialize,
    '9': human.use_toilet,
    '10': human.show_status
}

for day in range(1, 31):
    print(f"\nДень {day}:")
    human.show_status()
    for _ in range(3):
        print("Выберите действие:")
        print("1: Поесть")
        print("2: Работать")
        print("3: Купить еду")
        print("4: Купить топливо")
        print("5: Отдохнуть")
        print("6: Убраться в доме")
        print("7: Починить машину")
        print("8: Пообщаться с друзьями")
        print("9: Сходить в туалет")
        print("10: Показать статус")
        action = input("Введите номер действия: ")
        if action in actions:
            actions[action]()
        else:
            print("Неверное действие.")
        if not human.check_vitality():
            break
    if not human.check_vitality():
        break
    
    # Случайные события
    if random.random() < 0.1:
        event = random.choice(['болезнь', 'авария', 'потеря работы'])
        if event == 'болезнь':
            human.health -= 20
            print(f"{human.name} заболел. Здоровье: {human.health}")
        elif event == 'авария':
            if human.car:
                human.car.durability -= 50
                print(f"{human.name} попал в аварию. Прочность машины: {human.car.durability}")
        elif event == 'потеря работы':
            human.job = None
            print(f"{human.name} потерял работу.")