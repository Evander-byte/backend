"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const Expense_1 = __importDefault(require("../../../models/Expense"));
const ExpenseController_1 = require("../../../controllers/ExpenseController");
jest.mock("../../../models/Expense", () => ({
    create: jest.fn()
}));
describe("ExpresController.create", () => {
    it("should create a new expnese", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        Expense_1.default.create.mockResolvedValue(expenseMock);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets/:budgetId/expenses",
            body: {
                name: "Test Expens",
                amount: 500
            },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpenseController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(data).toStrictEqual({ message: "Expense added successfully" });
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense_1.default.create).toHaveBeenCalledWith(req.body);
    });
    it("should handle the error", async () => {
        const expenseMock = {
            save: jest.fn().mockRejectedValue(false)
        };
        Expense_1.default.create.mockRejectedValue(expenseMock);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets/:budgetId/expenses",
            body: {
                name: "Test Expens",
                amount: 500
            },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpenseController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toStrictEqual({ error: "There was an error" });
        expect(expenseMock.save).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=ExpenseController.test.js.map