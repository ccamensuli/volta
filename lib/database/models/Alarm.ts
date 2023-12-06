import {
  Model,
  DataTypes,
  ModelOptions,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize'

interface definition {
  name: string
  model: typeof Model
  options: ModelOptions
  definitions: unknown
}

class Alarm extends Model<InferAttributes<Alarm>, InferCreationAttributes<Alarm>> {
  declare id: CreationOptional<number>
  declare date: string
  declare active: boolean
  declare message: string
}

const options: ModelOptions = {
  tableName: 'alarms'
}

const definitions = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: new DataTypes.DATE(),
    allowNull: false
  },
  active: {
    type: new DataTypes.BOOLEAN(),
    defaultValue: true,
    allowNull: false
  },
  message: {
    type: new DataTypes.STRING(1024),
    allowNull: true
  }
}

const model: definition = {
  name: 'Alarm',
  model: Alarm,
  definitions,
  options
}

export default model
