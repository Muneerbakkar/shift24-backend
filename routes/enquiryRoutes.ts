import express from 'express';
import { getEnquiries, createEnquiry, deleteEnquiry, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { checkDbConnection } from '../middleware/dbCheck.js';

const router = express.Router();

router.use(checkDbConnection);

router.route('/')
  .get(getEnquiries)
  .post(createEnquiry);

router.route('/:id')
  .delete(deleteEnquiry)
  .patch(updateEnquiryStatus);

export default router;
