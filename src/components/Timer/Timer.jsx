import React from 'react'
import PropTypes from 'prop-types'
// import timerManager from '../timerManager/timerManager'

export default class Timer extends React.Component {
  componentDidMount() {
    if (this.props.isRunning) {
      this.props.onPlay(this.props.id)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isRunning !== this.props.isRunning) {
      if (this.props.isRunning) {
        this.props.onPlay(this.props.id)
      } else {
        this.props.onPause(this.props.id)
      }
    }
  }

  // componentWillUnmount() {
  //   this.stopTimer()
  // }

  // startTimer = () => {
  //   const { id, minutes, seconds, onTimeUpdate } = this.props
  //   const mins = parseInt(minutes) || 0
  //   const secs = parseInt(seconds) || 0

  //   timerManager.start(id, mins, secs, (newTime) => onTimeUpdate(id, newTime))
  // }

  // stopTimer = () => {
  //   timerManager.stop(this.props.id)
  // }

  // handlePlay = () => {
  //   if (typeof this.props.onPlay === 'function') {
  //     this.props.onPlay(this.props.id)
  //   } else {
  //     console.error('onPlay is not a function!', this.props)
  //   }
  // }

  // handlePause = () => {
  //   if (typeof this.props.onPause === 'function') {
  //     this.props.onPause(this.props.id)
  //   }
  // }

  formatTime = (value) => {
    const num = parseInt(value) || 0
    return num < 10 ? `0${num}` : num
  }

  render() {
    const { minutes, seconds, isRunning, onPlay, onPause } = this.props
    return (
      <span className="description">
        <button
          className="icon icon-play"
          onClick={() => onPlay(this.props.id)}
          aria-label="play"
          disabled={isRunning}
        />
        <button
          className="icon icon-pause"
          onClick={() => onPause(this.props.id)}
          aria-label="pause"
          disabled={!isRunning}
        />
        <span className="timer">
          {this.formatTime(minutes)}:{this.formatTime(seconds)}
        </span>
      </span>
    )
  }
}

Timer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
}
// import React from 'react'
// import PropTypes from 'prop-types'

// export default class Timer extends React.Component {
//   constructor(props) {
//     super(props)
//     const timerData = props.timer || {
//       currentMin: props.min,
//       currentSec: props.sec,
//       isRunning: false,
//     }
//     this.state = {
//       minutes: timerData.currentMin,
//       seconds: timerData.currentSec,
//       isRunning: timerData.isRunning,
//     }
//     this.timerId = null
//   }

//   componentDidMount() {
//     if (this.state.isRunning) {
//       this.startTimer()
//     }
//   }
//   componentDidUpdate(prevProps) {
//     // Безопасное сравнение с проверкой существования timer
//     const currentTimer = this.props.timer || {
//       currentMin: this.props.min,
//       currentSec: this.props.sec,
//     }
//     const prevTimer = prevProps.timer || {
//       currentMin: prevProps.min,
//       currentSec: prevProps.sec,
//     }

//     if (
//       (prevTimer.currentMin !== currentTimer.currentMin || prevTimer.currentSec !== currentTimer.currentSec) &&
//       !this.state.isRunning
//     ) {
//       this.setState({
//         minutes: currentTimer.currentMin,
//         seconds: currentTimer.currentSec,
//       })
//     }
//   }

//   componentWillUnmount() {
//     this.clearTimer()
//   }

//   clearTimer() {
//     if (this.timerId) {
//       clearInterval(this.timerId)
//       this.timerId = null
//     }
//   }

//   calculateNewTime = (prevState) => {
//     if (prevState.seconds === 0 && prevState.minutes === 0) {
//       this.clearTimer()
//       return {
//         minutes: this.props.min,
//         seconds: this.props.sec,
//         isRunning: false,
//       }
//     }

//     if (prevState.seconds === 0) {
//       return {
//         minutes: prevState.minutes - 1,
//         seconds: 59,
//         isRunning: true,
//       }
//     }

//     return {
//       seconds: prevState.seconds - 1,
//       minutes: prevState.minutes,
//       isRunning: true,
//     }
//   }

//   tick = () => {
//     const { id, onTimerUpdate } = this.props

//     this.setState((prev) => {
//       const newTime = this.calculateNewTime(prev)
//       onTimerUpdate(id, newTime) // Обновляем состояние в родителе
//       return newTime
//     })
//   }

//   onPlay = () => {
//     if (!this.state.isRunning) {
//       this.timerId = setInterval(this.tick, 1000)
//       this.setState({ isRunning: true })
//     }
//   }

//   onPause = () => {
//     clearInterval(this.timerId)
//     this.setState({ isRunning: false })
//   }

//   formatTime(value) {
//     value = Math.max(0, value)
//     return value < 10 ? `0${value}` : value
//   }

//   render() {
//     const { minutes, seconds } = this.state

//     return (
//       <span className="description">
//         <button className="icon icon-play" onClick={this.onPlay} aria-label="play" />
//         <button className="icon icon-pause" onClick={this.onPause} aria-label="pause" />
//         <span className="timer">
//           {this.formatTime(minutes)}:{this.formatTime(seconds)}
//         </span>
//       </span>
//     )
//   }
// }

// Timer.propTypes = {
//   min: PropTypes.number,
//   sec: PropTypes.number,
//   timer: PropTypes.shape({
//     currentMin: PropTypes.number,
//     currentSec: PropTypes.number,
//     isRunning: PropTypes.bool,
//   }),
//   id: PropTypes.number.isRequired,
//   onTimerUpdate: PropTypes.func.isRequired,
// }

// Timer.defaultProps = {
//   min: 0,
//   sec: 0,
//   timer: null,
// }
