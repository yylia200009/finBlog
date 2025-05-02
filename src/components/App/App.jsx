import React from 'react'
import NewTaskForm from '../NewTaskForm/NewTaskForm'
import TaskList from '../TaskList/TaskList'
import Footer from '../Footer/Footer'
import './app.css'

export default class App extends React.Component {
  maxId = 4

  state = {
    todos: [
      {
        label: 'Task 1',
        done: false,
        id: 1,
        timer: {
          minutes: 5,
          seconds: 0,
          isRunning: false,
        },
      },
    ],
    filter: 'All',
  }

  startTimer = (id) => {
    if (this.timers && this.timers[id]) {
      clearInterval(this.timers[id])
    }

    if (!this.timers) {
      this.timers = {}
    }

    this.timers[id] = setInterval(() => {
      this.setState((prevState) => {
        const updatedTodos = prevState.todos.map((task) => {
          if (task.id === id && task.timer.isRunning) {
            let { minutes, seconds } = task.timer

            if (seconds === 0) {
              if (minutes === 0) {
                clearInterval(this.timers[id])
                return {
                  ...task,
                  timer: {
                    ...task.timer,
                    isRunning: false,
                  },
                }
              }
              minutes--
              seconds = 59
            } else {
              seconds--
            }

            return {
              ...task,
              timer: {
                minutes,
                seconds,
                isRunning: true,
              },
            }
          }
          return task
        })

        return { todos: updatedTodos }
      })
    }, 1000)
  }

  handlePlay = (id) => {
    this.setState(
      (prev) => ({
        todos: prev.todos.map((task) =>
          task.id === id
            ? {
                ...task,
                timer: {
                  ...task.timer,
                  isRunning: true,
                },
              }
            : task
        ),
      }),
      () => {
        this.startTimer(id)
      }
    )
  }

  handlePause = (id) => {
    this.setState((prev) => ({
      todos: prev.todos.map((task) =>
        task.id === id
          ? {
              ...task,
              timer: {
                ...task.timer,
                isRunning: false,
              },
            }
          : task
      ),
    }))
  }

  createTask = (label, min = 0, sec = 0) => {
    return {
      label,
      done: false,
      id: this.maxId++,
      min: Number(min),
      sec: Number(sec),
      timer: {
        minutes: Number(min),
        seconds: Number(sec),
        isRunning: false,
      },
    }
  }
  componentWillUnmount() {
    Object.values(this.timers).forEach((timer) => clearInterval(timer))
  }
  changeTask = (id, newLabel) => {
    this.setState(({ todos }) => ({
      todos: todos.map((todo) => (todo.id === id ? { ...todo, label: newLabel } : todo)),
    }))
  }

  toggleDone = (id) => {
    this.setState(({ todos }) => ({
      todos: todos.map((todo) => {
        if (todo.id === id) {
          if (this.timers && this.timers[id]) {
            clearInterval(this.timers[id])
            delete this.timers[id]
          }

          return {
            ...todo,
            done: !todo.done,
            timer: todo.done
              ? todo.timer
              : {
                  minutes: 0,
                  seconds: 0,
                  isRunning: false,
                },
          }
        }
        return todo
      }),
    }))
  }
  deleteItem = (id) => {
    this.setState(({ todos }) => ({
      todos: todos.filter((todo) => todo.id !== id),
    }))
  }

  handleFilterClick = (selectedFilter) => {
    this.setState({ filter: selectedFilter })
  }

  clearCompleted = () => {
    this.setState(({ todos }) => ({
      todos: todos.filter((todo) => !todo.done),
    }))
  }
  doneCount = () => {
    return this.state.todos.filter((el) => !el.done).length
  }

  addTask = (text, min, sec) => {
    const newItem = this.createTask(text, min, sec)
    this.setState(({ todos }) => {
      const newArr = [...todos, newItem]

      return { todos: newArr }
    })
  }

  onCompleted = (id) => {
    this.setState(({ todos }) => {
      if (this.timers && this.timers[id]) {
        clearInterval(this.timers[id])
        delete this.timers[id]
      }

      const idx = todos.findIndex((el) => el.id === id)
      const oldItem = todos[idx]

      const newItem = {
        ...oldItem,
        done: !oldItem.done,
        timer: {
          minutes: 0,
          seconds: 0,
          isRunning: false,
        },
      }

      return {
        todos: [...todos.slice(0, idx), newItem, ...todos.slice(idx + 1)],
      }
    })
  }

  handleFilterChange = (filter) => {
    this.setState({ filter })
  }
  getFilteredTodos() {
    const { todos, filter } = this.state
    if (filter === 'All') return todos
    return todos.filter((task) => (filter === 'Active' ? !task.done : task.done))
  }

  updateTimer = (id, timerData) => {
    this.setState((prev) => ({
      todos: prev.todos.map((task) => (task.id === id ? { ...task, timer: timerData } : task)),
    }))
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state.todos !== nextState.todos || this.state.filter !== nextState.filter
  }

  render() {
    const { filter } = this.state
    const filteredTodos = this.getFilteredTodos()

    const todoFilter = [
      { filter: 'All', selected: filter === 'All', id: 1 },
      { filter: 'Active', selected: filter === 'Active', id: 2 },
      { filter: 'Completed', selected: filter === 'Completed', id: 3 },
    ]

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm onItemAdded={this.addTask} />
        </header>
        <section className="main">
          <TaskList
            todos={filteredTodos}
            onToggleDone={this.toggleDone}
            onDeleted={this.deleteItem}
            handleEdit={this.changeTask}
            onPlay={this.handlePlay}
            onPause={this.handlePause}
          />

          <Footer
            filters={todoFilter}
            onFilterClick={this.handleFilterClick}
            onClearCompleted={this.clearCompleted}
            doneCount={this.doneCount}
          />
        </section>
      </section>
    )
  }
}
