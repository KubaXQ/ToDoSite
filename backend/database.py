import os
import sqlite3

DB_PATH = os.getenv("DB_PATH", "tasks.db")

def get_db():
    return sqlite3.connect(DB_PATH)
    
def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    description TEXT,
    category VARCHAR(30) NOT NULL,
    completed INTEGER)'''
    )
    conn.commit()
    conn.close()
init_db()
