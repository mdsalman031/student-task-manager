/*
  app.js – Core task management logic for Student Task Manager
  Works both in the browser (UI) and in Node.js (unit tests).
  Tasks are persisted in browser localStorage under the key "stm_tasks".
*/

// ---------- Utility ----------
const STORAGE_KEY = 'stm_tasks';

// Load tasks from storage (returns array)
function loadTasks() {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save tasks array to storage
function saveTasks(tasks) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Generate a simple unique id (timestamp + random)
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

// ---------- Core Operations ----------
function addTask(title, description = '') {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Task title is required');
  }
  const tasks = loadTasks();
  const newTask = {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

function deleteTask(id) {
  let tasks = loadTasks();
  const originalLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === originalLength) {
    throw new Error('Task not found');
  }
  saveTasks(tasks);
}

function toggleTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) throw new Error('Task not found');
  task.completed = !task.completed;
  saveTasks(tasks);
  return task;
}

function filterTasks(filter) {
  const tasks = loadTasks();
  switch (filter) {
    case 'all':
      return tasks;
    case 'pending':
      return tasks.filter(t => !t.completed);
    case 'completed':
      return tasks.filter(t => t.completed);
    default:
      throw new Error('Invalid filter');
  }
}

function getCounts() {
  const tasks = loadTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  return { total, pending, completed };
}

// ---------- UI Rendering (browser only) ----------
function render() {
  if (typeof document === 'undefined') return; // not in browser
  const taskListEl = document.getElementById('taskList');
  const { total, pending, completed } = getCounts();
  document.getElementById('totalCount').textContent = `Total: ${total}`;
  document.getElementById('pendingCount').textContent = `Pending: ${pending}`;
  document.getElementById('completedCount').textContent = `Completed: ${completed}`;
  // Clear list
  taskListEl.innerHTML = '';
  const currentFilter = document.querySelector('.filter.active')?.dataset.filter || 'all';
  const tasksToShow = filterTasks(currentFilter);
  tasksToShow.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;
    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = task.title;
    li.appendChild(titleSpan);
    if (task.description) {
      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = task.description;
      li.appendChild(description);
    }
    // Complete toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
    toggleBtn.setAttribute('aria-label', task.completed ? `Mark ${task.title} pending` : `Mark ${task.title} completed`);
    toggleBtn.addEventListener('click', () => {
      toggleTask(task.id);
      render();
    });
    li.appendChild(toggleBtn);
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.className = 'delete';
    delBtn.setAttribute('aria-label', `Delete ${task.title}`);
    delBtn.addEventListener('click', () => {
      deleteTask(task.id);
      render();
    });
    li.appendChild(delBtn);
    taskListEl.appendChild(li);
  });
}

// ---------- Event Listeners (browser) ----------
function bindUI() {
  if (typeof document === 'undefined') return;
  const taskForm = document.getElementById('taskForm');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const message = document.getElementById('message');
  taskForm.addEventListener('submit', event => {
    event.preventDefault();
    try {
      addTask(titleInput.value, descInput.value);
      titleInput.value = '';
      descInput.value = '';
      message.textContent = 'Task added.';
      message.className = 'message success';
      render();
    } catch (e) {
      message.textContent = e.message;
      message.className = 'message error';
    }
  });
  // Filter buttons
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      render();
    });
  });
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    render();
  });
}

// ---------- Export for Node.js tests ----------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addTask,
    deleteTask,
    toggleTask,
    filterTasks,
    getCounts,
    getAllTasks: loadTasks,
    _resetStorage: () => { if (typeof localStorage !== 'undefined') localStorage.clear(); },
  };
}
