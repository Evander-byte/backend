import { Sequelize } from "sequelize-typescript"
import dotenv from "dotenv"

dotenv.config()

export const db = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  port: 5432,
  models: [__dirname + "../../../models/**/*"]
})