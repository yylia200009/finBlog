const timers = {}

const timerManager = {
  start(id, minutes, seconds, callback) {
    this.stop(id)

    // Преобразуем в числа и защищаем от NaN
    let remaining = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)

    timers[id] = {
      interval: setInterval(() => {
        remaining--
        if (remaining <= 0) {
          this.stop(id)
          return
        }

        const mins = Math.floor(remaining / 60)
        const secs = remaining % 60
        callback({ minutes: mins, seconds: secs })
      }, 1000),
      callback,
    }
  },

  stop(id) {
    if (timers[id]) {
      clearInterval(timers[id].interval)
      delete timers[id]
    }
  },

  getTime(id) {
    return timers[id]
  },
}

export default timerManager
