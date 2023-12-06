import { useState } from 'react'
import Versions from './components/Versions'
import Clock from './components/Clock'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import FormDialog from './components/FormDialog'
import TableAlarm from './components/TableAlam'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alarms, setAlarm] = useState<[]>([])

  //Mutations
  function handleDialog(): void {
    setOpen(!open)
  }

  const handleAlarms = (data: any): void => {
    setAlarm(data)
  }
  const handleAlarm = (alarm: any): void => {
    console.info(alarm)
    //alert(alarm.message)
  }

  const onCreate = (/*alarm*/): void => {
    setOpen(false)
  }

  // render
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="container">
        <Versions></Versions>
        <Clock size={200} alarms={alarms} onAlarm={handleAlarm}></Clock>
        <Button variant="contained" onClick={handleDialog}>
          Créer Une Alarme
        </Button>
        {open && (
          <FormDialog
            open={open}
            onClose={() => {
              setOpen(false)
            }}
            onCreate={onCreate}
          ></FormDialog>
        )}
        <Container maxWidth="lg">
          {loading && <CircularProgress color="secondary" />}
          <TableAlarm loading={loading} onLoading={setLoading} onAlarms={handleAlarms}></TableAlarm>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
