import { Request, Response } from 'express';
import { Property } from '../models/Property.js';
import { initialProperties } from '../../frontend/src/data/properties.js';

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    await Property.deleteMany({});
    await Property.insertMany(initialProperties.map(p => {
      const { id, ...rest } = p;
      return rest;
    }));
    res.json({ message: "Database seeded successfully with initial properties" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding database" });
  }
};
