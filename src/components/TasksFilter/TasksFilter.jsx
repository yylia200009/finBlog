import React from 'react'
import PropTypes from 'prop-types'
import './tasksFilter.css'

export default class TasksFilter extends React.Component {
  render() {
    const { filter, selected, onFilter } = this.props

    return (
      <li>
        <button className={selected ? 'selected' : null} onClick={onFilter}>
          {filter}
        </button>
      </li>
    )
  }
}

TasksFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onFilter: PropTypes.func.isRequired,
}
