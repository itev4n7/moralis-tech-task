import { APIRequestContext, Page, PlaywrightTestArgs } from 'playwright/test';
import { NodesLocators } from './locators/nodes.locators';
import { SideMenuComponent } from './components/side-menu.component';
import { NodesAPIService } from './services/nodes.service';
import { ProtocolNetworkUnion, ProtocolUnion } from 'common/types';
import { expect } from 'common/fixtures';
import { HTML_ATTRIBUTES, PROTOCOL_NETWORKS, SYMBOLS } from 'common/constants';
import { logger } from 'loggers/logger';

export const nodesPage = {
  nodesPage: async ({ page, request }: PlaywrightTestArgs, use: (r: NodesPage) => void) => {
    use(new NodesPage(page, request));
  },
};

export class NodesPage extends NodesLocators {
  readonly sideMenu;
  readonly api;

  constructor(page: Page, request: APIRequestContext) {
    super(page);
    this.sideMenu = new SideMenuComponent(page);
    this.api = new NodesAPIService(request);
  }

  async verifyPageIsDownloaded() {
    await expect(this.pageTitle).toBeVisible();
    await this.fetchingSpinner.waitFor({ state: 'hidden' });
  }

  /** Creates a new Moralis RPC Node.
   * @param protocol - The protocol for which the RPC node is to be created (e.g., Ethereum, Base).
   * @param network - The network within the selected protocol (e.g., Mainnet, Testnet).
   * @throws {Error} If the specified network is not available within the selected protocol.
   */
  async createNewRPCNode(protocol: ProtocolUnion, network: ProtocolNetworkUnion) {
    logger.debug(`Starting creation of a new RPC node: Protocol = "${protocol}", Network = "${network}"`);
    if (!Object.values(PROTOCOL_NETWORKS[protocol]).includes(network)) {
      throw new Error(`The network "${network}" is not available in the "${protocol}" protocol!`);
    }
    let protocolNodesCount = undefined;
    if ((await this.nodeExpandButtonByNetworkName(protocol).count()) > 0) {
      protocolNodesCount = parseInt(
        (await this.nodesCountTextByNetworkName(protocol).textContent())?.split(SYMBOLS.space)[0]!,
      );
    }
    await this.createNewNodeButton.click();
    await expect(this.createNodeModal).toBeVisible();
    logger.debug('Create Node modal is visible');
    await this.selectProtocolDropdown.selectOption(protocol);
    logger.debug(`Protocol "${protocol}" selected`);
    await this.selectNetworkDropdown.selectOption(network);
    logger.debug(`Network "${network}" selected`);
    await expect(this.nodeInformationTitle).toBeVisible();
    logger.debug('Node Information title is visible');
    await this.submitCreateNodeButton.click();
    logger.debug('Submitted the creation of the new RPC node');
    await expect.soft(this.fetchingSpinner).toBeVisible();
    await expect(this.fetchingSpinner).toBeHidden();
    if (protocolNodesCount !== undefined) {
      const currentProtocolNodesCount = parseInt(
        (await this.nodesCountTextByNetworkName(protocol).textContent())?.split(SYMBOLS.space)[0]!,
      );
      logger.debug(`Verifying increased count of RPC nodes under "${protocol}" protocol`);
      expect(protocolNodesCount + 1).toEqual(currentProtocolNodesCount);
    } else {
      await expect(this.nodeExpandButtonByNetworkName(protocol)).toBeVisible();
    }
    logger.info('New RPC node has been successfully created');
  }

