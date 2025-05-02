import React from 'react'
import Task from '../Task/Task'
import PropTypes from 'prop-types'
import './taskList.css'

export default class TaskList extends React.Component {
  state = {
    editingId: null,
    editValue: '',
  }

  handleEditClick = (id, currentLabel) => {
    this.setState({
      editingId: id,
      editValue: currentLabel,
    })
  }

  handleEditSubmit = (id) => {
    if (this.state.editValue.trim()) {
      this.props.handleEdit(id, this.state.editValue)
    }
    this.setState({ editingId: null })
  }

  handleInputChange = (e) => {
    this.setState({ editValue: e.target.value })
  }

  handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      this.handleEditSubmit(id)
    } else if (e.key === 'Escape') {
      this.setState({ editingId: null })
    }
  }

  render() {
    const { todos, onDeleted, onToggleDone, handleEdit, onPlay, onPause } = this.props
    const { editingId, editValue } = this.state

    return (
      <ul className="todo-list">
        {todos.map((item) => (
          <li key={item.id} className={`${item.done ? 'completed' : ''} ${editingId === item.id ? 'editing' : ''}`}>
            {editingId === item.id ? (
              <input
                type="text"
                className="edit"
                value={editValue}
                onChange={this.handleInputChange}
                onBlur={() => this.handleEditSubmit(item.id)}
                onKeyDown={(e) => this.handleKeyDown(e, item.id)}
                autoFocus
              />
            ) : (
              <Task
                key={item.id}
                {...item}
                onPlay={() => onPlay(item.id)}
                onPause={() => onPause(item.id)}
                onDelete={() => onDeleted(item.id)}
                onEdit={() => this.handleEditClick(item.id, item.label)}
                onCompleted={() => onToggleDone(item.id)}
              />
            )}
          </li>
        ))}
      </ul>
    )
  }
}

TaskList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onDeleted: PropTypes.func.isRequired,
  onToggleDone: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
}

TaskList.defaultProps = {
  todos: [],
}
