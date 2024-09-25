import moment from 'moment'

export const formatTime = (time: string): string => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}

export const formatDate = (time: string): string => {
  // format time using "moment" library consist of day, month, year
  return time && moment(time).format('DD/MM/YYYY')
}

export const formatDurationToHMS = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (match) {
    const hours = match[1] ? parseInt(match[1], 10) : 0
    const minutes = match[2] ? parseInt(match[2], 10) : 0
    const seconds = match[3] ? parseInt(match[3], 10) : 0

    return [hours, minutes, seconds]
  }

  return [0, 0, 0]
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isToday = (date: Date): boolean => {
  return isSameDate(date, new Date())
}

export const duration = (sec: number, type: 'short' | 'long' = 'short') => {
  const duration = moment.duration(sec, 'seconds')

  if (type === 'short') {
    const totalHours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    if (totalHours === 0) {
      const duration = moment.duration(sec, 'seconds')
      return moment.utc(duration.asMilliseconds()).format('mm:ss')
    } else {
      return `${totalHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  } else if (type === 'long') {
    const totalHours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    let formattedTime = ''

    if (totalHours > 0) {
      formattedTime += `${totalHours} giờ `
    }
    if (minutes > 0) {
      formattedTime += `${minutes} phút `
    }
    if (seconds > 0) {
      formattedTime += `${seconds} giây`
    }
    return formattedTime.trim()
  }
}

// return time remaining: 1d:2h:3m
export const getTimeRemaining = (
  expireDate: Date | string,
  isReturnObject: boolean = false
): string | { day: number; hour: number; minute: number } => {
  const now = moment()
  const expirationDate = moment(expireDate)

  const diff = moment.duration(expirationDate.diff(now))

  const days = Math.floor(diff.asDays())
  const hours = Math.floor(diff.asHours()) % 24
  const minutes = Math.floor(diff.asMinutes()) % 60

  let timeRemaining = ''

  if (days > 0) {
    timeRemaining += `${days}d:`
  }

  if (hours > 0) {
    timeRemaining += `${hours}h:`
  }

  if (minutes > 0) {
    timeRemaining += `${minutes}m`
  }

  // Remove trailing comma and space if they exist
  if (timeRemaining.endsWith(', ')) {
    timeRemaining = timeRemaining.slice(0, -2)
  }

  return isReturnObject
    ? {
        day: +days,
        hour: +hours,
        minute: +minutes,
      }
    : timeRemaining
}

// return percent of using time
export const usingPercentage = (begin: Date | string, expire: Date | string): number => {
  const now = moment()
  const beginDate = moment(begin)
  const expirationDate = moment(expire)

  const total = expirationDate.diff(beginDate)
  const remaining = expirationDate.diff(now)

  return Math.round((1 - remaining / total) * 100)
}

export const getColorClass = (begin: Date | string, expire: Date | string) => {
  const percentage = usingPercentage(begin, expire)
  if (percentage >= 93) {
    return 'text-red-500'
  } else if (percentage >= 80) {
    return 'text-yellow-500'
  } else {
    return 'text-green-500'
  }
}

// get times
export const getTimes = (d = 0, h = 0, m = 0, s = 0) => {
  // convert all to seconds
  const totalSeconds = h * 3600 + m * 60 + s

  // calc days, hours, minutes, seconds
  const days = Math.floor(totalSeconds / (24 * 3600))
  const remainingSeconds = totalSeconds % (24 * 3600)
  const hours = Math.floor(remainingSeconds / 3600)
  const remainingSecondsAfterHours = remainingSeconds % 3600
  const minutes = Math.floor(remainingSecondsAfterHours / 60)
  const seconds = remainingSecondsAfterHours % 60

  return {
    days: days + d,
    hours,
    minutes,
    seconds,
  }
}

// from numbers of (day, hour, minute, second) => expire time
export const calcExpireTime = (d = 0, h = 0, m = 0, s = 0) => {
  // calc days, hours, minutes, seconds
  const { days, hours, minutes, seconds } = getTimes(d, h, m, s)

  // get current time
  const currentTime = new Date()

  // add time to current time
  const expireTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate() + days,
    currentTime.getHours() + hours,
    currentTime.getMinutes() + minutes,
    currentTime.getSeconds() + seconds
  )

  return expireTime
}
