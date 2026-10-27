const assert = require('node:assert/strict');
const { beforeEach, test } = require('node:test');
const {
  addTask,
  deleteTask,
  filterTasks,
  getAllTasks,
  getCounts,
  toggleTask,
} = require('../public/app.js');

const storage = new Map();
global.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(key, String(value));
  },
  clear() {
    storage.clear();
  },
};

beforeEach(() => {
  localStorage.clear();
});

test('adds a task with trimmed title and description', () => {
  const task = addTask('  Study  ', '  Chapter 1  ');

  assert.equal(task.title, 'Study');
  assert.equal(task.description, 'Chapter 1');
  assert.equal(task.completed, false);
  assert.equal(getAllTasks().length, 1);
});

test('rejects an empty task title', () => {
  assert.throws(() => addTask('   '), /Task title is required/);
});

test('toggles and deletes a task', () => {
  const task = addTask('Study');

  assert.equal(toggleTask(task.id).completed, true);
  deleteTask(task.id);
  assert.deepEqual(getAllTasks(), []);
});

test('filters tasks and reports counts', () => {
  const pending = addTask('Read');
  const completed = addTask('Write');
  toggleTask(completed.id);

  assert.deepEqual(filterTasks('pending').map(task => task.id), [pending.id]);
  assert.deepEqual(filterTasks('completed').map(task => task.id), [completed.id]);
  assert.deepEqual(getCounts(), { total: 2, pending: 1, completed: 1 });
});
