from contextlib import asynccontextmanager, contextmanager
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_PATH = Path(__file__).resolve().parent / "data.sqlite3"


@contextmanager
def connect():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def init_db():
    with connect() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                release_year INTEGER NOT NULL,
                watched INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        if db.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
            db.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                ("admin", "admin@mail.com", "password123"),
            )
        if db.execute("SELECT COUNT(*) FROM movies").fetchone()[0] == 0:
            db.executemany(
                "INSERT INTO movies (title, genre, release_year, watched) VALUES (?, ?, ?, ?)",
                [
                    ("Интерстеллар", "Фантастика", 2014, 0),
                    ("Шрек", "Мультфильм", 2001, 1),
                    ("Начало", "Фантастика", 2010, 0),
                    ("Один дома", "Комедия", 1990, 1),
                    ("Гладиатор", "Боевик", 2000, 0),
                ],
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Movie Catalog API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserRegister(BaseModel):
    username: str = Field(min_length=2, max_length=50)
    email: str = Field(min_length=5, max_length=100)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=1, max_length=128)


class MovieCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    genre: str = Field(min_length=1, max_length=50)
    release_year: int = Field(ge=1888, le=2100)
    watched: bool = False


class MovieUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    genre: str = Field(min_length=1, max_length=50)
    release_year: int = Field(ge=1888, le=2100)
    watched: bool = False


def as_movie(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "genre": row["genre"],
        "release_year": row["release_year"],
        "watched": bool(row["watched"]),
        "created_at": row["created_at"],
    }


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister):
    username = payload.username.strip()
    email = payload.email.strip().lower()
    if not username or not email or not payload.password:
        raise HTTPException(status_code=422, detail="Заполните все поля")
    with connect() as db:
        existing = db.execute("SELECT id FROM users WHERE lower(email) = ?", (email,)).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail="Пользователь с таким email уже зарегистрирован")
        cur = db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, payload.password),
        )
        row = db.execute("SELECT id, username, email FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()
    return dict(row)


@app.post("/api/auth/login")
def login(payload: UserLogin):
    login_id = payload.email.strip().lower()
    with connect() as db:
        row = db.execute(
            "SELECT id, username, email FROM users WHERE (lower(email) = ? OR lower(username) = ?) AND password = ?",
            (login_id, login_id, payload.password),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return dict(row)


@app.get("/api/movies")
def get_movies():
    with connect() as db:
        rows = db.execute("SELECT * FROM movies ORDER BY id DESC").fetchall()
    return [as_movie(row) for row in rows]


@app.post("/api/movies", status_code=status.HTTP_201_CREATED)
def add_movie(payload: MovieCreate):
    title = payload.title.strip()
    genre = payload.genre.strip()
    if not title or not genre:
        raise HTTPException(status_code=422, detail="Заполните название и жанр")
    with connect() as db:
        cur = db.execute(
            "INSERT INTO movies (title, genre, release_year, watched) VALUES (?, ?, ?, ?)",
            (title, genre, payload.release_year, int(payload.watched)),
        )
        row = db.execute("SELECT * FROM movies WHERE id = ?", (cur.lastrowid,)).fetchone()
    return as_movie(row)


@app.put("/api/movies/{movie_id}")
def update_movie(movie_id: int, payload: MovieUpdate):
    title = payload.title.strip()
    genre = payload.genre.strip()
    if not title or not genre:
        raise HTTPException(status_code=422, detail="Заполните название и жанр")
    with connect() as db:
        cur = db.execute(
            "UPDATE movies SET title = ?, genre = ?, release_year = ?, watched = ? WHERE id = ?",
            (title, genre, payload.release_year, int(payload.watched), movie_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Фильм не найден")
        row = db.execute("SELECT * FROM movies WHERE id = ?", (movie_id,)).fetchone()
    return as_movie(row)


@app.delete("/api/movies/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int):
    with connect() as db:
        cur = db.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Фильм не найден")
