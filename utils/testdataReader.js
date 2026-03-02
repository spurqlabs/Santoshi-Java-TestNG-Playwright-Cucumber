/**
 * Test data reader for testdata/timesheetdata.json
 * Helpers: get(path), getScenario(idOrName), getTestData(idOrName), getField(idOrName, field)
 */
const data = require('../testdata/timesheetdata.json');

function resolvePath(root, path) {
  if (!path) return root;
  const parts = path.split('.');
  let node = root;
  for (let raw of parts) {
    if (raw === '') continue;
    // support bracket notation like items[0]
    const bracketMatch = raw.match(/^(\w+)\[(\d+)\]$/);
    if (bracketMatch) {
      const prop = bracketMatch[1];
      const idx = parseInt(bracketMatch[2], 10);
      node = node && node[prop];
      if (!Array.isArray(node)) return null;
      node = node[idx];
      continue;
    }
    // numeric part -> array index
    if (/^\d+$/.test(raw)) {
      const idx = parseInt(raw, 10);
      if (!Array.isArray(node)) return null;
      node = node[idx];
      continue;
    }
    node = node && node[raw];
    if (typeof node === 'undefined') return null;
  }
  return node === undefined ? null : node;
}

function get(path) {
  return resolvePath(data, path);
}

function getScenario(idOrName) {
  const list = data && data.scenarios;
  if (!Array.isArray(list)) return null;
  if (typeof idOrName === 'number') return list[idOrName] || null;
  // try numeric string
  if (typeof idOrName === 'string' && /^\d+$/.test(idOrName)) {
    return list[parseInt(idOrName, 10)] || null;
  }
  // otherwise match by scenarioName
  return list.find(s => s && s.scenarioName === idOrName) || null;
}

function getTestData(idOrName) {
  const scenario = getScenario(idOrName);
  return scenario ? scenario.testData || null : null;
}

function getField(idOrName, field) {
  const td = getTestData(idOrName);
  if (!td) return null;
  return td.hasOwnProperty(field) ? td[field] : null;
}

module.exports = {
  get,
  getScenario,
  getTestData,
  getField,
};
