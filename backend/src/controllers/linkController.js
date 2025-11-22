import prisma from '../db/prisma.js';
import { generateCode, isValidCode } from '../utils/codeGenerator.js';
import { createLinkSchema } from '../utils/validators.js';

/**
 * Create a new short link
 */
export async function createLink(req, res, next) {
  try {
    // Validate request body
    const { targetUrl, customCode } = createLinkSchema.parse(req.body);

    // Generate or use custom code
    let code = customCode && customCode.trim() !== '' ? customCode.trim() : null;
    
    // If no custom code, generate one
    if (!code) {
      code = generateCode(6);
      
      // Ensure generated code is unique
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma.link.findUnique({
          where: { code },
        });
        
        if (!existing) break;
        
        code = generateCode(6);
        attempts++;
      }
      
      if (attempts === 10) {
        return res.status(500).json({
          error: 'Failed to generate unique code',
          message: 'Please try again or provide a custom code',
        });
      }
    } else {
      // Check if custom code already exists
      const existing = await prisma.link.findUnique({
        where: { code },
      });
      
      if (existing) {
        return res.status(409).json({
          error: 'Code already exists',
          message: 'This short code is already taken. Please choose another.',
        });
      }
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        code,
        targetUrl,
      },
    });

    res.status(201).json({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clickCount: link.clickCount,
      lastClickedAt: link.lastClickedAt,
      createdAt: link.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all links
 */
export async function getAllLinks(req, res, next) {
  try {
    const { search } = req.query;
    
    const where = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { targetUrl: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const links = await prisma.link.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const linksWithShortUrl = links.map((link) => ({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clickCount: link.clickCount,
      lastClickedAt: link.lastClickedAt,
      createdAt: link.createdAt,
    }));

    res.json(linksWithShortUrl);
  } catch (error) {
    next(error);
  }
}

/**
 * Get stats for a specific link
 */
export async function getLinkStats(req, res, next) {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Link not found',
      });
    }

    res.json({
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      clickCount: link.clickCount,
      lastClickedAt: link.lastClickedAt,
      createdAt: link.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a link
 */
export async function deleteLink(req, res, next) {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Link not found',
      });
    }

    await prisma.link.delete({
      where: { code },
    });

    res.json({
      message: 'Link deleted successfully',
      code,
    });
  } catch (error) {
    next(error);
  }
}