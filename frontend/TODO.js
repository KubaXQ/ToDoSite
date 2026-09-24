// Dane zadań w pamięci.
var tasks = []

// Wczytanie zadań po starcie.
window.addEventListener("load", function() {
    loadTasks()
    updateTaskCounts()
})

// Pobieranie elementów z HTML.

// Elementy HTML.
var taskInput = document.getElementById("taskInput")
var addTaskButton = document.getElementById("addTaskButton")
var taskCategory = document.getElementById("taskCategory")
var taskDetails = document.getElementById("taskDetails")
var taskContent = document.getElementById("taskContent")

// Dodawanie nowego zadania.

// Obsługa dodawania zadania.
addTaskButton.addEventListener("click", async function() {

    // Sprawdzamy, czy tytuł nie jest pusty.
    if (taskInput.value.trim() === "") {
        alert("Please enter a task.")
        return
    }

    // Tworzymy obiekt zadania.
    var task = {

        // Tytuł z inputa.
        title: taskInput.value,

        // Początkowo pusty opis.
        description: "",

        // Kategoria z selecta.
        category: taskCategory.value,

        // Domyślnie nieukończone.
        completed: false
    }

    // Dodajemy zadanie do tablicy.
    tasks.push(task)

    await addTaskToAPI(task)

    // Tworzymy element zadania.
    var taskElement = createTask(task)

    // Dodajemy listenery.
    setupTask(taskElement)

    // Dodanie zadania do strony.

    // Pobieramy kontener zadań.
    var taskListContainer =
        document.getElementById("taskListContainer")

    // Dodajemy zadanie do DOM.
    taskListContainer.appendChild(taskElement)

    // Czyścimy input.
    taskInput.value = ""

    // Aktualizujemy liczniki.
    updateTaskCounts()
})

// Obsługa kategorii.

// Pobieramy przyciski kategorii.
var categoryButtons =
    document.querySelectorAll(".categoryButton")

// Obsługujemy przyciski kategorii.
categoryButtons.forEach(function(categoryButton) {

    categoryButton.addEventListener("click", function() {

        // Czyścimy aktywny styl.
        categoryButtons.forEach(function(button) {
            button.classList.remove("active")
        })

        // Ustawiamy aktywną kategorię.
        categoryButton.classList.add("active")

        filterTasks(categoryButton.dataset.category)

    })

})

// Tworzenie wizualnego zadania.

// Tworzymy HTML zadania.
function createTask(task)
{

    // Tworzymy element zadania.
    var taskElement = document.createElement("div")

    // Łączymy DOM z obiektem task.
    taskElement.task = task

    taskElement.dataset.category = task.category

    // Dodajemy klasę task.
    taskElement.classList.add("task")

    // Tworzenie checkboxa.

    // Tworzymy checkbox.
    var taskCheckbox = document.createElement("input")

    // Ustawiamy typ checkbox.
    taskCheckbox.type = "checkbox"

    // Ustawiamy stan checkboxa.
    taskCheckbox.checked = task.completed

    // Dodajemy klasę CSS.
    taskCheckbox.classList.add("taskCheckbox")

    // Dodajemy checkbox do zadania.
    taskElement.appendChild(taskCheckbox)

    // Obsługa checkboxa.

    // Obsługa zmiany statusu.
    taskCheckbox.addEventListener("click", async function() {

        // Aktualizujemy przekreślenie.
        taskTextElement.style.textDecoration =
            taskCheckbox.checked ? "line-through" : "none"

        // Aktualizujemy task.
        task.completed = taskCheckbox.checked

        await updateTaskInAPI(task,
            {
                completed: task.completed
            })

        // Aktualizujemy liczniki.
        updateTaskCounts()
    })

    // Tworzenie tekstu zadania.

    // Tworzymy tekst zadania.
    var taskTextElement = document.createElement("span")

    // Ustawiamy tytuł.
    taskTextElement.textContent = task.title

    if (task.completed) {
        taskTextElement.style.textDecoration = "line-through"
    }

    // Dodajemy tekst do zadania.
    taskElement.appendChild(taskTextElement)

    // Tworzenie przycisku usuwania.

    // Tworzymy przycisk usuwania.
    var deleteTaskButton = document.createElement("button")

    // Ustawiamy tekst przycisku.
    deleteTaskButton.textContent = "Delete"

    // Dodajemy klasę CSS.
    deleteTaskButton.classList.add("deleteTaskButton")

    // Obsługa usuwania zadania.

    // Obsługa usuwania.
    deleteTaskButton.addEventListener("click", async function() {

        // Szukamy zadania w tablicy.
        var taskIndex = tasks.findIndex(function(taskFromArray) {

            // Sprawdzamy obiekt task.
            return taskFromArray === task

        })

        // Usuwamy zadanie z API.
        await deleteTaskFromAPI(task)

        tasks.splice(taskIndex, 1)

        // Usuwamy zadanie z DOM.
        deleteTaskButton.parentElement.remove()

        // Aktualizujemy liczniki.
        updateTaskCounts()
    })

    // Dodajemy przycisk do zadania.
    taskElement.appendChild(deleteTaskButton)

    // Zwracamy element zadania.
    return taskElement
}

