import express from 'express';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { checkDbConnection } from '../middleware/dbCheck.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(checkDbConnection);

router.route('/')
  .get(getProperties)
  .post(upload.array('images', 10), createProperty);

router.route('/:id')
  .put(upload.array('images', 10), updateProperty)
  .delete(deleteProperty);

export default router;
