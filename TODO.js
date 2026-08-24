// Pobieramy z HTML dane przez id i przypisujemy do zmiennych
var taskInput = document.getElementById("taskInput")
var addTaskButton = document.getElementById("addTaskButton")
var taskCategory = document.getElementById("taskCategory")
var taskDetails = document.getElementById("taskDetails")
var taskContent = document.getElementById("taskContent")

// Nasłuchujemy kliknięcia przycisku "Dodaj Zadanie"
addTaskButton.addEventListener("click", function() {

    // Sprawdzamy, czy użytkownik faktycznie coś wpisał.
    // trim() usuwa spacje z początku i końca tekstu.
    if (taskInput.value.trim() === "") {
        alert("Please enter a task.")
        return
    }

    var taskElement = createTask(taskInput,taskCategory)

    
    taskElement.addEventListener("click",function(event){

   if (event.target.classList.contains("taskCheckbox")) {
        return
    }

    if (event.target.classList.contains("deleteTaskButton")) {
        return
    }
    
    openTaskDetails(taskElement)
    


    })  
    
    

    // ==========================================
    // DODANIE ZADANIA DO STRONY
    // ==========================================

    // Pobieramy kontener wszystkich zadań
    var taskListContainer = document.getElementById("taskListContainer")

    // Dodajemy gotowe zadanie do kontenera
    taskListContainer.appendChild(taskElement)


    // Czyścimy input po dodaniu zadania
    taskInput.value = ""


    // Aktualizujemy liczniki po dodaniu zadania
    updateTaskCounts()
})





var categoryButtons = document.querySelectorAll(".categoryButton")

categoryButtons.forEach(function(categoryButton) {

    categoryButton.addEventListener("click", function() {

        // Usuwamy aktywny styl ze wszystkich przycisków
        categoryButtons.forEach(function(button) {
            button.classList.remove("active")
        })

        // Dodajemy aktywny styl klikniętemu przyciskowi
        categoryButton.classList.add("active")


        // Pobieramy wszystkie zadania
        var taskElements = document.querySelectorAll(".task")

        taskElements.forEach(function(taskElement) {

            // "Wszystkie" pokazuje każdy task
            if (categoryButton.dataset.category === "all") {
                taskElement.style.display = "flex"
            }

            // Pozostałe kategorie pokazują tylko pasujące taski
            else if (
                taskElement.dataset.category ===
                categoryButton.dataset.category
            ) {
                taskElement.style.display = "flex"
            }

            // Pozostałe taski ukrywamy
            else {
                taskElement.style.display = "none"
            }

        })

    })

})

function createTask(taskInput,taskCategory)
{
// Tworzymy nowy element <div>, który będzie reprezentował jedno zadanie
    var taskElement = document.createElement("div")

    taskElement.dataset.category = taskCategory.value

    taskElement.dataset.description = ""

    // Dodajemy do niego klasę CSS "task"
    taskElement.classList.add("task")


    // ==========================================
    // TWORZENIE CHECKBOXA
    // ==========================================

    // Tworzymy nowy element <input>
    var taskCheckbox = document.createElement("input")

    // Ustawiamy jego typ na checkbox
    taskCheckbox.type = "checkbox"

    // Dodajemy klasę CSS
    taskCheckbox.classList.add("taskCheckbox")

    // Wkładamy checkbox do naszego zadania
    taskElement.appendChild(taskCheckbox)


    // Reagujemy na kliknięcie checkboxa
    taskCheckbox.addEventListener("click", function() {

        // Jeżeli checkbox jest zaznaczony,
        // przekreślamy tekst zadania.
        //
        // Jeżeli nie jest zaznaczony,
        // usuwamy przekreślenie.
        taskTextElement.style.textDecoration =
            taskCheckbox.checked ? "line-through" : "none"

        // Po zmianie statusu zadania aktualizujemy liczniki
        updateTaskCounts()
    })


    // ==========================================
    // TWORZENIE TEKSTU ZADANIA
    // ==========================================

    // Tworzymy element <span>, który będzie zawierał tekst zadania
    var taskTextElement = document.createElement("span")

    // Pobieramy tekst wpisany przez użytkownika
    // i ustawiamy go jako zawartość <span>
    taskTextElement.textContent = taskInput.value

    // Dodajemy tekst do naszego zadania
    taskElement.appendChild(taskTextElement)


    // ==========================================
    // TWORZENIE PRZYCISKU USUWANIA
    // ==========================================

    // Tworzymy przycisk
    var deleteTaskButton = document.createElement("button")

    // Ustawiamy tekst przycisku
    deleteTaskButton.textContent = "Delete"

    // Dodajemy klasę CSS
    deleteTaskButton.classList.add("deleteTaskButton")


    // Reagujemy na kliknięcie przycisku usuwania
    deleteTaskButton.addEventListener("click", function() {

        // parentElement oznacza rodzica przycisku.
        // W naszym przypadku jest nim <div class="task">.
        //
        // remove() usuwa ten konkretny element z DOM.
        deleteTaskButton.parentElement.remove()

        // Po usunięciu zadania aktualizujemy liczniki
        updateTaskCounts()
    })


    // Dodajemy przycisk usuwania do naszego zadania
    taskElement.appendChild(deleteTaskButton)

    return taskElement

}





