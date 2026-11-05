import { Router } from "express";
import { createGroup, deleteGroup, getGroupById, getGroups, joinGroup } from "../controllers/group.controller.js";
import { checkForUserAuthentication, ensureSelf } from "../middleware/auth.middleware.js";

const router= Router();

// Every group route requires login. Membership/ownership is checked in the controller.
router.post("/createGroup/:userId", checkForUserAuthentication, ensureSelf("userId"), createGroup);
router.delete("/deleteGroup/:groupId", checkForUserAuthentication, deleteGroup);
router.get("/getGroups/:userId", checkForUserAuthentication, ensureSelf("userId"), getGroups);
router.post("/joinGroup", checkForUserAuthentication, joinGroup);
router.get("/getGroup/:groupId", checkForUserAuthentication, getGroupById);
export default router;
