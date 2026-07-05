// In-memory task store. Swap for a real DB later.
const tasks = [];
let nextId = 1;

function addTask(title, owner) {
  const task = { id: nextId++, title, owner, done: false };
  tasks.push(task);
  return task;
}

module.exports = { tasks, addTask };
