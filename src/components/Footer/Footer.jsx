import React from 'react'
import TasksFilter from '../TasksFilter/TasksFilter'
import PropTypes from 'prop-types'
import './footer.css'

export default class Footer extends React.Component {
  render() {
    const { filters, onFilterClick, doneCount, onClearCompleted } = this.props

    const elemFilters = filters.map((item) => {
      return (
        <TasksFilter
          key={item.id}
          filter={item.filter}
          selected={item.selected}
          onFilter={() => onFilterClick(item.filter)}
        />
      )
    })

    return (
      <footer className="footer">
        <span className="todo-count">{doneCount()} items left</span>
        <ul className="filters">{elemFilters}</ul>
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      </footer>
    )
  }
}

Footer.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      filter: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onFilterClick: PropTypes.func.isRequired,
  doneCount: PropTypes.func.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
}
