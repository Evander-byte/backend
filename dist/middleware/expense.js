"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsToBudget = exports.validateExpenseExists = exports.validateExpenseId = exports.validateExpenseInput = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
const validateExpenseInput = async (req, res, next) => {
    await (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Expense's name cannot be empty")
        .run(req);
    await (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Expense's amount cannot be empty")
        .isNumeric()
        .withMessage("Invalod amount")
        .custom((value) => value > 0)
        .withMessage("Bodget's amount must be higher than zero")
        .run(req);
    next();
};
exports.validateExpenseInput = validateExpenseInput;
const validateExpenseId = async (req, res, next) => {
    await (0, express_validator_1.param)("expenseId")
        .isInt()
        .withMessage("Invalid ID")
        .custom((value) => value > 0)
        .withMessage("Invalid ID")
        .run(req);
    next();
};
exports.validateExpenseId = validateExpenseId;
const validateExpenseExists = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense_1.default.findByPk(expenseId);
        if (!expense) {
            const error = new Error("Expense not found");
            res.status(404).json({ message: error.message });
            return;
        }
        req.expense = expense;
    }
    catch (error) {
        res.status(500).json({ message: "There was an error" });
    }
    next();
};
exports.validateExpenseExists = validateExpenseExists;
const belongsToBudget = async (req, res, next) => {
    if (req.budget.id !== req.expense.budgetId) {
        const error = new Error("Invalid action");
        res.status(403).json({ message: error.message });
        return;
    }
    next();
};
exports.belongsToBudget = belongsToBudget;
//# sourceMappingURL=expense.js.map