let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];


let categoriesVisible = false;



function toggleCategories(event) {
    event.stopPropagation();
    let menuCategoryContainer = document.getElementById("menu-category-container");
    let arrow = document.getElementById("toggle-arrow");

    if (!menuCategoryContainer) return;

    if (categoriesVisible) {
        menuCategoryContainer.style.display = "none";
        arrow.style.transform = "rotate(0deg)";
    } else {
        menuCategoryContainer.style.display = "block";
        arrow.style.transform = "rotate(180deg)";
        loadCategoriesMenu();
    }

    categoriesVisible = !categoriesVisible;
}

function loadCategoriesMenu() {
    let menuCategoryList = document.getElementById("menu-category-list");
    if (menuCategoryList) menuCategoryList.innerHTML = "";
    
    categories.forEach(category => {
        let li = document.createElement("li");
        li.textContent = category;
        menuCategoryList.appendChild(li);
    });
}


function showSection(section) {
    let content = document.getElementById('main-content');
    if (section === 'tasks') {
        content.innerHTML = `
            <h1>To-Do List</h1>
            <div class="input-container">
                <div class="input">
                    <input type="text" id="task-input" placeholder="Add a task...">
                    <select id="category-select"></select>
                </div>
                <button class="add-task" onclick="addTask()">Add</button>
            </div>
            <ul id="task-list"></ul>`;
        loadCategories();
        loadTasks();
    } else if (section === 'categories') {
        content.innerHTML = `
            <h1>Categories</h1>
            <div class="input-container">
                <input type="text" id="category-input" placeholder="Add a category...">
                <button class="add-category" onclick="addCategory()">Add</button>
            </div>
            <ul id="category-list"></ul>`;
        loadCategories();
    } else if (section === 'search') {
        content.innerHTML = `
            <h1>Search Tasks</h1>
            <input type="text" id="search-input" placeholder="Search tasks..." onkeyup="searchTasks()">
            <ul id="search-results"></ul>`;
    } else if (section === 'today') {
        content.innerHTML = `
            <h1>Today's Tasks</h1>
            <ul id="today-task-list"></ul>`;
        loadTodayTasks();
    } else if (section === 'archive') {
        content.innerHTML = `
            <h1>Archived Tasks</h1>
            <ul id="archive-list"></ul>`;
        loadArchivedTasks();
    }
}

function addTask() {
    let taskInput = document.getElementById("task-input");
    let categorySelect = document.getElementById("category-select");
    let taskText = taskInput.value.trim();
    
    if (!taskText) {
        alert("Veuillez entrer une tâche !");
        return;
    }
    
    let category = categorySelect.value;
    if (!category) {
        alert("Veuillez choisir une catégorie !");
        return;
    }

    let newTask = { text: taskText, category: category, completed: false, date: new Date().toISOString().split('T')[0] };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    loadTasks();
}
function addCategory() {
    let categoryInput = document.getElementById("category-input");
    let categoryText = categoryInput.value.trim();
    if (categoryText !== "") {
        categories.push(categoryText);
        saveCategories();
        categoryInput.value = "";
        loadCategories();
    }
}
function deleteCategory(index) {
    categories.splice(index, 1);
    saveCategories();
    loadCategories();
}
function loadTasks() {
    let taskList = document.getElementById("task-list");
    if (taskList) taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        if (task.completed) li.classList.add("completed");
        li.innerHTML = `<span>${task.text} (${task.category})</span>
                        <button id="delete" onclick="deleteTask(${index})"><i class="fa-solid fa-xmark"></i></button>`;
        taskList.appendChild(li);
    });
}
function loadCategories() {
    let categoryList = document.getElementById("category-list");
    let categorySelect = document.getElementById("category-select");
    if (categoryList) categoryList.innerHTML = "";
    if (categorySelect) categorySelect.innerHTML = "";
    categories.forEach((category, index) => {
        if (categoryList) {
            let li = document.createElement("li");
            li.innerHTML = `${category} <button id="delete" onclick="deleteCategory(${index})"><i class="fa-solid fa-xmark"></i></button>`;
            categoryList.appendChild(li);
        }
        if (categorySelect) {
            let option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    });
}

function searchTasks() {
    let searchInput = document.getElementById("search-input").value.toLowerCase();
    let searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";

    tasks.forEach((task) => {
        if (task.text.toLowerCase().includes(searchInput)) {
            let li = document.createElement("li");
            li.textContent = `${task.text} (${task.category})`;
            searchResults.appendChild(li);
        }
    });
}

function loadTodayTasks() {
    let todayList = document.getElementById("today-task-list");
    if (todayList) todayList.innerHTML = "";
    let today = new Date().toISOString().split('T')[0];

    tasks.forEach((task) => {
        if (task.date === today && !task.completed) {
            let li = document.createElement("li");
            li.textContent = `${task.text} (${task.category})`;
            todayList.appendChild(li);
        }
    });
}

function loadArchivedTasks() {
    let archiveList = document.getElementById("archive-list");
    if (archiveList) archiveList.innerHTML = "";

    tasks.forEach((task) => {
        if (task.completed) {
            let li = document.createElement("li");
            li.textContent = `${task.text} (${task.category})`;
            archiveList.appendChild(li);
        }
    });
}
function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }
function saveCategories() { localStorage.setItem("categories", JSON.stringify(categories)); }
function deleteTask(index) { tasks.splice(index, 1); saveTasks(); loadTasks(); }
document.addEventListener("DOMContentLoaded", () => { loadCategories(); loadTasks(); });