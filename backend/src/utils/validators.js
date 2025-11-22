import { z } from 'zod';

/**
 * Schema for creating a new link
 */
export const createLinkSchema = z.object({
  targetUrl: z.string().url({ message: 'Invalid URL format' }),
  customCode: z
    .string()
    .regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters')
    .optional()
    .or(z.literal('')),
});

/**
 * Validates if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}