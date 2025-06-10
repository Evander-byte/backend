import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from '../middleware/expense';

const router = Router()
router.param("budgetId", validateBudgetId)
router.param("budgetId", validateBudgetExists)

router.param("expenseId", validateExpenseId)
router.param("expenseId", validateExpenseExists)


router.get("/", BudgetController.getAll)

router.post("/", 
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create)

router.get("/:budgetId",
  handleInputErrors, 
  BudgetController.getById)

router.put("/:budgetId",
  validateBudgetId,
  validateBudgetExists,
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateById)

router.delete("/:budgetId", 
  handleInputErrors,
  BudgetController.deleteByID)

// Routes for expenses (ROA)
router.post("/:budgetId/expenses", 
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.create)
router.get("/:budgetId/expenses/:expenseId", 
  handleInputErrors,
  ExpenseController.getById)
router.put("/:budgetId/expenses/:expenseId", 
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById)
router.delete("/:budgetId/expenses/:expenseId", 
  handleInputErrors,
  ExpenseController.deleteById)



export default router