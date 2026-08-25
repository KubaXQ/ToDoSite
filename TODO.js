// ==========================================
// DANE APLIKACJI
// ==========================================

// Tablica przechowująca wszystkie zadania.
// Jest głównym źródłem danych naszej aplikacji.
// To właśnie jej zawartość zapisujemy później w localStorage.
var tasks = []


// ==========================================
// WCZYTYWANIE ZADAŃ Z localStorage
// ==========================================

// Po załadowaniu strony próbujemy odtworzyć wcześniej zapisane zadania.
window.addEventListener("load", function() {

    // Pobieramy dane zapisane wcześniej pod kluczem "tasks".
    // localStorage zwraca dane jako tekst.
    var savedTasks = localStorage.getItem("tasks")

    // Jeżeli nie ma zapisanych danych, nie mamy czego odtwarzać.
    if(savedTasks === null){
        return
    }

    // JSON.parse() zamienia tekst JSON z powrotem
    // na tablicę obiektów JavaScript.
    var tasksFromStorage = JSON.parse(savedTasks)

    // Przechodzimy przez wszystkie zapisane zadania
    // i odtwarzamy je na stronie.
    tasksFromStorage.forEach(function(task) {

        // Dodajemy odtworzone zadanie do głównej tablicy.
        tasks.push(task)

        // Tworzymy element HTML reprezentujący zadanie.
        var taskElement = createTask(task)

        // Dodajemy do zadania listenery i jego zachowanie.
        setupTask(taskElement)

        // Dodajemy utworzony element do DOM,
        // dzięki czemu zadanie pojawia się na stronie.
        document.getElementById("taskListContainer").appendChild(taskElement)

    })
    updateTaskCounts()
})


// ==========================================
// POBIERANIE ELEMENTÓW Z HTML
// ==========================================

// Pobieramy elementy HTML po ich id
// i zapisujemy je w zmiennych,
// aby móc później manipulować nimi w JavaScript.
var taskInput = document.getElementById("taskInput")
var addTaskButton = document.getElementById("addTaskButton")
var taskCategory = document.getElementById("taskCategory")
var taskDetails = document.getElementById("taskDetails")
var taskContent = document.getElementById("taskContent")


// ==========================================
// DODAWANIE NOWEGO ZADANIA
// ==========================================

// Nasłuchujemy kliknięcia przycisku "Dodaj Zadanie".
addTaskButton.addEventListener("click", function() {

    // Sprawdzamy, czy użytkownik faktycznie coś wpisał.
    // trim() usuwa spacje z początku i końca tekstu.
    if (taskInput.value.trim() === "") {
        alert("Please enter a task.")
        return
    }

    // Tworzymy obiekt reprezentujący jedno zadanie.
    //
    // Obiekt przechowuje dane zadania,
    // a nie jego wygląd na stronie.
    var task = {

        // Tytuł zadania pobieramy z inputa.
        title: taskInput.value,

        // Na początku zadanie nie ma opisu.
        description: "",

        // Kategorię pobieramy z selecta.
        category: taskCategory.value,

        // Nowe zadanie nie jest jeszcze ukończone.
        completed: false
    }

    // Dodajemy obiekt task do głównej tablicy zadań.
    tasks.push(task)

    // Zapisujemy aktualną tablicę do localStorage.
    saveTasks()

    // Na podstawie obiektu task tworzymy jego wizualną reprezentację.
    var taskElement = createTask(task)

    // Dodajemy zachowanie i listenery do elementu zadania.
    setupTask(taskElement)


    // ==========================================
    // DODANIE ZADANIA DO STRONY
    // ==========================================

    // Pobieramy kontener wszystkich zadań.
    var taskListContainer =
        document.getElementById("taskListContainer")

    // Dodajemy gotowe zadanie do DOM,
    // dzięki czemu użytkownik widzi je na stronie.
    taskListContainer.appendChild(taskElement)


    // Czyścimy input po dodaniu zadania.
    taskInput.value = ""

    // Aktualizujemy liczniki zadań.
    updateTaskCounts()
})


