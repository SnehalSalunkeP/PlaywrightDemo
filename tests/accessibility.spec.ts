import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures';

test('Dashboard Accessibility',async ({ page }) => {

const results =await new AxeBuilder({page}).analyze();

expect(results.violations).toEqual([]);

});