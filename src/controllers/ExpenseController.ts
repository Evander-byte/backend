import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json("Expense added successfully");
    } catch (error) {
      res.status(500).json("There was an error");
    }
  };
  static getById = async (req: Request, res: Response) => {
    const expense = await Expense.findByPk(req.expense.id);
    res.status(200).json(expense);
  };
  static updateById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.status(201).json("Expense updated successfully");
  };
  static deleteById = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.status(200).json("Expense deleted successfully");
  };
}
