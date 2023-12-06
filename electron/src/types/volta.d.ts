import { IpcMainEvent } from 'electron'
declare global {
  interface voltaIPC {
    channel: string
    sendMessage(event: IpcMainEvent, message: IpcMessage): void
  }

  interface IpcMessage {
    id?: string | null
    channel: string
    date: number
    action?: string
    datas?: unknown | string
    error?: unknown
  }


}
