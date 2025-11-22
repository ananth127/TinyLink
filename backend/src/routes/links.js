import express from 'express';
import {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
} from '../controllers/linkController.js';

const router = express.Router();

// Create a new link
router.post('/links', createLink);

// Get all links
router.get('/links', getAllLinks);

// Get stats for a specific link
router.get('/links/:code', getLinkStats);

// Delete a link
router.delete('/links/:code', deleteLink);

export default router;