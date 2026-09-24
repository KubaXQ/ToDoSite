from flask import Flask,request,jsonify
from database import get_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

    required_fields = ["title","completed","category"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "message": f"Brakuje pola: {field}",
                "success": False
            }), 400
        elif isinstance(data[field], str) and data[field].strip() == "":
            return jsonify({
                "message": f"Pole jest puste: {field}",
                "success": False
            }), 400
        elif field == "completed" and (not isinstance(data[field], int) or data[field] not in [0, 1]):
            return jsonify({
                "message": f"Pole {field} ma nieprawidlowe dane",
                "success": False
            }), 400



    

    db = get_db()
    cursor = db.cursor()

    description = data.get("description", "")

    cursor.execute('''
    Insert into tasks (title, completed,description,category)
    VALUES(?,?,?,?)
    ''',(data["title"],data["completed"],description,data["category"]))

    task_id = cursor.lastrowid

    db.commit()
    db.close()
    
    return jsonify({
        "id": task_id,
        "message": "Task został utworzony",
        "success": True
    }), 201

@app.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
    Delete from tasks where id = ?

    ''',(id,))
    if cursor.rowcount == 0:
        db.close()
        return jsonify({
        "message": "Task nie został znaleziony",
        "success": False
    }), 404
    db.commit()
    db.close()
    return jsonify({
        "message": "Task został usuniety",
        "success": True
    }), 200

@app.route("/api/tasks/<int:id>", methods=["PATCH"])
def update_task(id): 
    db = get_db()
    cursor = db.cursor()
    data = request.json

    fields = []
    values = []

    for column in ["title", "completed","description","category"]:
        if column in data:
            fields.append(column)
            values.append(data[column])

            if column == "title" or column == "category":
                if isinstance(data[column], str) and data[column].strip() == "":
                    return jsonify({
                        "message": f"Pole jest puste: {column}",
                        "success": False
                    }), 400

            elif column == "completed" and (
                not isinstance(data[column], int) or data[column] not in [0, 1]
            ):
                return jsonify({
                    "message": f"Pole {column} ma nieprawidlowe dane",
                    "success": False
                }), 400

    if not fields:
        db.close()
        return jsonify({
            "message": "Brak danych do aktualizacji",
            "success": False
        }), 400


    set_clause = ", ".join(f"{field} = ?" for field in fields)

    cursor.execute(
        f"UPDATE tasks SET {set_clause} WHERE id = ?",
        values + [id]
    )
    if cursor.rowcount == 0:
        db.close()
        return jsonify({
        "message": "Task nie został znaleziony",
        "success": False
    }), 404
    db.commit()
    db.close()

    return jsonify({
        "message": "Task został zaktualizowany",
        "success": True
    }), 200





if __name__ == "__main__":
    app.run(debug=True)