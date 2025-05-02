import React from 'react'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import Timer from '../Timer/Timer'
import './task.css'

export default class Task extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createdAt: new Date(),
      date: formatDistanceToNow(new Date(), { includeSeconds: true }),
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      console.log(this.state.date)
      this.setState({
        date: formatDistanceToNow(this.state.createdAt, { includeSeconds: true }),
      })
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { label, id, timer, onDelete, onCompleted, done, onEdit } = this.props
    const { minutes, seconds, isRunning } = timer
    const { date } = this.state

    return (
      <div className="view">
        <input className="toggle" type="checkbox" checked={done} onChange={onCompleted} />
        <label>
          <span className="title"> {label}</span>

          <Timer
            id={id}
            minutes={minutes}
            seconds={seconds}
            isRunning={isRunning}
            onPlay={this.props.onPlay}
            onPause={this.props.onPause}
          />
          <span className="created">created {date} ago</span>
        </label>
        <button className="icon icon-edit" onClick={onEdit} />
        <button className="icon icon-destroy" onClick={onDelete} />
      </div>
    )
  }
}

Task.propTypes = {
  label: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
  timer: PropTypes.shape({
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    isRunning: PropTypes.bool.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
}

Task.defaultProps = {
  timer: {
    minutes: 0,
    seconds: 0,
    isRunning: false,
  },
}