// Aktualizowanie liczników.

function updateTaskCounts() {

    // Pobieramy zadania z DOM.
    var taskElements = document.querySelectorAll(".task")

    // Liczymy wszystkie zadania.
    document.getElementById("allTasksCount").textContent =
        taskElements.length

    // Pobieramy checkboxy.
    var taskCheckboxes =
        document.querySelectorAll(".taskCheckbox")

    // Liczba zadań do zrobienia.

    // Licznik zadań do zrobienia.
    var todoTaskCount = 0

    // Sprawdzamy checkboxy.
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Liczymy nieukończone zadania.
        if (!taskCheckbox.checked) {
            todoTaskCount++
        }
    })

    // Wyświetlamy licznik.
    document.getElementById("doZrobieniaCount").textContent =
        todoTaskCount

    // Liczba ukończonych zadań.

    // Licznik ukończonych zadań.
    var completedTaskCount = 0

    // Sprawdzamy ukończone zadania.
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Liczymy ukończone zadania.
        if (taskCheckbox.checked) {
            completedTaskCount++
        }
    })

    // Wyświetlamy licznik.
    document.getElementById("ZrobioneCount").textContent =
        completedTaskCount
}

// Panel szczegółów zadania.

// Otwiera szczegóły zadania.
function openTaskDetails(taskElement) {

    // Pobieramy zaznaczone zadania.
    var selectedTasks =
        document.querySelectorAll(".task.selected")

    // Czyścimy poprzednie zaznaczenie.
    selectedTasks.forEach(function(selectedTask) {
        selectedTask.classList.remove("selected")
    })

    // Zaznaczamy zadanie.
    taskElement.classList.add("selected")

    // Otwieramy panel.
    taskContent.classList.add("details-open")

    taskDetails.style.display = "block"

    // Tworzenie zawartości panelu.

    // Budujemy panel z danymi zadania.
    taskDetails.innerHTML =
        "<input value='" + taskElement.querySelector("span").textContent + "' id='title'>"
        + "<select id='taskCategoryDescription'>"
        +"<option value='projects'>Projekty</option>"
        +"<option value='personal'>Osobiste</option>"
        +"</select>"
        + "<textarea>" + taskElement.task.description + "</textarea>"
        + "<button class='saveDescriptionButton'>Zapisz</button>"

    // Pobieramy przycisk zapisu.
    var saveDescriptionButton =
        taskDetails.querySelector(".saveDescriptionButton")

    // Pobieramy textarea.
    var descriptionTextarea = taskDetails.querySelector("textarea")

    // Pobieramy tytuł i kategorię.
    var changeTitle = document.getElementById("title")
    var changeCategory = document.getElementById("taskCategoryDescription")

    // Zapisywanie opisu.

    // Obsługa zapisu zmian.
    saveDescriptionButton.addEventListener("click", async function() {

        await updateTaskInAPI(taskElement.task,
            {
                description: descriptionTextarea.value,
                title: changeTitle.value,
                category: changeCategory.value,
            })

        // Aktualizujemy dane zadania.
        taskElement.task.description = descriptionTextarea.value
        taskElement.task.title = changeTitle.value
        taskElement.task.category = changeCategory.value

        taskElement.dataset.category = changeCategory.value

        taskElement.querySelector("span").textContent = changeTitle.value

        var activeCategory = document.querySelector(".categoryButton.active")

        filterTasks(activeCategory.dataset.category)
    })

    // Przycisk zamykania panelu.

    // Tworzymy przycisk zamknięcia.
    var closeButton = document.createElement("button")

    // Ustawiamy tekst przycisku.
    closeButton.textContent = "X"

    // Dodajemy klasę CSS.
    closeButton.classList.add("closeTaskDetails")

    // Ustawiamy typ button.
    closeButton.type = "button"

    // Dodajemy przycisk do panelu.
    taskDetails.appendChild(closeButton)

    // Zamykanie panelu.

    // Obsługa zamykania panelu.
    closeButton.addEventListener("click", function() {

        // Ukrywamy panel.
        taskDetails.style.display = "none"

        // Zamykamy panel.
        taskContent.classList.remove("details-open")

        // Czyścimy zaznaczenie.
        taskElement.classList.remove("selected")
    })
}

