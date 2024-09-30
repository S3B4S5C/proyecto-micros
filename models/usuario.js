import { Sequelize } from 'sequelize'
import dotenv from 'dotenv';

dotenv.config()

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.PORT;

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('proyecto-micros', dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
    port: dbPort
  })

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }