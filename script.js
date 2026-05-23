// ---------------- TIMER ----------------

let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");

let totalTime = 0;
let timer;
let isRunning = false;
let originalTime ="";
let currentDisplayedTime = "";
let hoursInput = document.getElementById("hoursInput");
let minutesInput = document.getElementById("minutesInput");
let secondsInput = document.getElementById("secondsInput");
let timeInputs = [
    hoursInput,
    minutesInput,
    secondsInput
];

timeInputs.forEach(input => {

    input.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            setTimerBtn.click();

        }

    });

});
let setTimerBtn = document.getElementById("setTimerBtn");
let quotes = [

    "Small progress is still progress 🚀",

    "Discipline beats motivation 🔥",

    "Focus on consistency, not perfection 📚",

    "Your future self will thank you ✨",

    "One session at a time 💪"

];
let alarmSound = document.getElementById("alarmSound");

window.addEventListener("load", () => {

    let today = new Date().toLocaleDateString();

    let savedDate = localStorage.getItem("sessionDate");

    let sessionCount = localStorage.getItem("todaySessions") || 0;

    if (savedDate !== today) {

        sessionCount = 0;

        localStorage.setItem("sessionDate", today);
    }

    document.getElementById("sessionCount").textContent =
        `Today's Sessions: ${sessionCount}`;

});


function updateTimer() {

    let hours = Math.floor(totalTime / 3600);

    let minutes = Math.floor((totalTime % 3600) / 60);

    let seconds = totalTime % 60;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}
setTimerBtn.addEventListener("click", () => {

    let hrs = parseInt(hoursInput.value) || 0;
    let mins = parseInt(minutesInput.value) || 0;
    let secs = parseInt(secondsInput.value) || 0;

    totalTime = (hrs * 3600) + (mins * 60) + secs;
    originalTime = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    if (totalTime <= 0) {
        alert("Please enter valid time");
        return;
    }

    updateTimer();

});

startBtn.addEventListener("click", () => {

    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {

        if (totalTime <= 0) {

            let completedTime = currentDisplayedTime;

            clearInterval(timer);

            alarmSound.currentTime = 0;
            alarmSound.play();
            saveSessionHistory(completedTime);
            showRandomQuote();

            document.getElementById("completionMessage").textContent =
    "Study Session Completed 🎉";
            

            let today = new Date().toLocaleDateString();

            let savedDate = localStorage.getItem("sessionDate");

            let sessionCount = localStorage.getItem("todaySessions") || 0;

            if (savedDate !== today) {

               sessionCount = 0;

               localStorage.setItem("sessionDate", today);
            }

            sessionCount++;

            localStorage.setItem("todaySessions", sessionCount);

            document.getElementById("sessionCount").textContent =
              `Today's Sessions: ${sessionCount}`;
            

            totalTime = 0;

            updateTimer();

            isRunning = false;

            return;
        }

        totalTime--;
        currentDisplayedTime = timerDisplay.textContent;

        updateTimer();

    }, 1000);

});

resetBtn.addEventListener("click", () => {

    clearInterval(timer);

    totalTime = 0;

    updateTimer();

    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    isRunning = false;

});

updateTimer();


// ---------------- TASK MANAGER ----------------

let taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        let taskText = taskInput.value.trim();

        if (taskText === "") return;

        addTask(taskText);

        saveTasks();

        taskInput.value = "";

    }

});
let addTaskBtn = document.getElementById("addTaskBtn");
let taskList = document.getElementById("taskList");


// Load saved tasks
window.onload = () => {

    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(task => {
        addTask(task);
    });

    loadSessionHistory();

    
};


function saveTasks() {

    let tasks = [];

    document.querySelectorAll("#taskList li span").forEach(task => {
        tasks.push(task.textContent);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask(taskText) {

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let span = document.createElement("span");

    span.textContent = taskText;
    checkbox.addEventListener("change", () => {

    if (checkbox.checked) {
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.6";
    } else {
        span.style.textDecoration = "none";
        span.style.opacity = "1";
    }

    updateProgress();

    });

    let deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {

        li.remove();

        saveTasks();

    });

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(deleteBtn);

    taskList.appendChild(li);

}


addTaskBtn.addEventListener("click", () => {

    let taskText = taskInput.value.trim();

    if (taskText === "") return;

    addTask(taskText);

    saveTasks();

    taskInput.value = "";

});


// ---------------- DARK MODE ----------------

let themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") 
        ? "🌙 Dark Mode" 
        : "☀️ Light Mode";
});
function updateProgress() {

    let totalTasks = document.querySelectorAll("#taskList li").length;

    let completedTasks = document.querySelectorAll(
        '#taskList li input[type="checkbox"]:checked'
    ).length;

    let progress = 0;

    if (totalTasks > 0) {
        progress = (completedTasks / totalTasks) * 100;
    }

    document.getElementById("progressBar").style.width =
        `${progress}%`;

    document.getElementById("progressText").textContent =
        `${Math.round(progress)}% Completed`;
}

function showRandomQuote() {

    let randomIndex = Math.floor(Math.random() * quotes.length);

    document.getElementById("quoteText").textContent =
        quotes[randomIndex];
}

function saveSessionHistory(sessionTime) {

    let history =
        JSON.parse(localStorage.getItem("sessionHistory"))
        || [];

    let currentTime =
        new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

    history.push(
        `✅ ${sessionTime} completed at ${currentTime}`
    );

    localStorage.setItem(
        "sessionHistory",
        JSON.stringify(history)
    );

    loadSessionHistory();

}

function loadSessionHistory() {

    let history =
        JSON.parse(localStorage.getItem("sessionHistory"))
        || [];

    let historyList =
        document.getElementById("sessionHistory");

    historyList.innerHTML = "";

    history.forEach(session => {

        let li = document.createElement("li");

        li.textContent = session;

        historyList.appendChild(li);

    });

}
