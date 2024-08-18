/** Task 1 */
import { test, expect } from 'common/fixtures';
import { HTTP_STATUSES, MORALIS_NODE_API_REQUEST, PROTOCOL_NETWORKS, PROTOCOLS } from 'common/constants';
import { getHeadersAndBodyForNodeAPI } from 'common/api-utils';

test.describe('RPC Moralis Node', { tag: '@e2e' }, () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async function ({ moralisAdminApp }) {
    await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
  });

  test('E2E test to create RPC node make request and delete node', async function ({ request, moralisAdminApp }) {
    const baseTestnetRPCNodeData = {
      protocol: PROTOCOLS.base,
      network: PROTOCOL_NETWORKS[PROTOCOLS.base].sepolia,
    };
    await moralisAdminApp.goToApp();
    await moralisAdminApp.homePage.sideMenu.goToNodesPage();
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
    await moralisAdminApp.nodesPage.createNewRPCNode(baseTestnetRPCNodeData.protocol, baseTestnetRPCNodeData.network);

    const rpcNodeSiteOneURL = (
      await moralisAdminApp.nodesPage.getNodeSiteOneURLs(baseTestnetRPCNodeData.protocol)
    ).find(url => url.includes('sepolia'))!;
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethBlockNumber);
    const responseSiteOneURL = await request.post(rpcNodeSiteOneURL, options);
    expect(responseSiteOneURL.status()).toEqual(HTTP_STATUSES.ok_200);

    const rpcNodeSiteTwoURL = (
      await moralisAdminApp.nodesPage.getNodeSiteOneURLs(baseTestnetRPCNodeData.protocol)
    ).find(url => url.includes('sepolia'))!;
    const responseSiteTwoURL = await request.post(rpcNodeSiteTwoURL, options);
    expect(responseSiteTwoURL.status()).toEqual(HTTP_STATUSES.ok_200);

    await moralisAdminApp.nodesPage.deleteRPCNode(baseTestnetRPCNodeData.protocol);
    await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
  });

  test.afterEach(async function ({ moralisAdminApp }) {
    await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
  });
});
