const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const clearCompleted = document.getElementById("clearCompleted");

const currentDate = document.getElementById("currentDate");

const navItems = document.querySelectorAll(".nav-item");


let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


// ================= DATE =================

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});


// ================= ADD TASK =================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        priority: priorityInput.value,

        completed: false,

        createdAt: new Date().toLocaleDateString()
    };


    tasks.unshift(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


// ================= DISPLAY TASKS =================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    // Filter

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(task => !task.completed);
    }


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(task => task.completed);
    }


    // Search

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    if (searchTerm !== "") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.text.toLowerCase().includes(searchTerm)
            );
    }


    // Empty state

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";
    }


    // Create tasks

    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className = "task";


        if (task.completed) {

            taskElement.classList.add("completed");
        }


        taskElement.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div class="task-content">

                    <strong>

                        ${escapeHTML(task.text)}

                        <span class="priority ${task.priority}">
                            ${capitalize(task.priority)}
                        </span>

                    </strong>

                    <small>
                        Created ${task.createdAt}
                    </small>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="action-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete task"
                >

                    <i class="bi bi-trash3"></i>

                </button>

            </div>

        `;


        taskList.appendChild(taskElement);
    });


    updateStatistics();
}


// ================= TOGGLE TASK =================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;
        }

        return task;
    });


    saveTasks();

    displayTasks();
}


// ================= DELETE TASK =================

function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    displayTasks();
}


// ================= CLEAR COMPLETED =================

clearCompleted.addEventListener("click", () => {

    tasks =
        tasks.filter(task => !task.completed);


    saveTasks();

    displayTasks();
});


// ================= FILTER =================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav =>
            nav.classList.remove("active")
        );


        item.classList.add("active");


        currentFilter =
            item.dataset.filter;


        displayTasks();
    });
});


// ================= SEARCH =================

searchInput.addEventListener("input", displayTasks);


// ================= ENTER KEY =================

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        addTask();
    }
});


// ================= ADD BUTTON =================

addTaskBtn.addEventListener("click", addTask);


// ================= STATISTICS =================

function updateStatistics() {

    const total = tasks.length;


    const completed =
        tasks.filter(task => task.completed).length;


    const active =
        total - completed;


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;


    let progress = 0;


    if (total > 0) {

        progress =
            Math.round((completed / total) * 100);
    }


    progressText.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;
}


// ================= LOCAL STORAGE =================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}




function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================= INITIAL LOAD =================

displayTasks();