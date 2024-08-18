import { expect } from 'common/fixtures';
import { Page } from 'playwright/test';

export class SideMenuComponent {
  readonly page;
  readonly moralisLogo;
  readonly nodesButton;
  readonly collapseSideMenuButton;
  readonly expandSideMenuButton;

  constructor(page: Page) {
    this.page = page;
    this.moralisLogo = page.locator('//img[contains(@src,"/assets/moralisLogo")]');
    this.nodesButton = page.locator('//div[contains(@class,"navNavTop")]//a[@href="/nodes"]');
    this.collapseSideMenuButton = page.locator('//img[contains(@src,"/assets/moralisLogo")]/following-sibling::button');
    this.expandSideMenuButton = page.locator('//img[contains(@src,"data:image")]/following-sibling::button');
  }

  /** Component methods below */

  async goToNodesPage() {
    if ((await this.moralisLogo.count()) === 0) {
      this.expandSideMenuButton.click();
    }
    await expect(this.moralisLogo).toBeVisible();
    await this.nodesButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
