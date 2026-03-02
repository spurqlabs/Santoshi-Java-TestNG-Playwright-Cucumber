const locatorReader = require('../utils/locatorReader');
const testdataReader = require('../utils/testdataReader');
const configReader = require('../utils/configReader');
const assert = require('assert');
const log =  require('../utils/logger');

class LoginPage {
	constructor(page) {
		this.page = page;
	}

	async goto(url) {
		const target = url || configReader.getAppUrl();
		await this.page.goto(target);
	}

	async enterUsername(username) {
		const user = username || (testdataReader.getField('TC001 - Login to application', 'username'));
		const locator = locatorReader.getLocator(this.page, 'login.username');
		if (!locator) throw new Error('Locator for login.username not found');
		await locator.fill(user);
		
		assert.equal(await locator.inputValue(), user, 'Username value does not match');
		log.info("Username value entered successfully"); 
		  
	}

	async enterPassword(password) {
		const pwd = password || (testdataReader.getField('TC001 - Login to application', 'password'));
		const locator = locatorReader.getLocator(this.page, 'login.password');
		if (!locator) throw new Error('Locator for login.password not found');
		await locator.fill(pwd);
		 assert.equal(await locator.inputValue(), pwd, 'Password value does not match');
		log.info("Password value entered successfully");  

	}

	async clickLogin() {
		const locator1 = locatorReader.getLocator(this.page, 'login.loginButton');
		if (!locator1) throw new Error('Locator for login.loginButton not found');
		await Promise.all([
			this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
			locator1.click()
		]);
		const dashboard1 = locatorReader.getLocator(this.page, 'dashboard.dashboardHeader');
		assert.equal(await dashboard1.isVisible(), true, 'Dashboard did not load after login');
		log.info("Login successful, dashboard loaded");

	}

	async isLoggedIn() {
		const header = locatorReader.getLocator(this.page, 'dashboard.dashboardHeader');
		const topbar = locatorReader.getLocator(this.page, 'dashboard.top1');
		const candidate = header || topbar;
		if (!candidate) return false;
		try {
			await candidate.waitFor({ state: 'visible', timeout: 20000 });
			return true;
		} catch (e) {
			return false;
		}
	}

	async login(username, password) {
		await this.enterUsername(username);
		await this.enterPassword(password);
		await this.clickLogin();
	}
}

module.exports = LoginPage;
