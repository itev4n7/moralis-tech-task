import { Page, PlaywrightTestArgs } from 'playwright/test';
import { expect } from 'common/fixtures';
import { LoginLocators } from './locators/login.locators';
import { Credentials } from 'common/types';
import { actionWithDelay } from 'common/utils';
import { AUTH_FILE } from 'common/constants';

export const loginPage = {
  loginPage: async ({ page }: PlaywrightTestArgs, use: (r: LoginPage) => void) => {
    use(new LoginPage(page));
  },
};

export class LoginPage extends LoginLocators {
  constructor(page: Page) {
    super(page);
  }

  async verifyPageIsDownloaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Sign in method that bypass reCaptcha due to action delay */
  async signInIntoAdminApp(credentials: Credentials) {
    await this.page.goto('/');
    await this.verifyPageIsDownloaded();
    await actionWithDelay(async () => await this.acceptAllCookiesButton.click());
    await actionWithDelay(async () => await this.page.mouse.wheel(0, 300));
    await actionWithDelay(async () => await this.emailInput.fill(credentials.email));
    await actionWithDelay(async () => await this.passwordInput.fill(credentials.password));
    await actionWithDelay(async () => await expect(this.signInButton).toBeEnabled());
    await actionWithDelay(async () => await this.signInButton.click());
    await actionWithDelay(async () => await this.page.waitForURL('https://admin.moralis.io'));
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.context().storageState({ path: AUTH_FILE });
  }
}
