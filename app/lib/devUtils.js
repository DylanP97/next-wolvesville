/**
 * Utility functions for dev mode text formatting
 */

/**
 * Returns text with "DEV -- " prefix if dev mode is enabled, otherwise returns empty string
 * @param {string} text - The text to prefix with "DEV -- "
 * @param {boolean} isDevMode - Whether dev mode is enabled
 * @returns {string} - Formatted text or empty string
 */
export const getDevText = (text, isDevMode) => {
  if (!isDevMode) {
    return "";
  }
  return `DEV -- ${text}`;
};

/**
 * Returns text with "DEV -- " prefix if dev mode is enabled, otherwise returns the original text
 * @param {string} text - The text to conditionally prefix
 * @param {boolean} isDevMode - Whether dev mode is enabled
 * @returns {string} - Formatted text or original text
 */
export const prefixDevText = (text, isDevMode) => {
  if (!isDevMode) {
    return text;
  }
  return `DEV -- ${text}`;
};

