import Versions from './components/Versions'
//import Horloge from './components/Horloge'
import Clock from './components/Clock'

//import icons from './assets/icons.svg'
import { useEffect } from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface window {
  volta: unknown
  electron: unknown
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App(): JSX.Element {
  useEffect(() => {
    //console.log('mount', window.electron, window.volta)
    // calling IPC exposed from preload script
    window.volta.once('ipc-volta-horloge', (arg) => {
      console.log(arg)
    })
    const message = {
      channel: 'ipc-volta-horloge',
      date: new Date().getTime(),
      action: 'GET',
      data: {},
      error: null
    }
    window.volta.sendMessage('ipc-volta-horloge', JSON.stringify(message))
    //window.volta.sendMessage('ipc-volta-horloge', JSON.stringify(message))
  }, [])

  // render
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="container">
        <Versions></Versions>
        <Clock size={200}></Clock>
      </div>
    </ThemeProvider>
  )
}

export default App
