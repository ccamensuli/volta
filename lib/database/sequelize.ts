import { Sequelize, Model, ModelAttributes } from 'sequelize'
//import Model from 'sequelize/types/model'
import path from 'node:path'
import clc from 'cli-color'

import Alarm from './models/Alarm'

let singleton: VoltaDb | null = null

class VoltaDb {
  sequelize: Sequelize | null = null
  alarm: Model | null = null
  isSYNC: boolean = false

  constructor() { }

  async initdb(pathDb: string): Promise<Sequelize> {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: pathDb, // Spécifiez le chemin où vous voulez stocker la base de données SQLite
      logging: (...arg) => {
        console.debug(clc.blue(...arg))
      }
    })
    this.alarm = this.addModel(Alarm)
    await this.sync()
    await this.addSeeders()
    return this.sequelize
  }
  async sync(): Promise<Sequelize | null> {
    try {
      if (this.sequelize) {
        await this.sequelize.authenticate()
        console.log('Connection to the database has been established successfully.')
        await this.sequelize.sync()
        this.isSYNC = true
        console.log('All models were synchronized successfully.')
      }
      return this.sequelize
    } catch (error) {
      this.isSYNC = false
      console.error('Unable to connect to the database:', error)
      throw error
    }
  }

  addModel({ model, definitions, options }): Model {
    try {
      return model.init(definitions, { ...options, sequelize: this.sequelize })
    } catch (e: unknown) {
      console.log(e)
      throw e
    }
  }

  async addSeeders(): Promise<JSON[]> {
    const ele = [
      {
        date: new Date(),
        message: 'tetetete',
        active: false
      }
    ]
    return this.alarm
      .create(ele[0])
      .then((ele) => {
        //console.log(ele)
        return this.alarm.findAll()
      })
      .then((ele) => {
        //console.log(ele)
        return ele
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
    return []
  }
}
if (!singleton) {
  singleton = new VoltaDb()
}

export default singleton