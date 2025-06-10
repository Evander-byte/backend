import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget
    }
  }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
  await param('budgetId').isInt().withMessage("Invalid ID")
  .custom(value => value > 0).withMessage("Invalid ID")
  .run(req)
  next()

}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {budgetId} = req.params
    const budget = await Budget.findByPk(budgetId)
    if(!budget) {
      const error = new Error("Budget not found")
      res.status(404).json({error: error.message})
    }
    req.budget = budget
    next()
  } catch (error) {
    res.status(500).json({error: "There was an error"})
  }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
      .notEmpty().withMessage("Budget's name cannot be empty")
      .run(req)
      
    await body('amount')
      .notEmpty().withMessage("Budget's amount cannot be empty")
      .isNumeric().withMessage("Invalid amount")
      .custom(value => value > 0).withMessage("Budget's amount must be higher than zero ")
      .run(req)
      next()
}