import React, { useRef } from 'react'
import { useEffect } from 'react'
import { Button } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import useIpc from './hooks/useIpc'
import moment from 'moment'

export default function TableAlarm(props: {
  loading: boolean
  onLoading: (loading: boolean) => void
  onAlarms: (datas: IpcMessage['datas'] | []) => void
  reload: boolean
}): JSX.Element {
  const ipcChannel = 'ipc-volta-horloge'
  const { once, sendMessage, loading, datas } = useIpc(ipcChannel)

  useEffect(() => {
    const unlisten = once((messageipc: IpcMessage) => {
      props.onAlarms(messageipc.datas)
    })
    getAlarm()
    return () => {
      console.log('passss')
      unlisten()
    }
  }, [])

  useEffect(() => {
    props.onLoading(loading)
  }, [loading])

  useEffect(() => {
    if (props.reload) {
      getAlarm()
    }
  }, [props.reload])

  // Mutations
  const handleChange = (id: number, active: boolean): void => {
    console.log('switch', id, active)
  }
  const handeldelete = (id: number): void => {
    console.log('delete', id)
  }

  const getAlarm = (): void => {
    const message: IpcMessage = {
      channel: 'ipc-volta-horloge',
      date: new Date().getTime(),
      action: 'GET',
      datas: {},
      error: null
    }
    sendMessage(message)
  }
  const activateAlarm = (id: number): void => {
    const message: IpcMessage = {
      channel: 'ipc-volta-horloge',
      date: new Date().getTime(),
      action: 'GET',
      datas: { id },
      error: null
    }
    return sendMessage(message)
  }
  const deleteAlarm = (id: number): void => {
    const message: IpcMessage = {
      channel: 'ipc-volta-horloge',
      date: new Date().getTime(),
      action: 'DELETE',
      datas: { id },
      error: null
    }
    return sendMessage(message)
  }
  // RENDER
  return (
    <React.Fragment>
      {!loading && datas && datas.datas && (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="Alarm">
            <TableHead>
              <TableRow>
                <TableCell>Alarme</TableCell>
                <TableCell align="right">Message</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.datas.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" style={{ fontSize: '50px' }}>
                    {moment(row.date).format('HH:mm')}
                  </TableCell>
                  <TableCell align="right">{row.message}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={row.active}
                      onChange={() => {
                        handleChange(row.id, row.active)
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <DeleteIcon
                      onClick={() => {
                        handeldelete(row.id)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </React.Fragment>
  )
}
