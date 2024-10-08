import React, { useEffect, useState } from "react"

import styles from "./TodoList.module.css" // Импортируем CSS Module

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [search, setSearch] = useState("")
  const [isSorted, setIsSorted] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingTodoTitle, setEditingTodoTitle] = useState("")

  const fetchTodos = () => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data))
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = () => {
    if (newTodo) {
      fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      })
        .then((response) => response.json())
        .then(() => {
          setNewTodo("")
          fetchTodos()
        })
    }
  }

  const deleteTodo = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    }).then(() => fetchTodos())
  }

  const startEditing = (todo) => {
    setEditingTodoId(todo.id)
    setEditingTodoTitle(todo.title)
  }

  const updateTodo = () => {
    if (editingTodoTitle) {
      fetch(`http://localhost:3000/todos/${editingTodoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingTodoTitle }),
      }).then(() => {
        setEditingTodoId(null)
        setEditingTodoTitle("")
        fetchTodos()
      })
    }
  }

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  )

  const sortedTodos = isSorted
    ? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
    : filteredTodos

  return (
    <div className={styles.todoListContainer}>
      <h1 className={styles.title}>Список Дел</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Добавить новое дело"
          className={styles.inputField}
        />
        <button onClick={addTodo} className={styles.button}>
          Добавить
        </button>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск дел"
        className={styles.inputField}
      />
      <button onClick={() => setIsSorted(!isSorted)} className={styles.button}>
        {isSorted ? "Отменить сортировку" : "Сортировать по алфавиту"}
      </button>
      <ul>
        {sortedTodos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            {editingTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingTodoTitle}
                  onChange={(e) => setEditingTodoTitle(e.target.value)}
                  className={styles.inputField}
                />
                <button onClick={updateTodo} className={styles.button}>
                  Обновить
                </button>
                <button
                  onClick={() => setEditingTodoId(null)}
                  className={styles.button}
                >
                  Отменить
                </button>
              </>
            ) : (
              <>
                {todo.title}
                <button
                  onClick={() => startEditing(todo)}
                  className={styles.button}
                >
                  Изменить
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