// Konfigurowanie zachowania zadania.

// Obsługa kliknięcia zadania.
function setupTask(taskElement) {

    taskElement.addEventListener("click", function(event) {

        // Pomijamy checkbox.
        if (event.target.classList.contains("taskCheckbox")) {
            return
        }

        // Pomijamy Delete.
        if (event.target.classList.contains("deleteTaskButton")) {
            return
        }

        // Otwieramy szczegóły zadania.
        openTaskDetails(taskElement)

    })

}

// Filtrowanie zadań.
function filterTasks(category){

    // Pobieramy zadania z DOM.
    var taskElements = document.querySelectorAll(".task")

    // Sprawdzamy zadania.
    taskElements.forEach(function(taskElement) {

        // Dla "all" pokazujemy wszystko.
        if (category === "all") {
            taskElement.style.display = "flex"
        }

        // Pokazujemy pasującą kategorię.
        else if (
            taskElement.dataset.category === category
        ) {
            taskElement.style.display = "flex"
        }

        // Ukrywamy pozostałe zadania.
        else {
            taskElement.style.display = "none"
        }

    })
}

// API.

// GET - pobiera zadania.
async function loadTasks() {

    const response = await fetch("http://127.0.0.1:5000/api/tasks");

    const data = await response.json();

    data.tasks.forEach(function(taskFromAPI) {

        var task = {
            id: taskFromAPI[0],
            title: taskFromAPI[1],
            description: taskFromAPI[2],
            category: taskFromAPI[3],
            completed: taskFromAPI[4] == 1 ? true : false
        }

        // Dodajemy zadanie do tablicy.
        tasks.push(task)

        // Tworzymy element zadania.
        var taskElement = createTask(task)

        // Dodajemy listenery.
        setupTask(taskElement)

        // Dodajemy zadanie do DOM.
        document.getElementById("taskListContainer").appendChild(taskElement)
    })

    console.log(data);
}

// POST - dodaje zadanie.
async function addTaskToAPI(task) {

    const taskToSend = {
        title: task.title,
        description: task.description,
        category: task.category,
        completed: task.completed ? 1 : 0
    }

    const response = await fetch("http://127.0.0.1:5000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(taskToSend)
    })

    const data = await response.json();

    task.id = data.id

    console.log(data);
}

// PATCH - aktualizuje pola.
async function updateTaskInAPI(task, fields) {

    const response = await fetch(
        "http://127.0.0.1:5000/api/tasks/" + task.id,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fields)
        }
    )
}

// DELETE - usuwa zadanie.
async function deleteTaskFromAPI(task) {

    const response = await fetch(
        "http://127.0.0.1:5000/api/tasks/" + task.id,
        {
            method: "DELETE"
        }
    )

    const data = await response.json()
}