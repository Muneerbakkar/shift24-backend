import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiry = new Enquiry(req.body);
    const savedEnquiry = await enquiry.save();
    res.status(201).json(savedEnquiry);
  } catch (error) {
    res.status(400).json({ message: "Error creating enquiry", error });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      res.status(404).json({ message: "Enquiry not found" });
      return;
    }
    res.json({ message: "Enquiry cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling enquiry", error });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!enquiry) {
      res.status(404).json({ message: "Enquiry not found" });
      return;
    }
    
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Error updating enquiry status", error });
  }
};
