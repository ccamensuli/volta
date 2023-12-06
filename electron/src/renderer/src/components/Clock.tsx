import React, { useState, useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/fr.js'
import useAlarm from './hooks/useAlarm'
import Container from '@mui/material/Container'
//import Badge from '@mui/material/Badge'
//import MailIcon from '@mui/icons-material/Mail'
import Chip from '@mui/material/Chip'

interface ClockProps {
  size: number
  locale?: string
  alarms?: []
  children?: any
  onAlarm: (alarm: any) => void
}

const Clock: React.FC<ClockProps> = ({
  children,
  size = 200,
  locale = 'fr',
  alarms = [],
  onAlarm = (): void => {}
}) => {
  const [chips, setChips] = useState<any[]>([])

  const { currentTime } = useAlarm(
    alarms,
    (date, active) => {
      setChips(active)
    },
    (alarm) => {
      onAlarm(alarm)
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
      {chips &&
        chips.map((alarm: any) => (
          <Chip
            sx={{ margin: '5px' }}
            key={alarm.id}
            label={`${moment(alarm.date).format('HH:mm')} ${alarm.message}`}
            color="primary"
            variant="outlined"
          />
        ))}
      {children}
    </Container>
  )
}

export default Clock
