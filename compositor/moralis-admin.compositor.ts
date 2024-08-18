import { HomePage } from 'pages/home.page';
import { LoginPage } from 'pages/login.page';
import { NodesPage } from 'pages/nodes.page';
import { APIRequestContext, Page, PlaywrightTestArgs } from 'playwright/test';

export const moralisAdminApp = {
  moralisAdminApp: async ({ page, request }: PlaywrightTestArgs, use: (r: MoralisAdminApp) => void) => {
    use(new MoralisAdminApp(page, request));
  },
};

export class MoralisAdminApp {
  readonly loginPage;
  readonly homePage;
  readonly nodesPage;

  constructor(page: Page, request: APIRequestContext) {
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.nodesPage = new NodesPage(page, request);
  }

  async goToApp() {
    await this.loginPage.page.goto('/');
  }
}
