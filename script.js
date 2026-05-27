const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');

let todos = [];

function updateStats() {
  const remaining = todos.filter(item => !item.completed).length;
  remainingCount.textContent = remaining;
}

function saveTodos() {
  localStorage.setItem('todoItems', JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem('todoItems');
  if (!stored) return;
  try {
    todos = JSON.parse(stored);
  } catch (error) {
    todos = [];
  }
}

function renderTodos() {
  list.innerHTML = '';

  if (todos.length === 0) {
    const emptyItem = document.createElement('p');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'Your todo list is empty. Add something to get started!';
    list.appendChild(emptyItem);
    updateStats();
    return;
  }

  todos.forEach((todo, index) => {
    const item = document.createElement('li');
    item.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const label = document.createElement('p');
    label.className = 'todo-text' + (todo.completed ? ' completed' : '');
    label.textContent = todo.text;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.textContent = '✕';
    removeButton.title = 'Remove task';
    removeButton.addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, label, removeButton);
    list.appendChild(item);
  });

  updateStats();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;

  todos.push({ text, completed: false });
  input.value = '';
  saveTodos();
  renderTodos();
});

loadTodos();
renderTodos();
