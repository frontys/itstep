class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Professor(Person):
    def __init__(self, name, age, department):
        Person.__init__(self, name, age)
        self.department = department

class Student(Person):
    def __init__(self, name, age, group):
        Person.__init__(self, name, age)
        self.group = group

class University:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add_member(self, person):
        self.members.append(person)

    def list_members(self):
        for member in self.members:
            if isinstance(member, Professor):
                print(f"Профессор: {member.name}, Возраст: {member.age}, Кафедра: {member.department}")
            elif isinstance(member, Student):
                print(f"Студент: {member.name}, Возраст: {member.age}, Группа: {member.group}")

university = University("Примерный Университет")

professor1 = Professor("Др. Смит", 45, "Компьютерные Науки")
student1 = Student("Алиса", 20, "КС101")
student2 = Student("Боб", 22, "КС102")

university.add_member(professor1)
university.add_member(student1)
university.add_member(student2)

university.list_members()