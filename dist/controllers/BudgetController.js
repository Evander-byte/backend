"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Expense_1 = __importDefault(require("../models/Expense"));
class BudgetController {
    static getAll = async (req, res) => {
        try {
            const budgets = await Budget_1.default.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    userId: req.user.id,
                },
            });
            res.status(200).json(budgets);
        }
        catch (error) {
            res.status(500).json({ error: "There was an error" });
        }
    };
    static create = async (req, res) => {
        try {
            const budget = await Budget_1.default.create(req.body);
            budget.userId = req.user.id;
            await budget.save();
            res.status(201).json("Budget created successfully");
        }
        catch (error) {
            res.status(500).json({ error: "There was an error" });
        }
    };
    static getById = async (req, res) => {
        const budget = await Budget_1.default.findByPk(req.budget.id, {
            include: [Expense_1.default],
        });
        res.status(200).json(budget);
    };
    static updateById = async (req, res) => {
        await req.budget.update(req.body);
        res.status(201).json("Budget updated successfully");
    };
    static deleteByID = async (req, res) => {
        await req.budget.destroy();
        res.status(200).json("Budget deleted successfully");
    };
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map