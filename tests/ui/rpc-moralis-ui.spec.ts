/** Task 1 */
import { test, expect } from 'common/fixtures';
import { PROTOCOL_NETWORKS, PROTOCOLS } from 'common/constants';

test.describe('RPC Moralis Node', { tag: '@ui' }, () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async function ({ moralisAdminApp }) {
    await moralisAdminApp.goToApp();
    await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
  });

  test('Check API key same as in the site URLs', async function ({ moralisAdminApp }) {
    const baseTestnetRPCNodeData = {
      protocol: PROTOCOLS.base,
      network: PROTOCOL_NETWORKS[PROTOCOLS.base].sepolia,
    };
    await moralisAdminApp.homePage.sideMenu.goToNodesPage();
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
    await moralisAdminApp.nodesPage.createNewRPCNode(baseTestnetRPCNodeData.protocol, baseTestnetRPCNodeData.network);
    await moralisAdminApp.nodesPage.vefifyNodeAPIKeyIsContainsInSiteURLs(baseTestnetRPCNodeData.protocol);
  });

  test('Check adding and removing several nodes inside a single network', async function ({ moralisAdminApp }) {
    const ethTestnetRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].sepolia,
    };
    const ethMainnetRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].mainnet,
    };
    await moralisAdminApp.homePage.sideMenu.goToNodesPage();
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
    await moralisAdminApp.nodesPage.createNewRPCNode(ethTestnetRPCNodeData.protocol, ethTestnetRPCNodeData.network);
    await moralisAdminApp.nodesPage.createNewRPCNode(ethMainnetRPCNodeData.protocol, ethMainnetRPCNodeData.network);
    await moralisAdminApp.nodesPage.deleteRPCNode(ethTestnetRPCNodeData.protocol);
    await moralisAdminApp.nodesPage.deleteRPCNode(ethMainnetRPCNodeData.protocol);
  });

  test('Check adding multi network nodes', async function ({ moralisAdminApp }) {
    const oneNodeInProtocolText = '1 Nodes';
    const ethTestnetRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].sepolia,
    };
    const baseTestnetRPCNodeData = {
      protocol: PROTOCOLS.base,
      network: PROTOCOL_NETWORKS[PROTOCOLS.base].sepolia,
    };
    await moralisAdminApp.homePage.sideMenu.goToNodesPage();
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
    await moralisAdminApp.nodesPage.createNewRPCNode(ethTestnetRPCNodeData.protocol, ethTestnetRPCNodeData.network);
    await moralisAdminApp.nodesPage.createNewRPCNode(baseTestnetRPCNodeData.protocol, baseTestnetRPCNodeData.network);
    await expect(moralisAdminApp.nodesPage.nodesCountTextByNetworkName(ethTestnetRPCNodeData.protocol)).toContainText(
      oneNodeInProtocolText,
    );
    await expect(moralisAdminApp.nodesPage.nodesCountTextByNetworkName(baseTestnetRPCNodeData.protocol)).toContainText(
      oneNodeInProtocolText,
    );
  });

  test('Check user with Free Plan cannot add more than 2 nodes', async function ({ moralisAdminApp }) {
    const errorMessage = 'Number of nodes allowed on plan reached. Upgrade to be able to create more nodes';
    const ethTestnetRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].sepolia,
    };
    const ethMainnetRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].mainnet,
    };
    const ethHoleskyRPCNodeData = {
      protocol: PROTOCOLS.ethereum,
      network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].holesky,
    };
    await moralisAdminApp.homePage.sideMenu.goToNodesPage();
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
    await moralisAdminApp.nodesPage.createNewRPCNode(ethTestnetRPCNodeData.protocol, ethTestnetRPCNodeData.network);
    await moralisAdminApp.nodesPage.createNewRPCNode(ethMainnetRPCNodeData.protocol, ethMainnetRPCNodeData.network);
    await expect(
      moralisAdminApp.nodesPage.createNewRPCNode(ethHoleskyRPCNodeData.protocol, ethHoleskyRPCNodeData.network),
    ).rejects.toThrow();
    await expect(moralisAdminApp.nodesPage.errorMessagePopup).toBeVisible();
    await expect(moralisAdminApp.nodesPage.errorMessagePopup).toContainText(errorMessage);
  });

  test.afterEach(async function ({ moralisAdminApp }) {
    await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
  });
});
