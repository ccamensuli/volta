import { ipcMain, IpcMainEvent } from 'electron'

import voltadb from '../../volta/database/sequelize'

interface msgTemplate {
  channel: string
  id?: string | null
  date: Date
  data?: string | JSON[]
  error?: unknown
  action?: string | null
}

interface voltaIPC {
  sendMessage(event: IpcMainEvent, message: msgTemplate): void
  //handleIPCEvent(event: IpcMainEvent, arg: string): void
}

class Horloge implements voltaIPC {

  type: string = 'ipc-volta-horloge'

  constructor() {
    ipcMain.on(this.type, this.handleIPCEvent.bind(this));
  }

  private async handleIPCEvent(event: IpcMainEvent, arg: string): Promise<void> {
    let message: msgTemplate
    try {
      message = JSON.parse(arg)
      console.info(message)
    } catch (e) {
      console.error('protocole format error', e)
      throw e
    }

    switch (message.action) {
      case 'PING':
        return this.sendMessage(event, {
          channel: message.channel,
          id: message.id || null,
          date: new Date(),
          data: 'pong'
        })
      case 'GET':
        return this.sendMessage(event, {
          channel: message.channel,
          id: message.id || null,
          date: new Date(),
          data: await this.getAlarm()
        })
      case 'DELETE':
        return this.sendMessage(event, {
          channel: message.channel,
          id: message.id || null,
          date: new Date(),
          data: await this.getAlarm()
        })
      case 'CREATE':
        return this.sendMessage(event, {
          channel: message.channel,
          id: message.id || null,
          date: new Date(),
          data: await this.getAlarm()
        })

        break
      default:
        throw new Error(`Bad protocol`)
    }

  }

  sendMessage(event: IpcMainEvent, message: msgTemplate): void {
    return event.reply(this.type, JSON.stringify(message))
  }

  async getAlarm(): Promise<JSON[]> {
    if (voltadb && voltadb.alarm) {
      return voltadb.alarm.findAll()
    }
    throw new Error('Api not found')
  }
}

export default new Horloge()