// ==========================================
// OBSŁUGA KATEGORII
// ==========================================

// Pobieramy wszystkie przyciski kategorii.
var categoryButtons =
    document.querySelectorAll(".categoryButton")

// Dodajemy listener do każdego przycisku kategorii.
categoryButtons.forEach(function(categoryButton) {

    categoryButton.addEventListener("click", function() {

        // Usuwamy aktywny styl ze wszystkich przycisków.
        categoryButtons.forEach(function(button) {
            button.classList.remove("active")
        })

        // Dodajemy aktywny styl klikniętemu przyciskowi.
        categoryButton.classList.add("active")


        // Pobieramy wszystkie zadania znajdujące się w DOM.
        var taskElements = document.querySelectorAll(".task")

        // Sprawdzamy każde zadanie.
        taskElements.forEach(function(taskElement) {

            // Jeżeli wybrana jest kategoria "all",
            // pokazujemy każde zadanie.
            if (categoryButton.dataset.category === "all") {
                taskElement.style.display = "flex"
            }

            // Jeżeli kategoria zadania odpowiada
            // wybranej kategorii, pokazujemy zadanie.
            else if (
                taskElement.dataset.category ===
                categoryButton.dataset.category
            ) {
                taskElement.style.display = "flex"
            }

            // Pozostałe zadania ukrywamy.
            else {
                taskElement.style.display = "none"
            }

        })

    })

})


// ==========================================
// TWORZENIE WIZUALNEGO ZADANIA
// ==========================================

// Na podstawie obiektu task tworzymy elementy HTML,
// które użytkownik widzi na stronie.
function createTask(task)
{

    // Tworzymy nowy element <div>,
    // który będzie reprezentował jedno zadanie.
    var taskElement = document.createElement("div")

    
    // Łączymy element DOM z obiektem danych,
    // który reprezentuje to konkretne zadanie.
    //
    // Dzięki temu możemy później dostać się
    // do danych poprzez taskElement.task.
    taskElement.task = task


    
    // Dodajemy klasę CSS "task".
    taskElement.classList.add("task")


    // ==========================================
    // TWORZENIE CHECKBOXA
    // ==========================================

    // Tworzymy nowy element <input>.
    var taskCheckbox = document.createElement("input")

    // Ustawiamy jego typ na checkbox.
    taskCheckbox.type = "checkbox"

    // Ustawiamy checkbox zgodnie z wartością
    // completed przechowywaną w obiekcie task.
    taskCheckbox.checked = task.completed

    // Dodajemy klasę CSS.
    taskCheckbox.classList.add("taskCheckbox")

    // Wkładamy checkbox do naszego zadania.
    taskElement.appendChild(taskCheckbox)


    // ==========================================
    // OBSŁUGA CHECKBOXA
    // ==========================================

    // Reagujemy na kliknięcie checkboxa.
    taskCheckbox.addEventListener("click", function() {

        // Jeżeli checkbox jest zaznaczony,
        // przekreślamy tekst zadania.
        //
        // Jeżeli nie jest zaznaczony,
        // usuwamy przekreślenie.
        taskTextElement.style.textDecoration =
            taskCheckbox.checked ? "line-through" : "none"

        // Aktualizujemy dane obiektu task.
        task.completed = taskCheckbox.checked

        // Zapisujemy zmienione dane do localStorage.
        saveTasks()

        // Aktualizujemy liczniki zadań.
        updateTaskCounts()
    })


    // ==========================================
    // TWORZENIE TEKSTU ZADANIA
    // ==========================================

    // Tworzymy element <span>,
    // który będzie zawierał tekst zadania.
    var taskTextElement = document.createElement("span")

    // Ustawiamy tekst na podstawie właściwości
    // title z obiektu task.
    taskTextElement.textContent = task.title

    if (task.completed) {
    taskTextElement.style.textDecoration = "line-through"
    }
    // Dodajemy tekst do elementu zadania.
    taskElement.appendChild(taskTextElement)


    // ==========================================
    // TWORZENIE PRZYCISKU USUWANIA
    // ==========================================

    // Tworzymy przycisk.
    var deleteTaskButton = document.createElement("button")

    // Ustawiamy tekst przycisku.
    deleteTaskButton.textContent = "Delete"

    // Dodajemy klasę CSS.
    deleteTaskButton.classList.add("deleteTaskButton")


    // ==========================================
    // OBSŁUGA USUWANIA ZADANIA
    // ==========================================

    // Reagujemy na kliknięcie przycisku usuwania.
    deleteTaskButton.addEventListener("click", function() {

        // Szukamy indeksu konkretnego obiektu task
        // w tablicy przechowującej wszystkie zadania.
        var taskIndex = tasks.findIndex(function(taskFromArray) {

            // Sprawdzamy, czy element z tablicy
            // jest dokładnie tym samym obiektem,
            // który reprezentuje aktualne zadanie.
            return taskFromArray === task

        })

        // Usuwamy znaleziony obiekt z tablicy.
        //
        // Pierwszy argument to indeks,
        // drugi oznacza liczbę elementów do usunięcia.
        tasks.splice(taskIndex, 1)

        // Usuwamy wizualny element zadania z DOM.
        deleteTaskButton.parentElement.remove()

        // Zapisujemy zmienioną tablicę do localStorage.
        saveTasks()

        // Aktualizujemy liczniki.
        updateTaskCounts()
    })


    // Dodajemy przycisk usuwania do zadania.
    taskElement.appendChild(deleteTaskButton)

    // Zwracamy gotowy element DOM,
    // aby można było później dodać go do strony.
    return taskElement
}


