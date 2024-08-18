import { Page } from 'playwright/test';
import { BaseLocators } from './base.locators';

export abstract class HomeLocators extends BaseLocators {
  readonly apiKeyInput;
  readonly showAPIKeyButton;

  constructor(page: Page) {
    super(page);
    this.apiKeyInput = page.locator('//div[@data-testid="mui-card" and contains(.,"API Key")]//input[@readonly]');
    this.showAPIKeyButton = page.locator('//button[@aria-label="Hide"]');
  }
}
