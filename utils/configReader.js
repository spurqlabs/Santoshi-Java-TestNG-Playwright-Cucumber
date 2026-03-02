/**
 * Config reader for testdata/config/config.json
 * Exports convenience helpers for common config values.
 */
const config = require('../config/config.json');

function resolvePath(root, path) {
  if (!path) return root;
  const parts = path.split('.');
  let node = root;
  for (const p of parts) {
    if (node && Object.prototype.hasOwnProperty.call(node, p)) {
      node = node[p];
    } else {
      return null;
    }
  }
  return node === undefined ? null : node;
}

function get(path) {
  return resolvePath(config, path);
}

function getEnv() {
  return config.environment || null;
}

function getAppUrl() {
  return resolvePath(config, 'application.url');
}

function getBrowserConfig() {
  return config.browser || null;
}

function getTimeout(key) {
  if (!key) return config.timeouts || null;
  return resolvePath(config, `timeouts.${key}`);
}

function isParallelEnabled() {
  return !!(config.parallel && config.parallel.enabled);
}

module.exports = {
  get,
  getEnv,
  getAppUrl,
  getBrowserConfig,
  getTimeout,
  isParallelEnabled,
};
