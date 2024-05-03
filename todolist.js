// let todos = [];

let filterValue = "all";
const inputForm = document.querySelector(".todo-input");
const submitForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");
const modalForms = document.querySelector(".modal-forms");

modalClose.addEventListener("click", (e) => {
  modalOverlay.style.display = "none";
});

window.onclick = function (e) {
  if (e.target == modalOverlay) {
    modalOverlay.style.display = "none";
  }
};
submitForm.addEventListener("submit", addToDos);
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getToDos();
  createTodos(todos);
});

function addToDos(e) {
  e.preventDefault();

  if (!inputForm.value) return null;
  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: inputForm.value,
    isCompleted: false,
  };
  saveToDos(newTodo);
  filterTodos();
}

function createTodos(todos) {
  //create todos on Dom

  let resualt = "";
  todos.forEach((todo) => {
    resualt += `<li class="todo">
    <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
    <span class="todo__createdAt">${new Date(todo.createAt).toLocaleTimeString(
      "fa-IR"
    )}</span>
    <button class="todo__check ${
      todo.isCompleted && "completed"
    }" data-todo-id=${todo.id}><i class="far fa-check-square"></i></button>
    <button class="todo__remove" data-todo-id=${
      todo.id
    }><i class="far fa-trash-alt"></i></button>
    <button class="todo__edit" data-todo-id=${
      todo.id
    }><i class="fa fa-edit"></i></button>
  </li> `;
  });

  todoList.innerHTML = resualt;
  inputForm.value = "";
  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", deletTodos));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkToDos));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodos));
}

selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

function filterTodos() {
  let todos = getToDos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredToDos = todos.filter((t) => t.isCompleted);
      createTodos(filteredToDos);
      break;
    }
    case "uncompleted": {
      const filteredToDos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredToDos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function deletTodos(e) {
  let todos = getToDos();
  const deletedtodoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== deletedtodoId);
  savedAllTodos(todos);
  filterTodos();
}

function checkToDos(e) {
  let todos = getToDos();
  const checkToDoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === checkToDoId);
  todo.isCompleted = !todo.isCompleted;
  savedAllTodos(todos);
  filterTodos();
}

function editTodos(e) {
  let todos = getToDos();
  modalOverlay.style.display = "flex";
  const checkToDoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === checkToDoId);
  let resualt = "";
  resualt += `<form class="todo-edit-form">
  <input type="text" value=${todo.title} name="" class="edit-input" />
  <button class="edit-todo" type="submit">
    <i class="fas fa-edit"></i>
  </button>
</form>`;
  modalForms.innerHTML = resualt;
  const submitEditForm = document.querySelector(".todo-edit-form");
  submitEditForm.addEventListener("submit", editTodosInput);
  function editTodosInput(e) {
    e.preventDefault();
    const editInput = document.querySelector(".edit-input").value;
    todo.title = editInput;
    savedAllTodos(todos);
    filterTodos();
    modalOverlay.style.display = "none";  
  }
}

function getToDos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveToDos(todo) {
  const savedtodos = getToDos();
  savedtodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedtodos));

  return saveToDos;
}

function savedAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
