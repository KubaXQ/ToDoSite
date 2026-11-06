from app import app
from database import get_db


def _clear_tasks():
    """Czyści tabelę przed testem, żeby dane z innych testów nie przeszkadzały."""
    db = get_db()
    db.execute("DELETE FROM tasks")
    db.commit()
    db.close()


def _create_task():
    """Dodaje przykładowe zadanie i zwraca jego ID."""
    _clear_tasks()
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """INSERT INTO tasks (title, completed, description, category)
        VALUES (?, ?, ?, ?)""",
        ("original_title", 0, "original_description", "original_category"),
    )
    task_id = cursor.lastrowid
    db.commit()
    db.close()
    return task_id


def _valid_task():
    """Zwraca poprawne dane zadania, które można zmieniać w danym teście."""
    return {
        "title": "test_title",
        "description": "test_description",
        "category": "test_category",
        "completed": 1,
    }


def test_get_tasks_returns_tasks_from_database():
    # Endpoint GET zwraca listę zadań z bazy w oczekiwanym formacie.
    client = app.test_client()
    _create_task()

    response = client.get("/api/tasks")

    assert response.status_code == 200
    tasks = response.get_json()["tasks"]
    assert isinstance(tasks, list)
    assert len(tasks) == 1
    assert tasks[0][1:] == [
        "original_title",
        "original_description",
        "original_category",
        0,
    ]


def test_post_task_creates_task_and_returns_its_id():
    # Poprawne dane tworzą zadanie i zwracają jego identyfikator.
    client = app.test_client()
    _clear_tasks()

    response = client.post("/api/tasks", json=_valid_task())

    assert response.status_code == 201
    data = response.get_json()
    assert data["success"] is True
    assert isinstance(data["id"], int)

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT title, completed, description, category FROM tasks")
    assert cursor.fetchone() == (
        "test_title",
        1,
        "test_description",
        "test_category",
    )
    db.close()


def test_post_task_rejects_missing_title():
    # Tytuł jest wymagany przy tworzeniu zadania.
    client = app.test_client()
    task = _valid_task()
    del task["title"]

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_post_task_rejects_blank_title():
    # Tytuł zawierający wyłącznie białe znaki jest niepoprawny.
    client = app.test_client()
    task = _valid_task()
    task["title"] = "   "

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_post_task_rejects_completed_value_other_than_zero_or_one():
    # Pole completed przyjmuje tylko liczbę 0 albo 1.
    client = app.test_client()
    task = _valid_task()
    task["completed"] = 5

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_post_task_rejects_boolean_completed_value():
    # Wartość logiczna True nie powinna być traktowana jako liczba 1.
    client = app.test_client()
    task = _valid_task()
    task["completed"] = True

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_post_task_rejects_missing_category():
    # Kategoria jest wymagana; błędne dane nie mogą trafić do bazy.
    client = app.test_client()
    _clear_tasks()
    task = _valid_task()
    del task["category"]

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks")
    assert cursor.fetchall() == []
    db.close()


def test_post_task_rejects_blank_category():
    # Kategoria zawierająca wyłącznie białe znaki jest niepoprawna.
    client = app.test_client()
    task = _valid_task()
    task["category"] = "   "

    response = client.post("/api/tasks", json=task)

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_delete_task_removes_existing_task():
    # Usunięcie istniejącego zadania zwraca sukces i usuwa rekord z bazy.
    client = app.test_client()
    task_id = _create_task()

    response = client.delete(f"/api/tasks/{task_id}")

    assert response.status_code == 200
    assert response.get_json()["success"] is True
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    assert cursor.fetchone() is None
    db.close()


def test_delete_missing_task_returns_404():
    # Próba usunięcia nieistniejącego zadania zwraca 404.
    client = app.test_client()

    response = client.delete("/api/tasks/999999")

    assert response.status_code == 404
    assert response.get_json()["success"] is False


def test_patch_task_updates_only_supplied_fields():
    # PATCH zmienia wskazane pola, a pozostałe wartości pozostawia bez zmian.
    client = app.test_client()
    task_id = _create_task()

    response = client.patch(
        f"/api/tasks/{task_id}",
        json={"title": "updated_title", "completed": 1},
    )

    assert response.status_code == 200
    assert response.get_json()["success"] is True
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT title, completed, description, category FROM tasks WHERE id = ?",
        (task_id,),
    )
    assert cursor.fetchone() == (
        "updated_title",
        1,
        "original_description",
        "original_category",
    )
    db.close()


def test_patch_task_rejects_empty_update():
    # PATCH musi zawierać co najmniej jedno pole do zmiany.
    client = app.test_client()
    task_id = _create_task()

    response = client.patch(f"/api/tasks/{task_id}", json={})

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_patch_task_rejects_invalid_completed_value():
    # PATCH odrzuca completed inne niż 0 lub 1.
    client = app.test_client()
    task_id = _create_task()

    response = client.patch(f"/api/tasks/{task_id}", json={"completed": 5})

    assert response.status_code == 400
    assert response.get_json()["success"] is False


def test_patch_missing_task_returns_404():
    # Zmiana nieistniejącego zadania zwraca 404.
    client = app.test_client()

    response = client.patch("/api/tasks/999999", json={"title": "updated_title"})

    assert response.status_code == 404
    assert response.get_json()["success"] is False
