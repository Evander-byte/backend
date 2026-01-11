"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpenseController {
    static create = async (req, res) => {
        try {
            const expense = await Expense_1.default.create(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json("Expense added successfully");
        }
        catch (error) {
            res.status(500).json("There was an error");
        }
    };
    static getById = async (req, res) => {
        const expense = await Expense_1.default.findByPk(req.expense.id);
        res.status(200).json(expense);
    };
    static updateById = async (req, res) => {
        await req.expense.update(req.body);
        res.status(201).json("Expense updated successfully");
    };
    static deleteById = async (req, res) => {
        await req.expense.destroy();
        res.status(200).json("Expense deleted successfully");
    };
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=ExpenseController.js.map