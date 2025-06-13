import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config()

export const generateJWT = (id: string): string => {
  const token = jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })

  return token
}

export const decodedJWT = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}