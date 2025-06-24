import { createRequest, createResponse } from "node-mocks-http"
import { budgets } from '../../mocks/budgets';
import { BudgetController } from "../../../controllers/BudgetController"
import Budget from "../../../models/Budget"
import Expense from "../../../models/Expense"

jest.mock("../../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn()
})) 

describe("BudgetController.getAll", () => {

  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId)
      return Promise.resolve(updatedBudgets)
    })
  })


  it("should retrieve 2 budgets for user with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {id: 2}
    })
    const res = createResponse();

    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200)
    expect(res.status).not.toBe(404)
  })


  it("should retrieve 1 budgets for user with ID 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {id: 2}
    })
    const res = createResponse();

    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200)
    expect(res.status).not.toBe(404)
  })


  it("should retrieve 0 budgets for user with ID 3+", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {id: 3}
    })
    const res = createResponse();

    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200)
    expect(res.status).not.toBe(404)
  })

  it("should handle errors when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {id: 100}
    })

    const res = createResponse();

    (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
    await BudgetController.getAll(req, res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({error: "There was an error"})
  })
})

describe("BudgetController.create", () => {
  it("should create a new budget with statusCode 201", async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true)
    };
    (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: {id: 1},
      body: {name: "Test budget", amount: 1000}
    })

    const res = createResponse();
    await BudgetController.create(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(201)
    expect(data).toStrictEqual({message: "Budget created successfully"})
    expect(mockBudget.save).toHaveBeenCalled()    
    expect(mockBudget.save).toHaveBeenCalledTimes(1)    
    expect(Budget.create).toHaveBeenCalledWith(req.body)
  })

  it("should handle error when create a budget", async () => {
    const mockBudget = {
      save: jest.fn()
    };
    (Budget.create as jest.Mock).mockRejectedValue(new Error)
    const req = createRequest({
      method: "POST",
      url: "api/budgets",
      user: {id: 1},
      body: {name: "Test budget", amount: 1000}
    })

    const res = createResponse();

    await BudgetController.create(req, res)
    const data = res._getJSONData()
    expect(res.statusCode).toBe(500)
    expect(data).toStrictEqual({error: "There was an error"})
    expect(mockBudget.save).not.toHaveBeenCalled()
    expect(Budget.create).toHaveBeenCalledWith(req.body)
  })
})

describe("BudgetController.getById", () => {
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockReset();
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter(b => b.id === id)[0]
      return Promise.resolve(budget)
    })
  })

  it("should return a budget with ID 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budget/:id",
      budget: {id: 1}
    })

    const res = createResponse();

    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(3)
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense]
    })
  })
  it("should return a budget with ID 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budget/:id",
      budget: {id: 2}
    })
    
    const res = createResponse();
    
    await BudgetController.getById(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(2)
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense]
    })
  })
  it("should return a budget with ID 3 and 0 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budget/:id",
      budget: {id: 3}
    })

    const res = createResponse();

    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(0)
    expect(Budget.findByPk).toHaveBeenCalled()
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense]
    })
  })
})

describe("BudgetController.updateById", () => {
  it("should update the budget and return a success message", async () => {
    const mockBudget = {
      update: jest.fn().mockResolvedValue(true)
    }
    const req = createRequest({
      method: "PUT",
      url: "api/budgets/:budgetId",
      budget: mockBudget,
      body: {name: "Updated budget", amount: 1000}
    })
    const res = createResponse();
    await BudgetController.updateById(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(201)
    expect(data).toStrictEqual({message: "Budget updated successfully"})
    expect(mockBudget.update).toHaveBeenCalled()
    expect(mockBudget.update).toHaveBeenCalledTimes(1)
    expect(mockBudget.update).toHaveBeenCalledWith(req.body)
  })
})

describe("BudgetController.deleteById", () => {
  it("should delete the budget and return a success message", async () => {
    const mockBudget = {
      destroy: jest.fn().mockResolvedValue(true)
    }
    const req = createRequest({
      method: "DELETE",
      url: "api/budgets/:budgetId",
      budget: mockBudget,
    })
    const res = createResponse();
    await BudgetController.deleteByID(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data).toStrictEqual({message: "Budget deleted successfully"})
    expect(mockBudget.destroy).toHaveBeenCalled()
    expect(mockBudget.destroy).toHaveBeenCalledTimes(1)
  })
})