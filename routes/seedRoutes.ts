import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';
import { checkDbConnection } from '../middleware/dbCheck.js';

const router = express.Router();

router.use(checkDbConnection);

router.post('/', seedDatabase);

export default router;
