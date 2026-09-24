import sqlite3

def get_db():
    return sqlite3.connect("tasks.db")
    
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