// ==========================================
// AKTUALIZOWANIE LICZNIKÓW
// ==========================================

function updateTaskCounts() {

    // Pobieramy wszystkie elementy reprezentujące zadania.
    var taskElements = document.querySelectorAll(".task")

    // Liczba wszystkich zadań to liczba znalezionych elementów .task.
    document.getElementById("allTasksCount").textContent =
        taskElements.length


    // Pobieramy wszystkie checkboxy należące do zadań.
    var taskCheckboxes =
        document.querySelectorAll(".taskCheckbox")


    // ==========================================
    // LICZBA ZADAŃ DO ZROBIENIA
    // ==========================================

    // Na początku mamy 0 zadań do zrobienia.
    var todoTaskCount = 0

    // Przechodzimy przez każdy checkbox.
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Jeżeli checkbox NIE jest zaznaczony,
        // oznacza to, że zadanie nie zostało ukończone.
        if (!taskCheckbox.checked) {
            todoTaskCount++
        }
    })

    // Wyświetlamy liczbę zadań do zrobienia.
    document.getElementById("doZrobieniaCount").textContent =
        todoTaskCount


    // ==========================================
    // LICZBA UKOŃCZONYCH ZADAŃ
    // ==========================================

    // Na początku mamy 0 ukończonych zadań.
    var completedTaskCount = 0

    // Ponownie przechodzimy przez wszystkie checkboxy.
    taskCheckboxes.forEach(function(taskCheckbox) {

        // Jeżeli checkbox jest zaznaczony,
        // oznacza to, że zadanie zostało ukończone.
        if (taskCheckbox.checked) {
            completedTaskCount++
        }
    })

    // Wyświetlamy liczbę ukończonych zadań.
    document.getElementById("ZrobioneCount").textContent =
        completedTaskCount
}


// ==========================================
// PANEL SZCZEGÓŁÓW ZADANIA
// ==========================================

