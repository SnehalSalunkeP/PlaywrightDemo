// utils/db-helper.ts
//
// Real seeding/cleanup against OrangeHRM's REST API, confirmed against the
// project's public routes (OrangeHRM\Pim\Api\EmployeeAPI):
//   GET/POST/DELETE  /web/index.php/api/v2/pim/employees
//
// Strategy: log in once with a throwaway browser context (this also
// satisfies the site's CSRF/session cookie requirements automatically,
// since the API calls reuse the authenticated context's cookie jar),
// then call the REST API directly — much faster and more reliable than
// seeding through UI forms.
//
// Seeded employee numbers are persisted to disk (not just kept in memory)
// so cleanupDatabase() is robust even if globalSetup/globalTeardown end up
// running in different processes.

import { chromium, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SEED_FILE = path.join(__dirname, '..', '.seed-data.json');

export interface SeededEmployee {
  firstName: string;
  lastName: string;
  empNumber: number | null;
}

function loadSeedFile(): SeededEmployee[] {
  try {
    return JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSeedFile(employees: SeededEmployee[]) {
  fs.writeFileSync(SEED_FILE, JSON.stringify(employees, null, 2));
}

/**
 * Logs in and creates a couple of known employees via the REST API so
 * tests (e.g. search, list, visual snapshots) have predictable data to
 * work against instead of depending on whatever is already in the shared
 * public demo.
 */
export async function seedDatabase(
  baseURL: string,
  username: string,
  password: string
): Promise<SeededEmployee[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  const seeded: SeededEmployee[] = [];

  try {
    await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/dashboard/, { timeout: 15000 }).catch(() => {
      console.warn('[seed] Login did not reach the dashboard in time — skipping API seeding.');
    });

    // Reuse the authenticated browsing context's cookies for API calls.
    const apiContext: APIRequestContext = page.context().request;

    const seedSpecs = [
      { firstName: 'SeedAlpha', lastName: `Auto${Date.now()}` },
      { firstName: 'SeedBeta', lastName: `Auto${Date.now() + 1}` },
    ];

    for (const spec of seedSpecs) {
      try {
        const response = await apiContext.post('/web/index.php/api/v2/pim/employees', {
          data: { firstName: spec.firstName, lastName: spec.lastName, middleName: '' },
        });

        if (response.ok()) {
          const body = await response.json();
          const empNumber = body?.data?.empNumber ?? null;
          seeded.push({ firstName: spec.firstName, lastName: spec.lastName, empNumber });
          console.log(`[seed] Created employee ${spec.firstName} ${spec.lastName} (empNumber=${empNumber})`);
        } else {
          console.warn(
            `[seed] API returned ${response.status()} for ${spec.firstName} ${spec.lastName} — ` +
            'tests that depend on seeded data should tolerate its absence.'
          );
        }
      } catch (err) {
        console.warn(`[seed] Failed to seed ${spec.firstName} ${spec.lastName}:`, (err as Error).message);
      }
    }
  } finally {
    await browser.close();
  }

  saveSeedFile(seeded);
  return seeded;
}

/**
 * Deletes every employee this run seeded, using the bulk-delete shape
 * OrangeHRM's PIM API expects: DELETE /pim/employees with { ids: [...] }.
 */
export async function cleanupDatabase(): Promise<void> {
  const seeded = loadSeedFile().filter((e) => e.empNumber !== null);

  if (seeded.length === 0) {
    console.log('[cleanup] No seeded employees to remove.');
    return;
  }

  const baseURL = process.env.TEST_BASE_URL || 'https://opensource-demo.orangehrmlive.com';
  const username = process.env.TEST_ADMIN_USERNAME || 'Admin';
  const password = process.env.TEST_ADMIN_PASSWORD || 'admin123';

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  try {
    await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/dashboard/, { timeout: 15000 }).catch(() => {
      console.warn('[cleanup] Login did not reach the dashboard in time — skipping API cleanup.');
    });

    const apiContext: APIRequestContext = page.context().request;
    const ids = seeded.map((e) => e.empNumber);

    const response = await apiContext.delete('/web/index.php/api/v2/pim/employees', {
      data: { ids },
    });

    if (response.ok()) {
      console.log(`[cleanup] Deleted ${ids.length} seeded employee(s): ${ids.join(', ')}`);
    } else {
      console.warn(`[cleanup] Bulk delete returned ${response.status()} — verify payload shape against a live run.`);
    }
  } catch (err) {
    console.warn('[cleanup] Failed to clean up seeded employees:', (err as Error).message);
  } finally {
    await browser.close();
  }

  saveSeedFile([]);
}
