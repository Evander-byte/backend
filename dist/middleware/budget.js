"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccess = exports.validateBudgetInput = exports.validateBudgetExists = exports.validateBudgetId = void 0;
const express_validator_1 = require("express-validator");
const Budget_1 = __importDefault(require("../models/Budget"));
const validateBudgetId = async (req, res, next) => {
    await (0, express_validator_1.param)("budgetId")
        .isInt()
        .withMessage("Invalid ID")
        .custom((value) => value > 0)
        .withMessage("Invalid ID")
        .run(req);
    next();
};
exports.validateBudgetId = validateBudgetId;
const validateBudgetExists = async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget_1.default.findByPk(budgetId);
        if (!budget) {
            const error = new Error("Budget not found");
            res.status(404).json({ error: error.message });
        }
        req.budget = budget;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Invalid ID" });
    }
};
exports.validateBudgetExists = validateBudgetExists;
const validateBudgetInput = async (req, res, next) => {
    await (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Budget's name cannot be empty")
        .run(req);
    await (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Budget's amount cannot be empty")
        .isNumeric()
        .withMessage("Invalid amount")
        .custom((value) => value > 0)
        .withMessage("Budget's amount must be higher than zero ")
        .run(req);
    next();
};
exports.validateBudgetInput = validateBudgetInput;
const hasAccess = (req, res, next) => {
    if (req.budget.userId !== req.user.id) {
        const error = new Error("Invalid action");
        res.status(401).json({ error: error.message });
        return;
    }
    next();
};
exports.hasAccess = hasAccess;
//# sourceMappingURL=budget.js.map