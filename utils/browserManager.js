const { chromium, firefox, webkit } = require('playwright');
const configManager = require('./configManager');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initializeBrowser() {
    const browserConfig = configManager.getBrowserConfig();
    const browserType = browserConfig.type || 'chromium';
    const launchOptions = {
      headless: browserConfig.headless || false,
      slowMo: browserConfig.slowMo || 0,
      args: ['--start-maximized']
    };

    switch (browserType.toLowerCase()) {
      case 'firefox': this.browser = await firefox.launch(launchOptions); break;
      case 'webkit': this.browser = await webkit.launch(launchOptions); break;
      default: this.browser = await chromium.launch(launchOptions); break;
    }

    this.context = await this.browser.newContext({
      viewport: null,  // Set to null to maximize browser window
      ignoreHTTPSErrors: true,
      recordVideo: { dir: 'reports/videos/' }
    });
    this.page = await this.context.newPage();
    return this.page;
  }

  getPage() { return this.page; }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
    return this.page;
  }

  async navigateToLoginPage() {
    await this.navigateTo(`${configManager.getBaseUrl()}${configManager.getLoginPath()}`);
    return this.page;
  }

  async takeScreenshot(fileName) {
    await this.page.screenshot({ path: `reports/screenshots/${fileName}.png`, fullPage: true });
  }

  async closeBrowser() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    this.browser = null; this.context = null; this.page = null;
  }
}

module.exports = BrowserManager;
