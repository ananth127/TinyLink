import express from 'express';
import {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
} from '../controllers/linkController.js';

const router = express.Router();

router.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowed = [
    "http://localhost:5173",
    "https://tiny-link-xwgs.vercel.app",
  ];

  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});


// Create a new link
router.post('/links', createLink);

// Get all links
router.get('/links', getAllLinks);

// Get stats for a specific link
router.get('/links/:code', getLinkStats);

// Delete a link
router.delete('/links/:code', deleteLink);

export default router;