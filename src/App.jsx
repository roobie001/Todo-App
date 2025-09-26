import React, { useEffect, useState } from "react";
import "./index.css";
import Illustrations from "./components/Illustrations";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [sortBy, setSortBy] = useState("default");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const todosNum = todos.length;
  const todosCompleted = todos.filter((todo) => todo.completed).length;

  //sorting
  const sortedTodo = [...todos].sort((a, b) => {
    if (sortBy === "completed") return b.completed - a.completed;

    if (sortBy === "pending") return a.completed - b.completed;

    if (sortBy === "a-z") return a.task.localeCompare(b.task);

    if (sortBy === "z-a") return b.task.localeCompare(a.task);

    return 0; //no sorting
  });

  //addtodo
  function handleAddTodos(todo) {
    setTodos((todos) => [...todos, todo]);
  }

  //Toggle
  function handleToggleCompleted(id) {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  //edit

  function handleEditTodo(todo) {
    setEditingId(todo.id);
    setEditingText(todo.task);
  }

  function handleSaveEdit(id) {
    if (!editingText.trim()) return;

    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, task: editingText } : todo
      )
    );

    setEditingId(null);
    setEditingText("");
  }

  //cancel edit
  function handleCancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  //Delete
  function handleDeleteTodo(id) {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="app">
      <Nav setSortBy={setSortBy} />
      <main className="content">
        <div className="app-container">
          <div className="illustration">
            <Illustrations />
          </div>
          <div className="main-app">
            <Main todosNum={todosNum} todosCompleted={todosCompleted} />
            <AddTask onAddTodos={handleAddTodos} />
            <TodoList
              // todos={todos}
              todos={sortedTodo}
              onToggleCompleted={handleToggleCompleted}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              editingId={editingId}
              editingText={editingText}
              setEditingText={setEditingText}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Nav({ setSortBy }) {
  return (
    <div className="nav">
      <h2 className="nav-title">
        <span>something</span>TODO
      </h2>

      <div className="filter">
        <ion-icon
          className="todo-icon"
          name="funnel-outline"
          // onClick={() => setShowDropdown((prev) => !prev)}
        ></ion-icon>

        <div className="dropdown-wrapper">
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="dropdown"
          >
            <option value="default">Default</option>
            <option value="completed">Completed First</option>
            <option value="pending">Pending First</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Main({ todosNum, todosCompleted }) {
  return (
    <div className="main">
      <div className="progress-container">
        <div className="progress-text">
          <h1>
            {todosNum == 0
              ? "Start Adding Tasks!"
              : todosCompleted !== todosNum
              ? "Tasks Completed →"
              : "Tasks Done!"}
          </h1>
          <p>
            {todosNum === 0
              ? ""
              : todosCompleted !== todosNum && "keep going !"}
          </p>
        </div>
        <div
          className={`progress-status ${
            todosNum === 0
              ? ""
              : todosCompleted === todosNum
              ? "progress-completed"
              : ""
          }`}
        >
          {todosNum === 0 ? "0" : `${todosCompleted} / ${todosNum}`}
        </div>
      </div>
    </div>
  );
}

function AddTask({ onAddTodos }) {
  const [task, setTask] = useState("");

  function handleSubmitTask(e) {
    e.preventDefault();

    if (!task) return;

    const newTodo = { task, id: crypto.randomUUID(), completed: false };

    onAddTodos(newTodo);

    setTask("");
  }

  return (
    <form onSubmit={handleSubmitTask} className="add-task">
      <input
        type="text"
        placeholder="what is the task today"
        className="task-input btn--outline"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button className="btn">add task</button>
    </form>
  );
}

function TodoList({
  todos,
  onToggleCompleted,
  onDeleteTodo,
  onEditTodo,
  onSaveEdit,
  onCancelEdit,
  editingId,
  editingText,
  setEditingText,
}) {
  return (
    <section className="todo-list-container">
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            className={`todo ${todo.completed ? "todo-completed" : ""}`}
            key={todo.id}
          >
            <div className="list-text">
              <input
                className="checkbox"
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleCompleted(todo.id)}
              />
              {editingId === todo.id ? (
                <input
                  className="edit-input btn--outline"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => onSaveEdit(todo.id)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" && onSaveEdit(todo.id)) ||
                    (e.key === "Escape" && onCancelEdit())
                  }
                  autoFocus
                />
              ) : (
                <span className="todo-text">{todo.task}</span>
              )}
            </div>

            <div className="list-logo">
              <ion-icon
                className="todo-icon"
                name="create-outline"
                onClick={() => onEditTodo(todo)}
              ></ion-icon>
              <ion-icon
                className="todo-icon"
                name="trash-outline"
                onClick={() => onDeleteTodo(todo.id)}
              ></ion-icon>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
