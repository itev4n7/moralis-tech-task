import { Page } from 'playwright/test';
import { BaseLocators } from './base.locators';

export abstract class NodesLocators extends BaseLocators {
  readonly pageTitle;
  readonly createNewNodeButton;
  readonly createNodeModal;
  readonly selectProtocolDropdown;
  readonly selectNetworkDropdown;
  readonly nodeInformationTitle;
  readonly submitCreateNodeButton;
  readonly deleteNodeModal;
  readonly submitDeleteNodeButton;
  readonly cancelDeleteNodeButton;
  readonly fetchingSpinner;
  readonly errorMessagePopup;
  readonly nodeAPIKeyModal;
  readonly nodeAPIKeyInput;
  readonly closeNodeAPIKeyModalButton;
  readonly siteOneURLInput;
  readonly siteTwoURLInput;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('//h1[@data-testid="test-typography"]');
    this.createNewNodeButton = page.locator(
      '//button[@data-testid="mui-button-primary" and contains(.,"Create a New Node")]',
    );
    this.createNodeModal = page.locator('//div[@data-testid="mui-modal" and contains(.,"Start creating your node")]');
    this.selectProtocolDropdown = page.locator('#select-protoccol');
    this.selectNetworkDropdown = page.locator('#select-network');
    this.nodeInformationTitle = page.locator('//h4[@class="headline-h4" and contains(.,"Node information")]');
    this.submitCreateNodeButton = page.locator('//footer//button[@data-testid="mui-button-primary"]');
    this.deleteNodeModal = page.locator('//div[@data-testid="mui-modal" and contains(.,"Delete this Node?")]');
    this.submitDeleteNodeButton = page.locator('//button[@data-testid="mui-button-destructive"]');
    this.cancelDeleteNodeButton = page.locator(
      '//div[@data-testid="mui-modal" and contains(.,"Delete this Node?")]//button[text()="Cancel"]',
    );
    this.fetchingSpinner = page.locator('//section[@role="alert" and contains(.,"Fetching your Nodes")]');
    this.errorMessagePopup = page.locator('[data-testid="test-notification-message"]');
    this.nodeAPIKeyModal = page.locator('//div[@data-testid="mui-modal" and contains(.,"Node API Key")]');
    this.nodeAPIKeyInput = page.locator(
      '//div[@data-testid="mui-modal" and contains(.,"Node API Key")]//input[@type="text"]',
    );
    this.closeNodeAPIKeyModalButton = page.locator(
      '//div[@data-testid="mui-modal" and contains(.,"Node API Key")]//*[contains(@data-icon,"xmark")]',
    );
    this.siteOneURLInput = page.locator('//input[contains(@value,"site1.moralis-nodes.com")]');
    this.siteTwoURLInput = page.locator('//input[contains(@value,"site2.moralis-nodes.com")]');
  }

  nodeExpandButtonByNetworkName(networkName: string) {
    return this.page.locator('//button[@data-style="accordion-button"]', { hasText: networkName });
  }

  nodesCountTextByNetworkName(networkName: string) {
    return this.page
      .locator('//button//span[@id="control-string"]', { hasText: networkName })
      .locator('//following-sibling::p');
  }

  deleteNodeButtonByNetworkName(networkName: string) {
    return this.page.locator(
      `//*[@data-testid="mui-accordion" and contains(.,"${networkName}")]//button//*[@data-icon="trash"]`,
    );
  }

  openModalWithAPIKeyButton(networkName: string) {
    return this.page.locator(`
      //*[@data-testid="mui-accordion" and contains(.,"${networkName}")]//button//*[@data-icon="key-skeleton"]
      `);
  }
}
