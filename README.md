# ToDoSite

A simple task management web application built with **HTML, CSS, JavaScript, Python, Flask and SQLite**.

The project provides a REST API for managing tasks and uses Docker Compose to run the backend and Nginx services.

## Features

- Create, retrieve, update and delete tasks (CRUD).
- REST API built with Flask.
- SQLite database for persistent task storage.
- Task categories and completion status.
- Input validation and HTTP error handling.
- Automated API tests using pytest.
- Dockerized backend.
- Nginx for serving the frontend and proxying API requests.
- Persistent SQLite storage using a Docker volume.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Styling |
| JavaScript | Frontend logic and API communication |
| Python | Backend programming |
| Flask | REST API |
| SQLite | Database |
| pytest | Automated testing |
| Docker | Application containerization |
| Docker Compose | Service orchestration |
| Nginx | Static file server and reverse proxy |
| Git | Version control |

## Project Structure

```text
ToDoSite/
│
├── backend/
│   ├── tests/
│   │   └── test_tasks.py
│   ├── app.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── TODO.html
│   ├── TODO.css
│   └── TODO.js
│
├── nginx/
│   └── default.conf
│
├── compose.yaml
├── .gitignore
└── LICENSE
```

## Architecture

The application consists of two main Docker services:

- **Backend:** Flask application responsible for API endpoints and database operations.
- **Nginx:** Serves static frontend files and forwards `/api/` requests to the Flask backend.

SQLite stores tasks in a persistent Docker volume, so data is preserved when containers are restarted.

```text
           User / Browser
                  |
                  v
               Nginx
                  |
          +-------+-------+
          |               |
          v               v
      Frontend         /api/*
    HTML/CSS/JS           |
                          v
                     Flask API
                          |
                          v
                       SQLite
```

## Getting Started

### Prerequisites

- Git
- Docker
- Docker Compose

### Run with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/KubaXQ/ToDoSite.git
```

2. Navigate to the project directory:

```bash
cd ToDoSite
```

3. Build and start the application:

```bash
docker compose up --build -d
```

4. Open the application in your browser:

```text
http://localhost:8080
```

### Stop the application

```bash
docker compose down
```

To also remove the persistent database volume:

```bash
docker compose down -v
```

**Warning:** The `-v` option removes the database volume and its stored data.

## REST API

All API endpoints use JSON where applicable and are available under `/api/tasks`.

### Task object

A task contains the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Unique task identifier |
| `title` | String | Task title |
| `description` | String | Task description |
| `category` | String | Task category |
| `completed` | Integer | Completion status (`0` or `1`) |

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/<id>` | Update selected task fields |
| DELETE | `/api/tasks/<id>` | Delete a task |

### Create a task

`POST /api/tasks`

Example request:

```json
{
  "title": "Learn Flask",
  "description": "Practice REST API development",
  "category": "Programming",
  "completed": 0
}
```

Successful response (`201 Created`):

```json
{
  "id": 1,
  "message": "Task został utworzony",
  "success": true
}
```

### Retrieve tasks

`GET /api/tasks`

Returns a list of tasks stored in the database.

### Update a task

`PATCH /api/tasks/1`

Example request:

```json
{
  "title": "Learn Flask Advanced",
  "completed": 1
}
```

Only the supplied fields are updated.

### Delete a task

`DELETE /api/tasks/1`

Deletes the task with the specified ID.

### HTTP status codes

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `201` | Task successfully created |
| `400` | Invalid request or validation error |
| `404` | Task not found |

## Database

The application uses SQLite with direct SQL queries through Python's `sqlite3` module.

The database table contains:

- `id` – primary key
- `title` – task title
- `description` – task description
- `category` – task category
- `completed` – task completion status

The database is initialized automatically when the backend starts.

## Testing

The backend includes automated tests written with **pytest**.

Tests cover:

- Retrieving tasks from the database.
- Creating tasks with valid data.
- Rejecting invalid or missing fields.
- Validating task completion status.
- Updating selected task fields.
- Deleting existing tasks.
- Handling requests for non-existent tasks.

### Run tests locally

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
python -m pip install pytest
```

Run the tests:

```bash
python -m pytest -v
```

The tests use a separate SQLite database configured through the `DB_PATH` environment variable, so test data does not need to be stored in the application's default database.

## Development

The project was developed as a practical way to learn and apply:

- Python backend development.
- Flask and REST API design.
- SQL and SQLite database operations.
- Input validation and error handling.
- Automated testing with pytest.
- Docker and Docker Compose.
- Nginx reverse proxy configuration.
- Git and GitHub version control.

## License

This project is available under the license included in the repository.