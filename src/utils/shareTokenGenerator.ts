/**
 * Generates a secure share token for project sharing
 * Uses crypto.randomUUID for security with a custom prefix
 */
export const generateShareToken = (): string => {
  // Generate a base UUID
  const uuid = crypto.randomUUID();
  
  // Create a custom prefix for easy identification
  const prefix = 'prob';
  
  // Remove hyphens and take a portion of the UUID for a cleaner token
  const cleanUuid = uuid.replace(/-/g, '');
  
  // Create the final token with prefix and shortened UUID
  // Format: prob_XXXXXXXXXXXXXXXX (16 characters after prefix)
  const token = `${prefix}_${cleanUuid.substring(0, 16)}`;
  
  return token;
};

/**
 * Validates a share token format
 */
export const validateShareToken = (token: string): boolean => {
  // Check if token matches expected format
  const tokenRegex = /^prob_[a-f0-9]{16}$/;
  return tokenRegex.test(token);
};

/**
 * Extracts the token ID from a full share URL
 */
export const extractTokenFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const shareIndex = pathParts.indexOf('share');
    
    if (shareIndex !== -1 && pathParts[shareIndex + 1]) {
      const token = pathParts[shareIndex + 1];
      return validateShareToken(token) ? token : null;
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Generates a short-lived preview token for temporary access
 */
export const generatePreviewToken = (expiryMinutes: number = 30): {
  token: string;
  expiresAt: Date;
} => {
  const token = `preview_${crypto.randomUUID().split('-')[0]}`;
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);
  
  return { token, expiresAt };
};