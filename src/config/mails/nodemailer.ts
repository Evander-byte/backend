import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

type TrasportConfig = {
  host: string
  port: number
  auth: {
    user: string 
    pass: string
  }
}

const config = (): TrasportConfig => {
  const data = {
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
  return data
}
export const transport = nodemailer.createTransport(config());