// ==========================================
// AKTUALIZOWANIE LICZNIKÓW
// ==========================================

function updateTaskCounts() {

    // Pobieramy wszystkie elementy reprezentujące zadania
    var taskElements = document.querySelectorAll(".task")

    // Liczba wszystkich zadań to liczba znalezionych elementów .task
    document.getElementById("allTasksCount").textContent =
        taskElements.length


    // Pobieramy wszystkie checkboxy należące do zadań
    var taskCheckboxes = document.querySelectorAll(".taskCheckbox")


    // ==========================================
    // LICZBA ZADAŃ DO ZROBIENIA
    // ==========================================

    // Na początku mamy 0 zadań do zrobienia
    var todoTaskCount = 0

    // Przechodzimy przez każdy checkbox
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Jeżeli checkbox NIE jest zaznaczony,
        // oznacza to, że zadanie nie zostało ukończone
        if (!taskCheckbox.checked) {
            todoTaskCount++
        }
    })

    // Wyświetlamy liczbę zadań do zrobienia
    document.getElementById("doZrobieniaCount").textContent =
        todoTaskCount


    // ==========================================
    // LICZBA UKOŃCZONYCH ZADAŃ
    // ==========================================

    // Na początku mamy 0 ukończonych zadań
    var completedTaskCount = 0

    // Ponownie przechodzimy przez wszystkie checkboxy
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Jeżeli checkbox jest zaznaczony,
        // oznacza to, że zadanie zostało ukończone
        if (taskCheckbox.checked) {
            completedTaskCount++
        }
    })

    // Wyświetlamy liczbę ukończonych zadań
    document.getElementById("ZrobioneCount").textContent =
        completedTaskCount
}

// ==========================================
// Opis tasków
// ==========================================

function openTaskDetails(taskElement) {
var selectedTasks = document.querySelectorAll(".task.selected")

    selectedTasks.forEach(function(selectedTask) {
    selectedTask.classList.remove("selected")
    })

    taskElement.classList.add("selected")
    taskContent.classList.add("details-open")

    taskDetails.style.display = "block"

    taskDetails.innerHTML =
    "<h2>" + taskElement.querySelector("span").textContent + "</h2>"
    + "<textarea>" + taskElement.dataset.description + "</textarea>"
    + "<button id='saveDescriptionButton'>Zapisz</button>"

var saveDescriptionButton = document.getElementById("saveDescriptionButton")

var descriptionTextarea = taskDetails.querySelector("textarea")

    saveDescriptionButton.addEventListener("click", function() {

        taskElement.dataset.description = descriptionTextarea.value

    })
}