/**
 * Centralized timeout configuration for consistent waits across the framework
 * Used to replace arbitrary hardcoded timeout values
 */
export const TIMEOUTS = {
    SHORT: 5000,      // For immediate UI elements (buttons, inputs)
    MEDIUM: 15000,    // For page navigation and standard operations
    LONG: 30000,      // For complex operations (uploads, background tasks)
} as const;

export type TimeoutKey = keyof typeof TIMEOUTS;
