import express from "express"
import morgan from "morgan"
import { db } from "../db/db"
import budgetRouter from "../../routes/budgetRouter"
import authRouter from "../../routes/authRouter"
import colors from "colors"

async function connectDB(){
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue.bold("Success connection"))
  } catch (error) {
    // console.log(error)   
    console.log(colors.red.bold("Connection Error"))
  }
}

connectDB()
const app = express()

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/budgets", budgetRouter)
app.use("/api/auth", authRouter)

export default app