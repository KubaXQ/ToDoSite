from flask import Flask
from database import get_db

app = Flask(__name__)


@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return {"tasks": tasks} 


if __name__ == "__main__":
    app.run(debug=True)