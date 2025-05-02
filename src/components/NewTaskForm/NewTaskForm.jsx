import React from 'react'
import './newTaskForm.css'
import PropTypes from 'prop-types'

export default class NewTaskForm extends React.Component {
  state = {
    label: '',
    min: '',
    sec: '',
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { label, min, sec } = this.state
    const trimmedLabel = label.trim()

    if (!trimmedLabel) return

    this.props.onItemAdded(trimmedLabel, Math.min(59, parseInt(min, 10) || 0), Math.min(59, parseInt(sec, 10) || 0))
    this.setState({ label: '', min: '', sec: '' })
  }

  render() {
    return (
      <form action="" onSubmit={this.handleSubmit} className="wrapNew">
        <input
          type="text"
          className="new-todo"
          placeholder="Task"
          autoFocus
          name="label"
          onChange={this.handleInputChange}
          value={this.state.label}
        />
        <input
          type="number"
          className="new-todo-form__timer"
          placeholder="Min"
          name="min"
          min="0"
          max="59"
          onChange={this.handleInputChange}
          value={this.state.min}
        />
        <input
          type="number"
          className="new-todo-form__timer"
          name="sec"
          placeholder="Sec"
          onChange={this.handleInputChange}
          value={this.state.sec}
          min="0"
          max="59"
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>
    )
  }
}
NewTaskForm.propTypes = {
  onItemAdded: PropTypes.func.isRequired,
}
