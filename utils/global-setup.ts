import dotenv from 'dotenv';
dotenv.config();
import { FullConfig } from '@playwright/test';
import { seedDatabase } from './db-helper';
import { ENV } from '../config/environment';

/**
 * Runs once before any project (including the 'setup' project). Its only
 * job is data seeding — authentication/storage-state creation is handled
 * separately by tests/auth.setup.ts via the 'setup' project + project
 * `dependencies`, which is the pattern Playwright recommends and the one
 * every other fixture/project in this repo relies on. Keeping a single
 * place that owns storageState avoids two competing auth mechanisms.
 */
async function globalSetup(config: FullConfig) {
  await seedDatabase(ENV.BASE_URL, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
}

export default globalSetup;
