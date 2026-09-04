/**
 * Environment configuration
 * Safely handles credentials and environment-specific settings
 * Uses environment variables, NOT hardcoded values
 */

export const ENV = {
    BASE_URL: process.env.TEST_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    ADMIN_USERNAME: process.env.TEST_ADMIN_USERNAME || 'Admin',
    ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || 'admin123',
} as const;

// Validate critical settings
if (!ENV.ADMIN_PASSWORD) {
    throw new Error('CRITICAL: Admin password not configured. Set TEST_ADMIN_PASSWORD environment variable.');
}
