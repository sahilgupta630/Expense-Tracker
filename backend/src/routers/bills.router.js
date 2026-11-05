import express from "express";
import { createBill, getBillsByGroup, getBillById, updateBill, deleteBill, getBalances, getSmartSettleUp } from "../controllers/bill.controller.js";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = express.Router();

// Every bill route requires login. The controller checks the user belongs to the bill's group.
router.post("/createBill", checkForUserAuthentication, createBill); // Create a bill
router.get("/getBills/:groupId", checkForUserAuthentication, getBillsByGroup); // Get all bills for a group
router.get("/getBill/:billId", checkForUserAuthentication, getBillById); // Get a specific bill
router.put("/updateBill/:billId", checkForUserAuthentication, updateBill); // Update a bill
router.delete("/deleteBill/:billId", checkForUserAuthentication, deleteBill); // Delete a bill
router.get("/getBalances/:groupId", checkForUserAuthentication, getBalances); // Get balances for a group
router.get("/getSmartBillSettle/:billId", checkForUserAuthentication, getSmartSettleUp); // Get smart bill settlement for a specific bill

export default router;