// Otwiera panel szczegółów dla wybranego zadania.
function openTaskDetails(taskElement) {

    // Pobieramy aktualnie zaznaczone zadania.
    var selectedTasks =
        document.querySelectorAll(".task.selected")

    // Usuwamy zaznaczenie z poprzednio wybranego zadania.
    selectedTasks.forEach(function(selectedTask) {
        selectedTask.classList.remove("selected")
    })

    // Dodajemy klasę selected do aktualnego zadania.
    taskElement.classList.add("selected")

    // Otwieramy panel szczegółów.
    taskContent.classList.add("details-open")

    taskDetails.style.display = "block"


    // ==========================================
    // TWORZENIE ZAWARTOŚCI PANELU
    // ==========================================

    // Tworzymy zawartość panelu na podstawie danych
    // należących do aktualnie wybranego zadania.
    taskDetails.innerHTML =
        "<input value='" + taskElement.querySelector("span").textContent + "' id='title'>"
        + "<select id='taskCategoryDescription'>"
        +"<option value='projects'>Projekty</option>"
        +"<option value='personal'>Osobiste</option>" 
        +"</select>"
        + "<textarea>" + taskElement.task.description + "</textarea>"
        + "<button class='saveDescriptionButton'>Zapisz</button>"


    

    // Pobieramy przycisk zapisu z aktualnie otwartego panelu.
    var saveDescriptionButton =
        taskDetails.querySelector(".saveDescriptionButton")

    // Pobieramy textarea z aktualnie otwartego panelu.
    var descriptionTextarea = taskDetails.querySelector("textarea")

    // Pobieramy zmiany wyborów w opisie
    var changeTitle = document.getElementById("title")
    var changeCategory = document.getElementById("taskCategoryDescription")

    // ==========================================
    // ZAPISYWANIE OPISU
    // ==========================================

    // Reagujemy na kliknięcie przycisku "Zapisz".
    saveDescriptionButton.addEventListener("click", function() {

        // Aktualizujemy opis w obiekcie task.
        taskElement.task.description = descriptionTextarea.value

        taskElement.task.title = changeTitle.value
        taskElement.task.category = changeCategory.value

        taskElement.dataset.category = changeCategory.value


        taskElement.querySelector("span").textContent = changeTitle.value

        // Zapisujemy zmienione dane do localStorage.
        saveTasks()
    })


    // ==========================================
    // PRZYCISK ZAMYKANIA PANELU
    // ==========================================

    // Tworzymy przycisk X.
    var closeButton = document.createElement("button")

    // Ustawiamy jego tekst.
    closeButton.textContent = "X"

    // Dodajemy klasę CSS.
    closeButton.classList.add("closeTaskDetails")

    // Ustawiamy typ button,
    // żeby nie zachowywał się jak submit.
    closeButton.type = "button"

    // Dodajemy przycisk do panelu szczegółów.
    taskDetails.appendChild(closeButton)


    // ==========================================
    // ZAMYKANIE PANELU
    // ==========================================

    // Reagujemy na kliknięcie przycisku X.
    closeButton.addEventListener("click", function() {

        // Ukrywamy panel szczegółów.
        taskDetails.style.display = "none"

        // Usuwamy klasę otwartego panelu.
        taskContent.classList.remove("details-open")

        // Usuwamy zaznaczenie z zadania.
        taskElement.classList.remove("selected")
    })
}


// ==========================================
// ZAPISYWANIE DANYCH
// ==========================================

// localStorage przechowuje dane jako tekst,
// dlatego zamieniamy tablicę obiektów JavaScript
// na JSON za pomocą JSON.stringify().
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    )
}


// ==========================================
// KONFIGUROWANIE ZACHOWANIA ZADANIA
// ==========================================

// Dodaje listener odpowiedzialny za otwieranie
// panelu szczegółów po kliknięciu zadania.
//
// Checkbox i przycisk Delete są pomijane,
// ponieważ posiadają własne listenery.
function setupTask(taskElement) {

    taskElement.addEventListener("click", function(event) {

        // Jeżeli kliknięto checkbox,
        // nie otwieramy panelu szczegółów.
        if (event.target.classList.contains("taskCheckbox")) {
            return
        }

        // Jeżeli kliknięto przycisk Delete,
        // nie otwieramy panelu szczegółów.
        if (event.target.classList.contains("deleteTaskButton")) {
            return
        }

        // W pozostałych przypadkach otwieramy szczegóły zadania.
        openTaskDetails(taskElement)

    })

}