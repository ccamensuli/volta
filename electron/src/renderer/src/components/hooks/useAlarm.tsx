import moment from 'moment'
import { useState, useRef, useEffect } from 'react'
import { useInterval } from 'usehooks-ts'

interface AlarmOutput {
  currentTime: Date
}

function useAlarm(
  alarms: [],
  onTick: (date: Date) => void,
  onRing: (alarm: unknown) => void
): AlarmOutput {
  const [tick] = useState<number>(1000)
  const [check] = useState<number>(1000)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useInterval(() => {
    const current = new Date()
    setCurrentTime(current)
    if (onTick) {
      //console.log(alarms)
      onTick(current)
    }
  }, tick)

  useInterval(() => {
    handleCheck()
  }, check)

  const onCLickNotif = (): void => {
    console.log('onCLickNotif')
  }

  const notification = (title: string, body: string): Notification => {
    const notif = new Notification(title, { body: body })
    notif.onclick = onCLickNotif
    return notif
  }

  const handleCheck = (): any => {
    if (alarms.length) {
      const now = moment(currentTime).format('HH:mm')
      alarms.filter((ele) => {
        const alarm = moment(ele.date).format('HH:mm')
        if (alarm === now && ele.active && !(ele.isNotif === true)) {
          if (onRing) {
            try {
              onRing(ele)
              notification(`Alarm ${alarm}`, ele.message)
              ele.isNotif = true
            } catch (e) {
              console.error(e)
              throw e
            }
          }
        }
      })
    }
  }

  return {
    currentTime
  }
}

export default useAlarm
