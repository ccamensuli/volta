import React, { useState, useEffect, FormEvent } from 'react'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useIpc from './hooks/useIpc'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import CircularProgress from '@mui/material/CircularProgress/CircularProgress'
import Switch from '@mui/material/Switch/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

interface AlarmFormData {
  message: string
  date: Date
  active: boolean
}

interface CustomElements extends HTMLFormControlsCollection {
  message: HTMLInputElement
  date: HTMLInputElement
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements
}

export default function FormDialog(props: {
  open: boolean
  onCreate?: (data: unknown) => void
  onClose?: (open: boolean) => void
}): JSX.Element {
  const ipcChannel = 'ipc-volta-horloge'
  const { on, sendMessage, loading, id } = useIpc(ipcChannel)
  // form
  const [date, setDate] = useState<any>(moment())
  const [active, setChecked] = useState(true)
  const [idRequest, setIdRequest] = useState<IpcMessage['id']>(null)

  useEffect(() => {
    const unlisten = on((message: IpcMessage) => {
      if (props.onCreate) {
        props.onCreate(message.datas)
      }
      if (props.onClose) {
        props.onClose(false)
      }
    })
    return (): void => {
      unlisten()
    }
  }, [])

  // Mutations
  const createAlarm = (datas: AlarmFormData): void => {
    const message: IpcMessage = {
      channel: 'ipc-volta-horloge',
      date: new Date().getTime(),
      action: 'CREATE',
      datas: JSON.stringify(datas),
      error: null
    }
    const myid = sendMessage(message)
    setIdRequest(myid)
  }

  const handleClose = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (props.onClose) {
      props.onClose(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked)
  }

  const handleSubscribe = (event: FormEvent<CustomForm>): void => {
    event.preventDefault()
    const target = event.currentTarget
    if (target) {
      const data = {
        message: target.message.value,
        date: date.toDate(),
        active
      }
      // controle des champs !!!!
      return createAlarm(data)
    }
  }

  return (
    <Container maxWidth="lg">
      <Dialog
        className="container"
        open={props.open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
      >
        {loading && <CircularProgress color="secondary" />}
        <form onSubmit={handleSubscribe}>
          <DialogTitle>Ajouter une alarme</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>

            <TextField
              fullWidth
              label="Message"
              id="message"
              name="message"
              sx={{ margin: '10px' }}
            />

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <StaticTimePicker
                sx={{ margin: '10px' }}
                value={date}
                onChange={(newValue) => setDate(newValue)}
                ampm={false}
                slotProps={{
                  // pass props `actions={['clear']}` to the actionBar slot
                  actionBar: { actions: [] }
                }}
                //timeSteps={{ hours: 1, minutes: 1 }}
                //fullWidth
              ></StaticTimePicker>
            </LocalizationProvider>
            <FormControlLabel
              control={
                <Switch
                  name="active"
                  checked={active}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Activer"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="submit">Ajouter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
