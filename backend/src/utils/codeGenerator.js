/**
 * Generates a random alphanumeric code
 * @param {number} length - Length of code (6-8 characters)
 * @returns {string} Random code
 */
export function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * Validates if code matches the required pattern
 * @param {string} code - Code to validate
 * @returns {boolean} True if valid
 */
export function isValidCode(code) {
  const codePattern = /^[A-Za-z0-9]{6,8}$/;
  return codePattern.test(code);
}