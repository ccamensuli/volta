import moment from 'moment'
import { useState } from 'react'
import { useInterval } from 'usehooks-ts'

interface AlarmOutput {
  currentTime: Date
}

function useAlarm(
  alarms: [],
  onTick: (date: Date, activeAlarm: unknown[]) => void,
  onRing: (alarm: unknown) => void
): AlarmOutput {
  const [tick] = useState<number>(1000)
  const [check] = useState<number>(1000)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [activeAlarm, setActiveAlarm] = useState<unknown[]>([])

  // console.log(activeAlarm)

  useInterval(() => {
    const current = new Date()
    setCurrentTime(current)
    if (onTick) {
      onTick(current, activeAlarm)
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

  const handleCheck = (): void => {
    if (alarms.length) {
      const now = moment(currentTime).format('HH:mm')
      //console.log(alarms)
      alarms.map((ele) => {
        const alarm = moment(ele.date).format('HH:mm')
        //console.log(alarm, activeAlarm)
        const newActive = activeAlarm.filter((oldactive: any) => {
          const test = moment(oldactive.date).format('HH:mm')
          //console.log(test, now)
          if (test === now) {
            return oldactive
          }
        })
        if (alarm === now && ele.active && !(ele.isNotif === true)) {
          if (onRing) {
            try {
              notification(`Alarm ${alarm}`, ele.message)
              //console.log('onRing', ele)
              newActive.push(ele)
              ele.isNotif = true
              onRing(ele)
            } catch (e) {
              console.error(e)
              throw e
            }
          }
        }
        setActiveAlarm(newActive)
      })
    }
  }

  return {
    currentTime
  }
}

export default useAlarm
