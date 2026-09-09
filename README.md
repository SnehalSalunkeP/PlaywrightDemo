# PlaywrightAdvance

Enterprise-style Playwright + TypeScript automation framework for the
[OrangeHRM demo](https://opensource-demo.orangehrmlive.com/), built for the
advanced Playwright assignment (custom fixtures, network interception,
visual testing, annotations/categorization, and multi-format reporting).

## Requirements
- Node.js v16+
- Git

## Setup
```bash
npm install
npx playwright install
cp .env.example .env   # fill in TEST_BASE_URL / TEST_ADMIN_USERNAME / TEST_ADMIN_PASSWORD if you don't want the defaults
```

## Running tests
```bash
npm test                    # full suite, all browsers
npm run test:smoke          # @smoke only — fast sanity pass
npm run test:regression     # @regression
npm run test:integration    # @integration (network + UI combined)
npm run test:visual         # @visual (screenshot/ARIA snapshots)
npm run test:update-snapshots  # regenerate visual baselines locally
npm run report               # open the last HTML report
npx playwright show-trace <path-to-trace.zip>   # inspect a captured trace
```

Run a single project (browser):
```bash
npx playwright test --project=chromium
```

## Structure
```
config/          # ENV, timeouts — single source of truth for settings
fixtures/        # test.extend chains: auth -> component -> merged index
pages/           # Page Object Model, incl. pages/components/ (nav, form)
tests/           # specs, plus tests/auth.setup.ts (the 'setup' project)
tests/smoke/     # small focused fixture smoke checks
test-data/       # static + generated employee fixtures
utils/           # global-setup/teardown, db-helper (API seeding), hooks, annotations
reports/         # html / json / junit output (generated)
```

## Key features implemented
- **Fixtures**: `authenticatedPage`/`authenticatedContext` (reused login
  session via `playwright/.auth/user.json`, created once by
  `tests/auth.setup.ts`'s `setup` project), plus `nav`/`form` component
  fixtures — see `fixtures/`.
- **Annotations & categorization**: `@smoke` / `@regression` / `@integration`
  tags; custom `priority` and `known-issue` annotations
  (`utils/annotations.ts`); `test.slow()` on the heaviest flow;
  environment-conditional `test.skip()` (`TEST_LANE=fast`).
- **Setup/teardown**: `globalSetup` seeds two employees via the OrangeHRM
  REST API (`utils/db-helper.ts`); `globalTeardown` deletes them again;
  per-file `beforeEach`/`afterEach` in `utils/hooks.ts`.
- **Network interception**: mocked employee list responses, captured/
  validated POST payloads, aborted/delayed requests, offline mode — see
  `tests/networkmock.spec.ts`.
- **Visual testing**: full-page and element screenshots, an ARIA snapshot
  of the sidebar, and a cross-browser (chromium/firefox/webkit) login-page
  comparison — see `tests/visualtest.spec.ts`.
- **Reporting**: HTML + JSON + JUnit reporters, trace retained on failure
  (`playwright.config.ts`).

## Notes for graders / future contributors
- Visual baselines aren't committed pre-generated — run
  `npm run test:update-snapshots` once locally after cloning, since fonts
  and rendering differ slightly by OS.
- `db-helper.ts` seeding/cleanup calls the live public demo's REST API;
  if OrangeHRM changes that API shape, seeding logs a warning and tests
  fall back to whatever data already exists rather than hard-failing.
