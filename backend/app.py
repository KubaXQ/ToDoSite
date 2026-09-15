from flask import Flask,request,jsonify
from database import get_db

app = Flask(__name__)


@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return {"tasks": tasks} 

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
    Insert into tasks (title, completed)
    VALUES(?,?)
    ''',(data["title"],data["completed"]))

    db.commit()
    db.close()
    
    return jsonify({
        "message": "Task został utworzony",
        "success": True
    }), 201







if __name__ == "__main__":
    app.run(debug=True)