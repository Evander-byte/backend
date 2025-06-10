import { Request, Response } from 'express';
import Expense from '../models/Expense';

export class ExpenseController {
  static getAll = async (req: Request, res: Response,) => {

  }
  static create = async (req: Request, res: Response,) => {
    try {
      const expense = new Expense(req.body)
      expense.budgetId = req.budget.id
      await expense.save()
      res.status(201).json({message: "Expense added successfully"})
    } catch (error) {
      res.status(500).json({error: "There was an error"})
    }
  }
  static getById = async (req: Request, res: Response,) => {
    const expense = await Expense.findByPk(req.expense.id)
    res.status(200).json(expense)
  }
  static updateById = async (req: Request, res: Response,) => {
    await req.expense.update(req.body)
    res.status(201).json({message: "Expense updated successfully"})
  }
  static deleteById = async (req: Request, res: Response,) => {
    await req.expense.destroy()
    res.status(200).json({message: "Expense deleted successfully"})
  }
}