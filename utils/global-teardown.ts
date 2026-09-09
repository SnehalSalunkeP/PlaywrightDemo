import { cleanupDatabase } from './db-helper';

/**
 * Runs once after every project has finished. Removes whatever
 * globalSetup's seedDatabase() created, keeping the shared public demo
 * environment clean between runs (data isolation).
 */
async function globalTeardown() {
  await cleanupDatabase();
}

export default globalTeardown;
