import { Router } from "express";
import { checkForUserAuthentication, ensureSelf } from "../middleware/auth.middleware.js";
import {
    AddExpense,
    DeleteExpense,
    GetExpenses,
    UpdateExpense,
} from '../controllers/expense.controller.js';

const router = Router();
router.route("/expenses/add/:id").post(checkForUserAuthentication, ensureSelf("id"), AddExpense);
router.route("/expenses/delete/:id/:userId").delete(checkForUserAuthentication, ensureSelf("userId"), DeleteExpense);
router.route("/expenses/update/:id/:userId").put(checkForUserAuthentication, ensureSelf("userId"), UpdateExpense);
router.route("/expenses/get/:userId").get(checkForUserAuthentication, ensureSelf("userId"), GetExpenses);


export default router;