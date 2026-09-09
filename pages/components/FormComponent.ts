import { Page, Locator, expect } from '@playwright/test';

export class FormComponent {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  /**
   * Finds the input/textarea inside the field group that contains the given label text.
   */
  private fieldByLabel(labelText: string): Locator {
    return this.page
      .locator('.oxd-input-group', { hasText: labelText })
      .locator('input, textarea');
  }

  async fillField(labelText: string, value: string) {
    await this.fieldByLabel(labelText).fill(value);
  }

  async fillFields(fields: Record<string, string>) {
    for (const [label, value] of Object.entries(fields)) {
      await this.fillField(label, value);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectSuccessMessage() {
    await expect(this.page.getByText('Successfully Saved')).toBeVisible();
  }
}