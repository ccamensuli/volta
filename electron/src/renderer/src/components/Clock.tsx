import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import 'moment/locale/fr.js'

import Container from '@mui/material/Container'
import useAlarm from './hooks/useAlarm'

interface ClockProps {
  size: number
  locale?: string
  alarms?: []
}

const Clock: React.FC<ClockProps> = ({ size = 200, locale = 'fr', alarms = [] }) => {
  const { currentTime } = useAlarm(
    alarms,
    () => {},
    (alarm) => {
      alert(alarm.message)
    }
  )

  useEffect(() => {
    moment.locale(locale)
  }, [])

  const style: React.CSSProperties = {
    fontSize: `${size}px`
  }

  return (
    <Container maxWidth="lg">
      <h1 style={style}>{moment(currentTime).format('HH:mm:ss')}</h1>
    </Container>
  )
}

export default Clock
