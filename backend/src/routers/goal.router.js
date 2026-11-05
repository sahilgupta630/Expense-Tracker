import express from 'express';
import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    addContribution,
} from '../controllers/goal.controller.js';
import { checkForUserAuthentication, ensureSelf } from '../middleware/auth.middleware.js';

const goalRouter = express.Router();

goalRouter.post('/goals/create/:id', checkForUserAuthentication, ensureSelf('id'), createGoal);
goalRouter.get('/goals/get/:userId', checkForUserAuthentication, ensureSelf('userId'), getGoals);
goalRouter.put('/goals/update/:id/:userId', checkForUserAuthentication, ensureSelf('userId'), updateGoal);
goalRouter.delete('/goals/delete/:id/:userId', checkForUserAuthentication, ensureSelf('userId'), deleteGoal);
goalRouter.post('/goals/contribute/:id/:userId', checkForUserAuthentication, ensureSelf('userId'), addContribution);

export default goalRouter;
