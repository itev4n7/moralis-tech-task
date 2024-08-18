import { Page } from 'playwright/test';

export abstract class BaseLocators {
  readonly page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract verifyPageIsDownloaded(): Promise<void>;
}
