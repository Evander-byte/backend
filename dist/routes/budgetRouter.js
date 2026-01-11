"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const validation_1 = require("../middleware/validation");
const budget_1 = require("../middleware/budget");
const ExpenseController_1 = require("../controllers/ExpenseController");
const expense_1 = require("../middleware/expense");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
//Middleware to validate auth
router.use(auth_1.authenticate);
router.param("budgetId", budget_1.validateBudgetId);
router.param("budgetId", budget_1.validateBudgetExists); //req.budget
router.param("budgetId", budget_1.hasAccess);
router.param("expenseId", expense_1.validateExpenseId);
router.param("expenseId", expense_1.validateExpenseExists);
router.param("expenseId", expense_1.validateExpenseExists);
router.get("/", BudgetController_1.BudgetController.getAll);
router.post("/", budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.create);
router.get("/:budgetId", validation_1.handleInputErrors, BudgetController_1.BudgetController.getById);
router.put("/:budgetId", budget_1.validateBudgetId, budget_1.validateBudgetExists, budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.updateById);
router.delete("/:budgetId", validation_1.handleInputErrors, BudgetController_1.BudgetController.deleteByID);
// Routes for expenses (ROA)
router.post("/:budgetId/expenses", expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpenseController.create);
router.get("/:budgetId/expenses/:expenseId", validation_1.handleInputErrors, ExpenseController_1.ExpenseController.getById);
router.put("/:budgetId/expenses/:expenseId", expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpenseController.updateById);
router.delete("/:budgetId/expenses/:expenseId", validation_1.handleInputErrors, ExpenseController_1.ExpenseController.deleteById);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map