// ==================== TRACKING TOKEN ====================

/**
 * Generate a unique tracking token for order tracking
 * Creates an 8-character alphanumeric token that's URL-safe and hard to guess
 * @returns {string} Unique tracking token
 */
export const generateTrackingToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Add timestamp-based component for uniqueness
  const timestamp = Date.now().toString(36).slice(-4);

  return `${token}${timestamp}`;
};
