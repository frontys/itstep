class Book:
    def __init__(self, title, author, year, available=True):
        self.title = title
        self.author = author
        self.year = year
        self.available = available

    def __str__(self):
        return f"'{self.title}' от {self.author} ({self.year}) - {'Доступна' if self.available else 'Недоступна'}"


class User:
    def __init__(self, name, user_id):
        self.name = name
        self.user_id = user_id

    def __str__(self):
        return f"Пользователь: {self.name}, ID: {self.user_id}"


class Library:
    def __init__(self):
        self.books = []
        self.users = []

    def add_book(self, book):
        self.books.append(book)

    def add_user(self, user):
        self.users.append(user)

    def borrow_book(self, user_id, book_title):
        for book in self.books:
            if book.title == book_title and book.available:
                book.available = False
                print(f"Книга '{book_title}' взята пользователем с ID {user_id}.")
                return
        print(f"Книга '{book_title}' недоступна.")

    def return_book(self, user_id, book_title):
        for book in self.books:
            if book.title == book_title and not book.available:
                book.available = True
                print(f"Книга '{book_title}' возвращена пользователем с ID {user_id}.")
                return
        print(f"Книга '{book_title}' не была взята.")

    def list_available_books(self):
        available_books = [book for book in self.books if book.available]
        if available_books:
            print("Доступные книги:")
            for book in available_books:
                print(book)
        else:
            print("Нет доступных книг.")