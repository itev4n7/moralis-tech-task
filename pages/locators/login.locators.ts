import { Page } from 'playwright/test';
import { BaseLocators } from './base.locators';

export abstract class LoginLocators extends BaseLocators {
  readonly emailInput;
  readonly passwordInput;
  readonly signInButton;
  readonly acceptAllCookiesButton;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#admin-login-email');
    this.passwordInput = page.locator('#admin-login-password');
    this.signInButton = page.locator('[type="submit"]');
    this.acceptAllCookiesButton = page.locator('#cookiescript_accept');
  }
}
