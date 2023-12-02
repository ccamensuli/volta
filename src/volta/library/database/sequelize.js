import { Sequelize, Model } from 'sequelize';
import path from 'node:path';

class VoltaDb {
  constructor(pathDb = './volta.db') {
    this.sequelize = null;
  }

  async initdb(pathDb) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: pathDb, // Spécifiez le chemin où vous voulez stocker la base de données SQLite
      logging: true,
    });
    await this.setModelAlarm();
    await this.sync();
    return this.sequelize;
  }

  async sync() {
    try {
      await this.sequelize.authenticate();
      console.log(
        'Connection to the database has been established successfully.',
      );
      await this.sequelize.sync();
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  async setModelAlarm() {
    const AlarmModel = require(`${path.join(__dirname)}/models/Alarm.js`);
    class Alarm extends Model {}
    Alarm.init(AlarmModel, {
      sequelize: this.sequelize, // We need to pass the connection instance
      modelName: 'Alarm', // We need to choose the model name
    });
    return Alarm;
  }
}

// singleton
module.exports = {
  voltadb: new VoltaDb(),
  Sequelize,
  Model,
};
