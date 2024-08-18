import { test as base } from 'playwright/test';
import { moralisAdminApp, MoralisAdminApp } from 'compositor/moralis-admin.compositor';
import { LoginPage, loginPage } from 'pages/login.page';
import { NodesPage, nodesPage } from 'pages/nodes.page';
import { HomePage, homePage } from 'pages/home.page';

/** Type for playwright page fixtures (add new type of page below) */
type PageFixturesType = {
  moralisAdminApp: MoralisAdminApp;
  loginPage: LoginPage;
  homePage: HomePage;
  nodesPage: NodesPage;
};

/** Fixtures for playwright use (spread newly added page into fixture below) */
const pageFixtures = {
  ...moralisAdminApp,
  ...loginPage,
  ...homePage,
  ...nodesPage,
};

export const test = base.extend<PageFixturesType>(pageFixtures);
export const expect = test.expect;
