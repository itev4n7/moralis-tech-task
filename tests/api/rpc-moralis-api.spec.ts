/** Task 1 */
import { getHeadersAndBodyForNodeAPI, verifyHeadersHasNoSensitiveData } from 'common/api-utils';
import { HTTP_STATUSES, MORALIS_NODE_API_REQUEST, PROTOCOL_NETWORKS, PROTOCOLS } from 'common/constants';
import { test, expect } from 'common/fixtures';

const ethTestnetRPCNodeData = {
  protocol: PROTOCOLS.ethereum,
  network: PROTOCOL_NETWORKS[PROTOCOLS.ethereum].sepolia,
};

test.describe('RPC Node API calls', { tag: '@api' }, () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let rpcNodeURL: string;

  test.beforeEach(async function ({ moralisAdminApp }, testInfo) {
    if (!testInfo.tags.includes('@pre-skip')) {
      await moralisAdminApp.goToApp();
      await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
      await moralisAdminApp.nodesPage.sideMenu.goToNodesPage();
      await moralisAdminApp.nodesPage.verifyPageIsDownloaded();
      await moralisAdminApp.nodesPage.createNewRPCNode(ethTestnetRPCNodeData.protocol, ethTestnetRPCNodeData.network);
      rpcNodeURL = (await moralisAdminApp.nodesPage.getNodeSiteOneURLs(ethTestnetRPCNodeData.protocol)).find(url =>
        url.includes('sepolia'),
      )!;
    }
  });

  test('POST eth_blockNumber 200', async function ({ request }) {
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethBlockNumber);
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.ok_200);
    const body = await response.json();
    expect(body.jsonrpc).toEqual('2.0');
    expect(body.id).toEqual(1);
    expect(body.result).toMatch(/0x.*/);
  });

  test.fail('POST eth_blockNumber 400 with missing required fields', async function ({ request }) {
    const options = {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      data: {
        method: MORALIS_NODE_API_REQUEST.ethBlockNumber,
      },
    };
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.badRequest_400);
  });

  test('POST eth_blockNumber 401 with invalid node API key', { tag: '@pre-skip' }, async function ({ request }) {
    const urlWithWrongNodeAPIKey = 'https://site1.moralis-nodes.com/sepolia/d187f7d53826468585706c76f5f71a45';
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethBlockNumber);
    const response = await request.post(urlWithWrongNodeAPIKey, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.unauthorized_401);
  });

  test('POST eth_getBlockByNumber 200 by block number', async function ({ request }) {
    const getBlockOptions = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethBlockNumber);
    const getBlockResponse = await request.post(rpcNodeURL, getBlockOptions);
    expect(getBlockResponse.status()).toEqual(HTTP_STATUSES.ok_200);
    const getBlockBody = await getBlockResponse.json();
    expect(getBlockBody.result).toMatch(/0x.*/);
    const blockNumber = getBlockBody.result;
    const blockParams = [blockNumber, true];
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetBlockByNumber, blockParams);
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.ok_200);
    const body = await response.json();
    expect(body.result.number).toBeDefined();
    expect(body.result.hash).toBeDefined();
    expect(body.result.nonce).toBeDefined();
    expect(body.result.transactions).toBeInstanceOf(Array);
    expect(body.result.transactions[0].blockNumber).toEqual(body.result.number);
  });

  test('POST eth_getBlockByNumber 200 by latest parameter', async function ({ request }) {
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetBlockByNumber, ['latest', true]);
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.ok_200);
    const body = await response.json();
    expect(body.result.number).toBeDefined();
    expect(body.result.hash).toBeDefined();
    expect(body.result.nonce).toBeDefined();
    expect(body.result.transactions).toBeInstanceOf(Array);
    expect(body.result.transactions[0].blockNumber).toEqual(body.result.number);
  });

  test('POST eth_getBlockByNumber 401 with invalid node API key', { tag: '@pre-skip' }, async function ({ request }) {
    const urlWithWrongNodeAPIKey = 'https://site1.moralis-nodes.com/sepolia/d147f7d53266468585706f76d5t71a78';
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetBlockByNumber, ['latest', true]);
    const response = await request.post(urlWithWrongNodeAPIKey, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.unauthorized_401);
    const body = await response.json();
    expect(body.message).toContain('Token is invalid format');
  });

  test('POST eth_getTransactionByHash 200', async function ({ request }) {
    const getBlockParams = ['latest', true];
    const getBlockOptions = await getHeadersAndBodyForNodeAPI(
      MORALIS_NODE_API_REQUEST.ethGetBlockByNumber,
      getBlockParams,
    );
    const getBlockResponse = await request.post(rpcNodeURL, getBlockOptions);
    expect(getBlockResponse.status()).toEqual(HTTP_STATUSES.ok_200);
    const getBlockBody = await getBlockResponse.json();
    const txHash = getBlockBody.result.transactions[0].hash;
    const txBlockNum = getBlockBody.result.transactions[0].blockNumber;
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetTransactionByHash, [txHash]);
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.ok_200);
    const body = await response.json();
    expect(body.result.hash).toEqual(txHash);
    expect(body.result.blockNumber).toEqual(txBlockNum);
    expect(body.result.chainId).toBeDefined();
    expect(body.result.from).toBeDefined();
    expect(body.result.to).toBeDefined();
  });

  test.fail('POST eth_getTransactionByHash 400 with invalid txHash', async function ({ request }) {
    const txHash = '0xinvalid';
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetTransactionByHash, [txHash]);
    const response = await request.post(rpcNodeURL, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.badRequest_400);
    const body = await response.json();
    expect(body.error.message).toContain('invalid argument 0');
  });

  test('POST eth_getTransactionByHash 401 with invalid API key', { tag: '@pre-skip' }, async function ({ request }) {
    const urlWithWrongNodeAPIKey = 'https://site1.moralis-nodes.com/sepolia/d147f7d53277368458716f76d5t71t59';
    const txHash = '0xd4b2e80202cc55517c328412a7792772e1bdd925ac1a2120aeafe84316206ad3';
    const options = await getHeadersAndBodyForNodeAPI(MORALIS_NODE_API_REQUEST.ethGetTransactionByHash, [txHash]);
    const response = await request.post(urlWithWrongNodeAPIKey, options);
    const headers = response.headers();
    await verifyHeadersHasNoSensitiveData(headers);
    expect(response.status()).toEqual(HTTP_STATUSES.unauthorized_401);
    const body = await response.json();
    expect(body.message).toContain('Token is invalid format');
  });

  test.afterEach(async function ({ moralisAdminApp }) {
    await moralisAdminApp.nodesPage.api.deleteAllRPCNodes();
  });
});
