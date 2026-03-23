/**
 * Logger Utility
 * Provides consistent logging functionality across the framework
 */
class Logger {
  /**
   * Log info message
   * @param {string} message - Message to log
   */
  static info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   */
  static debug(message) {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  static warn(message) {
    console.log(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   */
  static error(message) {
    console.log(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Log step message for test steps
   * @param {string} message - Message to log
   */
  static step(message) {
    console.log(`[STEP] ${new Date().toISOString()} - ${message}`);
  }

  /**
   * Log assertion message for test assertions
   * @param {string} message - Message to log
   */
  static assertion(message) {
    console.log(`[ASSERTION] ${new Date().toISOString()} - ${message}`);
  }
}

module.exports = Logger;
