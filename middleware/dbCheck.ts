import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const checkDbConnection = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(500).json({ message: "Database not connected. Please add MONGODB_URI in secrets." });
    return;
  }
  next();
};
