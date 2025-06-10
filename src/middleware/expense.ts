import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import Expense from '../models/Expense';

declare global {
  namespace Express {
    interface Request {
      expense?: Expense
    }
  }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name')
    .notEmpty().withMessage("Expense's name cannot be empty")
    .run(req)

  await body('amount')
    .notEmpty().withMessage("Expense's amount cannot be empty")
    .isNumeric().withMessage("Invalod amount")
    .custom(value => value > 0).withMessage("Bodget's amount must be higher than zero")
    .run(req)
    next()
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
  await param("expenseId").isInt().withMessage("Invalid ID")
  .custom(value => value > 0).withMessage("Invalid ID")
  .run(req)
  next()
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {expenseId} = req.params
    const expense = await Expense.findByPk(expenseId)
    if(!expense) {
      const error = new Error("Expense not found")
      res.status(404).json({error: error.message})
    }
    req.expense = expense
  } catch (error) {
    res.status(500).json({message: "There was an error"})
  }
  next()
}