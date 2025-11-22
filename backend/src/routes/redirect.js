import express from 'express';
import prisma from '../db/prisma.js';

const router = express.Router();

/**
 * Handle redirect for short codes
 */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Find the link
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Short link not found',
      });
    }

    // Update click count and last clicked time
    await prisma.link.update({
      where: { code },
      data: {
        clickCount: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    // Perform 302 redirect
    res.redirect(302, link.targetUrl);
  } catch (error) {
    next(error);
  }
});

export default router;