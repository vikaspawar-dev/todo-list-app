const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todolist");
const themeToggle = document.getElementById("themeToggle");

let editMode = false;
let editTarget = null;

/* Add Task */
addBtn.onclick = () => {
    const text = inputBox.value.trim();
    if (text === "") return alert("Enter task");

    if (editMode) {
        editTarget.querySelector("p").innerText = text;
        editMode = false;
        addBtn.innerText = "Add";
        updateLocalStorage();
        inputBox.value = "";
        return;
    }

    createTask(text);
    updateLocalStorage();
    inputBox.value = "";
};

/* Create Task */
function createTask(text) {
    const li = document.createElement("li");

    const p = document.createElement("p");
    p.innerText = text;

    p.onclick = () => {
        li.classList.toggle("completed");
        updateLocalStorage();
    };

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");

    editBtn.onclick = () => {
        inputBox.value = p.innerText;
        editMode = true;
        editTarget = li;
        addBtn.innerText = "Edit";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("btn", "deleteBtn");

    deleteBtn.onclick = () => removeTask(li);

    li.append(p, editBtn, deleteBtn);
    todoList.appendChild(li);

    addSwipe(li);
}

/* Remove with animation */
function removeTask(li) {
    li.classList.add("removing");
    setTimeout(() => {
        li.remove();
        updateLocalStorage();
    }, 300);
}

/* Swipe Delete */
function addSwipe(li) {
    let startX = 0;

    li.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    li.addEventListener("touchmove", e => {
        let diff = e.touches[0].clientX - startX;
        if (diff < 0) {
            li.style.transform = `translateX(${diff}px)`;
        }
    });

    li.addEventListener("touchend", e => {
        let diff = e.changedTouches[0].clientX - startX;

        if (diff < -100) {
            removeTask(li);
        } else {
            li.style.transform = "translateX(0)";
        }
    });
}

/* LocalStorage */
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("p").innerText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        createTask(task.text);
        if (task.completed) {
            todoList.lastChild.classList.add("completed");
        }
    });
}

/* Theme */
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerText = "☀️";
}

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.innerText = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.innerText = "🌙";
        localStorage.setItem("theme", "light");
    }
};

loadTasks();