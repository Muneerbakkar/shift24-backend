import express from 'express';
import { Property } from '../models/Property.js';
import { Enquiry } from '../models/Enquiry.js';
import { User } from '../models/User.js';

const router = express.Router();

// --- Dashboard Stats ---
router.get('/stats', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ approvalStatus: 'pending' });
    const totalEnquiries = await Enquiry.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({ totalProperties, pendingProperties, totalEnquiries, totalUsers });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Properties Management ---
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/properties/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Property.findByIdAndUpdate(id, { approvalStatus }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Users Management ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Enquiries Management ---
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/enquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
