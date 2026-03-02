Playwright BDD JavaScript Scaffold

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npm run install:browsers
```

3. Run the BDD features:

```bash
npm run test:features
```

Files added:
- `package.json` — scripts and dependencies
- `cucumber.js` — cucumber config
- `features/example.feature` — sample feature
- `steps/world.js` — Playwright lifecycle hooks
- `steps/example.steps.js` — step definitions

Additional structure:

- `pages/` — Page Object Model classes (e.g. `pages/examplePage.js`)
- `locators/` — centralized selectors
- `testdata/` — JSON test data files

Let me know if you want TypeScript, a CI workflow, or integration with `@playwright/test` runner.
