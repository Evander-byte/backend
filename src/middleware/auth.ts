import type { Response, NextFunction, Request } from 'express';
import { decodedJWT } from '../utils/jwt';
import User from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
      
  const bearer = req.headers.authorization
  if(!bearer) {
    const error = new Error("Invalid session")
    res.status(401).json({error: error.message})
    return
  }
  const [, token] = bearer.split(" ")
  if(!token) {
    const error = new Error("Invalid token")
    res.status(401).json({error: error.message})
  }
  try {
    const decoded = decodedJWT(token)
    if(typeof decoded === 'object' && decoded.id){
      req.user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email']
      })

      next()
    }
  } catch (error) {
    res.status(500).json({error: "Invalid token"})
  }
}