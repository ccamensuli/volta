import { ipcMain, IpcMainEvent } from 'electron'
import voltadb from '../../volta/database/sequelize'
import clc from 'cli-color'

class Horloge implements voltaIPC {
  channel: string = 'ipc-volta-horloge'

  constructor() {
    console.info(clc.green(`LISTEN IPC EVENT : ${this.channel}`), this.channel)
    ipcMain.on(this.channel, this.handleIPCEvent.bind(this))
  }

  private async handleIPCEvent(event: IpcMainEvent, arg: string): Promise<void> {
    console.info(clc.green(`EVENT : ${this.channel}`), arg)
    let message: IpcMessage
    try {
      message = JSON.parse(arg)
    } catch (e) {
      console.error('protocole format error', e)
      throw e
    }
    switch (message.action) {
      case 'PING':
        return this.sendMessage(event, {
          channel: message.channel,
          action: message.action,
          id: message.id || null,
          date: new Date().getTime(),
          datas: 'pong'
        })
      case 'GET':
        try {
          return this.sendMessage(event, {
            channel: this.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            datas: await this.getAlarm(message.datas)
          })
        } catch (e) {
          return this.sendMessage(event, {
            channel: message.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            error: e
          })
        }
      case 'DELETE':
        try {
          return this.sendMessage(event, {
            channel: message.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            datas: await this.deleteAlarm(message.datas)
          })
        } catch (e) {
          return this.sendMessage(event, {
            channel: message.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            error: e
          })
        }
      case 'CREATE':
        try {
          return this.sendMessage(event, {
            channel: message.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            datas: await this.setAlarm(message.datas)
          })
        } catch (e) {
          return this.sendMessage(event, {
            channel: message.channel,
            action: message.action,
            id: message.id || null,
            date: new Date().getTime(),
            error: e
          })
        }
        break
      default:
        throw new Error(`Bad protocol`)
    }
  }

  sendMessage(event: IpcMainEvent, message: IpcMessage): void {
    return event.reply(this.channel, JSON.stringify(message))
  }

  async getAlarm(): Promise<JSON[]> {
    return  new Promise((resolve, reject)=>{
      // call database
      if (voltadb && voltadb.alarm) {
        return setTimeout(() => {
          resolve( voltadb.alarm.findAll() )
        }, 3000);

      }
      return reject(new Error('Api not found'))
    })
  }

  async setAlarm(datas: unknown): Promise<JSON[]| Error> {
    if (voltadb && voltadb.alarm) {
      const message = JSON.parse(datas)
      voltadb.alarm
        .create(message)
        .then(() => {
          return this.getAlarm()
        })
        .catch((e) => {
          console.error(e)
          throw e
        })
    }
    return new Error('Api not found')
  }

  async deleteAlarm(datas: unknown): Promise<JSON[]> {
    console.info(datas)
    return []
  }
}

export default new Horloge()
