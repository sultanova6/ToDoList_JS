// выбираем элементы
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');
const currDate = document.getElementById('dataTime');

// переменные
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// 1
renderTodos();

// добавление
form.addEventListener('submit', function(event) {
    event.preventDefault();

    saveTodo();
    renderTodos();
    // сохраним состояние листа
    localStorage.setItem('todos', JSON.stringify(todos));
});

// сохранение
function saveTodo() {
    const todoValue = todoInput.value;

    // проверка на пустую строку
    const isEmpty = todoValue === '';
    // проверка на повторы
    const isDubl = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

    if(isEmpty) {
        showNotification("The case is empty, fill in the line!");
    } else if (isDubl) {
        showNotification("Such a case already exists, rewrite it!");
    } else {
        if(EditTodoId >= 0) {
            // обновляем измененное
            todos = todos.map((todo, index) => ({
                    ...todo,
                    value : index === EditTodoId ? todoValue : todo.value,
            }));
            EditTodoId = -1;
        } else {
            todos.push ({
                value : todoValue,
                checked : false,
            });
        }
        todoInput.value = '';
    }
}

// обработка
function renderTodos() {
    if(todos.length === 0) {
        todosListEl.innerHTML = '<center>No Todos!</span></center>';
        return;
    }
    todosListEl.innerHTML = "";

    todos.forEach((todo, index) => {
        todosListEl.innerHTML += `
        <div class="todo" id=${index}>
            <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
            // style="color : ${todo.color}"
            data-action="check"
            ></i>
            <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
            <i class="bi bi-pen" data-action="edit"></i>
            <i class="bi bi-trash2" data-action="delete"></i>
        </div>
        `;
    });
}

// контроль события каждого дела
todosListEl.addEventListener('click', (event) => {
    const target = event.target;
    const parentEl = target.parentNode;

    if(parentEl.className !== 'todo') return;

    // todo id
    const todo = parentEl;
    const todoId = Number(todo.id);

    // цель действия
    const action = target.dataset.action;
    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);

    console.log(todoId, action);
});

// check
function checkTodo(todoId) {
    todos = todos.map((todo, index) => ({
        ...todo,
        checked : index === todoId ? !todo.checked : todo.checked
    }));

    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
};

// edit
function editTodo(todoId) {
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;
}

// delete
function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    EditTodoId = -1;

    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

// уведомления об ошибках
function showNotification(msg) {
    // изменение уедомления
    notificationEl.innerHTML = msg;

    // нажатие на уведомление
    notificationEl.classList.add('notif-enter');

    // убрать уведомление через 2 секунды
    setTimeout(() =>{
        notificationEl.classList.remove('notif-enter');
    }, 2000);
}

window.onload = function() {
    var date = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateString = date.toLocaleDateString('en-US', options);
    var dateElement = document.querySelector('.date');
    dateElement.textContent = dateString;
  }
