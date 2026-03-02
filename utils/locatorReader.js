/**
 * Utility to read locators from locators/locators.json
 * Exports helpers to get locator objects and Playwright locators.
 */
const locators = require('../locators/locators');

function get(path) {
  if (!path) return locators;
  const parts = path.split('.');
  let node = locators;
  for (const p of parts) {
    if (node && Object.prototype.hasOwnProperty.call(node, p)) {
      node = node[p];
    } else {
      return null;
    }
  }
  return node;
}

function getSelector(path) {
  const node = get(path);
  if (!node) return null;
  if (typeof node === 'string') return node;
  return node.selector || null;
}

/**
 * Returns a Playwright Locator for the given `path` (e.g. "login.username").
 * Returns null if selector not found.
 */
function getLocator(page, path) {
  if (!page) throw new Error('page is required to build a Playwright locator');
  const selector = getSelector(path);
  if (!selector) return null;
  return page.locator(selector);
}

module.exports = {
  get,
  getSelector,
  getLocator,
};
