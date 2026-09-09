import { test as base } from './auth.fixture';
import { NavigationComponent } from '../pages/components/NavigationComponent';
import { FormComponent } from '../pages/components/FormComponent';

type ComponentFixtures = {
  nav: NavigationComponent;
  form: FormComponent;
};

export const test = base.extend<ComponentFixtures>({
  nav: async ({ authenticatedPage }, use) => {
    await use(new NavigationComponent(authenticatedPage));
  },
  form: async ({ authenticatedPage }, use) => {
    await use(new FormComponent(authenticatedPage));
  },
});

export const expect = test.expect;