  /** Deletes a Moralis RPC Node under the specified protocol.
   * @param protocol - The protocol from which the RPC node should be removed (e.g., Ethereum, Base).
   * @param nodeIndex - The index of the RPC node to be removed within the specified protocol (default is '0').
   * */
  async deleteRPCNode(protocol: ProtocolUnion, nodeIndex: number = 0) {
    logger.debug(`Deleting RPC node in "${protocol}" protocol`);
    if ((await this.nodeExpandButtonByNetworkName(protocol).count()) === 0) {
      logger.info(`No RPC nodes found in "${protocol}" protocol`);
      return;
    }
    const protocolNodesCount = parseInt(
      (await this.nodesCountTextByNetworkName(protocol).textContent())?.split(SYMBOLS.space)[0]!,
    );
    const isExpanded = await this.nodeExpandButtonByNetworkName(protocol).getAttribute(HTML_ATTRIBUTES.ariaExpanded);
    if (!isExpanded) {
      await this.nodeExpandButtonByNetworkName(protocol).click();
      logger.debug(`The "${protocol}" protocol is expanded`);
    }
    await this.deleteNodeButtonByNetworkName(protocol).nth(nodeIndex).click();
    logger.debug(`Delete RPC node modal opened for node at index "${nodeIndex}" in "${protocol}" protocol`);
    await expect(this.deleteNodeModal).toBeVisible();
    await this.submitDeleteNodeButton.click();
    await expect.soft(this.fetchingSpinner).toBeVisible();
    await expect(this.fetchingSpinner).toBeHidden();
    if ((await this.nodeExpandButtonByNetworkName(protocol).count()) > 0) {
      const currentProtocolNodesCount = parseInt(
        (await this.nodesCountTextByNetworkName(protocol).textContent())?.split(SYMBOLS.space)[0]!,
      );
      logger.debug(`Verifying reduced count of RPC nodes under "${protocol}" protocol`);
      expect(protocolNodesCount - 1).toEqual(currentProtocolNodesCount);
    } else {
      await expect(this.nodeExpandButtonByNetworkName(protocol)).toBeHidden();
    }
    logger.info(`RPC node successfully deleted in "${protocol}" protocol`);
  }

  async vefifyNodeAPIKeyIsContainsInSiteURLs(protocol: ProtocolUnion) {
    const isExpanded = await this.nodeExpandButtonByNetworkName(protocol).getAttribute(HTML_ATTRIBUTES.ariaExpanded);
    if (!isExpanded) {
      await this.nodeExpandButtonByNetworkName(protocol).click();
      logger.debug(`The "${protocol}" protocol is expanded`);
    }
    await this.openModalWithAPIKeyButton(protocol).first().click();
    await expect(this.nodeAPIKeyModal).toBeVisible();
    const nodeAPIKey = await this.nodeAPIKeyInput.getAttribute(HTML_ATTRIBUTES.value);
    await this.closeNodeAPIKeyModalButton.click();
    await expect(this.nodeAPIKeyModal).toBeHidden();
    const site1URL = await this.siteOneURLInput.first().getAttribute(HTML_ATTRIBUTES.value);
    const site2URL = await this.siteTwoURLInput.first().getAttribute(HTML_ATTRIBUTES.value);
    expect(site1URL).toContain(nodeAPIKey);
    expect(site2URL).toContain(nodeAPIKey);
  }

  async getNodeSiteOneURLs(protocol: ProtocolUnion) {
    const isExpanded = await this.nodeExpandButtonByNetworkName(protocol).getAttribute(HTML_ATTRIBUTES.ariaExpanded);
    if (!isExpanded) {
      await this.nodeExpandButtonByNetworkName(protocol).click();
      logger.debug(`The "${protocol}" protocol is expanded`);
    }
    const nodeURLArray: string[] = [];
    if ((await this.siteOneURLInput.count()) > 1) {
      for (const siteOneURL of await this.siteOneURLInput.all()) {
        const siteURL = await siteOneURL.getAttribute(HTML_ATTRIBUTES.value);
        nodeURLArray.push(siteURL!);
      }
    } else {
      const siteURL = await this.siteOneURLInput.getAttribute(HTML_ATTRIBUTES.value);
      nodeURLArray.push(siteURL!);
    }
    return nodeURLArray;
  }

  async getNodeSiteTwoURLs(protocol: ProtocolUnion) {
    const isExpanded = await this.nodeExpandButtonByNetworkName(protocol).getAttribute(HTML_ATTRIBUTES.ariaExpanded);
    if (!isExpanded) {
      await this.nodeExpandButtonByNetworkName(protocol).click();
      logger.debug(`The "${protocol}" protocol is expanded`);
    }
    const nodeURLArray: string[] = [];
    if ((await this.siteTwoURLInput.count()) > 1) {
      for (const siteTwoURL of await this.siteTwoURLInput.all()) {
        const siteURL = await siteTwoURL.getAttribute(HTML_ATTRIBUTES.value);
        nodeURLArray.push(siteURL!);
      }
    } else {
      const siteURL = await this.siteTwoURLInput.getAttribute(HTML_ATTRIBUTES.value);
      nodeURLArray.push(siteURL!);
    }
    return nodeURLArray;
  }
}
