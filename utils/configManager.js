const fs = require('fs');
const path = require('path');

/**
 * Configuration Manager - Reads and manages configuration from JSON files
 */
class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from config.json
   */
  loadConfig() {
    const configPath = path.join(__dirname, '../config/config.json');
    try {
      const rawData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error(`Failed to load config: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get base URL
   */
  getBaseUrl() {
    return this.config.baseUrl;
  }

  /**
   * Get login path
   */
  getLoginPath() {
    return this.config.loginPath;
  }

  /**
   * Get full login URL
   */
  getLoginUrl() {
    return `${this.config.baseUrl}${this.config.loginPath}`;
  }

  /**
   * Get timeout
   */
  getTimeout() {
    return this.config.timeout;
  }

  /**
   * Get browser configuration
   */
  getBrowserConfig() {
    return this.config.browser;
  }

  /**
   * Get browser type
   */
  getBrowserType() {
    return this.config.browser.type;
  }

  /**
   * Check if headless mode
   */
  isHeadless() {
    return this.config.browser.headless;
  }

  /**
   * Get viewport width
   */
  getViewportWidth() {
    return this.config.browser.viewport.width;
  }

  /**
   * Get viewport height
   */
  getViewportHeight() {
    return this.config.browser.viewport.height;
  }

  /**
   * Get slowMo value
   */
  getSlowMo() {
    return this.config.browser.slowMo;
  }

  /**
   * Get viewport configuration
   */
  getViewport() {
    return this.config.browser.viewport;
  }
}

// Export singleton instance
module.exports = new ConfigManager();
