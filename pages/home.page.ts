import { Page, PlaywrightTestArgs } from 'playwright/test';
import { HomeLocators } from './locators/home.locators';
import { SideMenuComponent } from './components/side-menu.component';
import { expect } from 'common/fixtures';
import { HTML_ATTRIBUTES } from 'common/constants';

export const homePage = {
  homePage: async ({ page }: PlaywrightTestArgs, use: (r: HomePage) => void) => {
    use(new HomePage(page));
  },
};

export class HomePage extends HomeLocators {
  readonly sideMenu;

  constructor(page: Page) {
    super(page);
    this.sideMenu = new SideMenuComponent(page);
  }

  async verifyPageIsDownloaded() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * @returns The Moralis API key as string
   */
  async returnMoralisAPIToken() {
    await expect(this.apiKeyInput).toBeVisible();
    await this.showAPIKeyButton.click();
    const moralisAPIToken = await this.apiKeyInput.getAttribute(HTML_ATTRIBUTES.value);
    if (moralisAPIToken) {
      return moralisAPIToken;
    } else {
      throw new Error('No API key on "value" attribute');
    }
  }
}
