function addTask() {
  const task = document.getElementById('taskInput').value.trim();
  const reminderInput = document.getElementById('reminderTime').value;
  const mood = document.getElementById('moodSelect').value;

  if (!task || !reminderInput) {
    alert("Please enter a task and reminder time.");
    return;
  }

  const reminderDate = new Date(reminderInput);
  const now = new Date();
  const delay = reminderDate - now;

  if (isNaN(reminderDate) || delay <= 0) {
    alert("Please select a future date and time.");
    return;
  }

  const timestamp = now.toLocaleString();
  const taskObj = {
    task,
    mood,
    reminder: reminderDate.toISOString(),
    created: timestamp
  };

  const tasks = JSON.parse(localStorage.getItem('currentTasks') || '[]');
  tasks.push(taskObj);
  localStorage.setItem('currentTasks', JSON.stringify(tasks));

  const history = JSON.parse(localStorage.getItem('taskHistory') || '[]');
  history.push(taskObj);
  localStorage.setItem('taskHistory', JSON.stringify(history));

  renderTasks();
  loadHistory();
  scheduleReminder(taskObj);

  document.getElementById('taskInput').value = '';
  document.getElementById('reminderTime').value = '';
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('currentTasks') || '[]');
  tasks.forEach(taskObj => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="title">${taskObj.task}</span> - ${taskObj.mood}<br><span class="time">Reminder at: ${new Date(taskObj.reminder).toLocaleString()}</span>`;
    taskList.appendChild(li);
  });
}

function loadHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('taskHistory') || '[]');
  history.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="title">${item.task}</div>
      <div>Mood: ${item.mood}</div>
      <div class="time">Set for: ${new Date(item.reminder).toLocaleString()}</div>
      <div class="time">Added: ${item.created}</div>`;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem('taskHistory');
  loadHistory();
}

function scheduleAllReminders() {
  const tasks = JSON.parse(localStorage.getItem('currentTasks') || '[]');
  const now = new Date();
  const futureTasks = [];

  tasks.forEach(taskObj => {
    const reminderTime = new Date(taskObj.reminder);
    const delay = reminderTime - now;
    if (delay > 0) {
      scheduleReminder(taskObj);
      futureTasks.push(taskObj);
    }
  });

  localStorage.setItem('currentTasks', JSON.stringify(futureTasks));
}

function scheduleReminder(taskObj) {
  const delay = new Date(taskObj.reminder) - new Date();
  if (delay > 0) {
    setTimeout(() => {
      document.getElementById('alarmSound').play();
      alert(`Reminder: ${taskObj.task} (${taskObj.mood})`);
    }, delay);
  }
}

window.onload = () => {
  renderTasks();
  loadHistory();
  scheduleAllReminders();
};
