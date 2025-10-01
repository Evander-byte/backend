import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpenseController } from "../../../controllers/ExpenseController";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn()
}))

describe("ExpresController.create", () => {
  it("should create a new expnese", async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true)
    };

    (Expense.create as jest.Mock).mockResolvedValue(expenseMock)

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: {
        name: "Test Expens",
        amount: 500
      },
      budget: {id: 1}
    })

    const res = createResponse();
    await ExpenseController.create(req, res);

    const data = res._getJSONData()
    expect(res.statusCode).toBe(201)
    expect(data).toStrictEqual({message: "Expense added successfully"})
    expect(expenseMock.save).toHaveBeenCalledTimes(1)
    expect(Expense.create).toHaveBeenCalledWith(req.body)
  })

  it("should handle the error", async () => {
    const expenseMock = {
      save: jest.fn().mockRejectedValue(false)
    };

    (Expense.create as jest.Mock).mockRejectedValue(expenseMock)

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: {
        name: "Test Expens",
        amount: 500
      },
      budget: {id: 1}
    })

    const res = createResponse()
    await ExpenseController.create(req, res)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(500)
    expect(data).toStrictEqual({error: "There was an error"})
    expect(expenseMock.save).not.toHaveBeenCalled()
  })
})