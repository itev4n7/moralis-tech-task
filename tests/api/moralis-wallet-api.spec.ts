/** Task 2 */
import { verifyHeadersHasNoSensitiveData } from 'common/api-utils';
import { HTTP_STATUSES } from 'common/constants';
import { test, expect } from 'common/fixtures';
import { getMoralisAPIKeyFromJson } from 'common/utils';

const WALLET_ADDRESS = '0x9659Bd1c6E89f9fd77d62e93a2192b97452bA823';

test.describe('Moralis NFT API calls', { tag: '@api' }, () => {
  test('GET `Get NFTs by wallet` 200', async function ({ request }) {
    const moralisAPIToken = await getMoralisAPIKeyFromJson();
    const options = {
      headers: {
        accept: 'application/json',
        'X-API-Key': moralisAPIToken,
      },
      data: {
        chain: 'eth',
        format: 'decimal',
        media_items: false,
      },
    };
    const url = `https://deep-index.moralis.io/api/v2.2/${WALLET_ADDRESS}/nft`;
    const response = await request.get(url, options);
    const headers = response.headers();
    const data = await response.json();
    expect(response.status()).toEqual(HTTP_STATUSES.ok_200);
    await verifyHeadersHasNoSensitiveData(headers);
    expect(data.result).toBeInstanceOf(Array);
    expect(data.result[0].token_id).toBeDefined();
    expect(data.result[0].token_address).toBeDefined();
    expect(data.result[0].contract_type).toBeDefined();
    expect(data.result[0].name).toBeDefined();
    expect(data.result[0].symbol).toBeDefined();
    expect(data.result[0].token_uri).toBeDefined();
  });

  test('GET `Get NFTs by wallet` 400 with invalid wallet address', async function ({ request }) {
    const moralisAPIToken = await getMoralisAPIKeyFromJson();
    const invalidWalletAddress = '0xinvalid';
    const options = {
      headers: {
        accept: 'application/json',
        'X-API-Key': moralisAPIToken,
      },
      data: {
        chain: 'eth',
        format: 'decimal',
        media_items: false,
      },
    };
    const url = `https://deep-index.moralis.io/api/v2.2/${invalidWalletAddress}/nft`;
    const response = await request.get(url, options);
    const headers = response.headers();
    const data = await response.json();
    expect(response.status()).toEqual(HTTP_STATUSES.badRequest_400);
    await verifyHeadersHasNoSensitiveData(headers);
    expect(data.message).toEqual(`address with value '${invalidWalletAddress}' is not a valid hex address`);
  });

  test('GET `Get NFTs by wallet` 401 with invalid moralis API token', async function ({ request }) {
    const invalidWalletAddress = '0xinvalid';
    const options = {
      headers: {
        accept: 'application/json',
        'X-API-Key': 'invalid_token',
      },
      data: {
        chain: 'eth',
        format: 'decimal',
        media_items: false,
      },
    };
    const url = `https://deep-index.moralis.io/api/v2.2/${invalidWalletAddress}/nft`;
    const response = await request.get(url, options);
    const headers = response.headers();
    const data = await response.json();
    expect(response.status()).toEqual(HTTP_STATUSES.unauthorized_401);
    await verifyHeadersHasNoSensitiveData(headers);
    expect(data.message).toEqual('Token is invalid format');
  });

  test('GET `Get NFTs by wallet` 404 with invalid endpoint', async function ({ request }) {
    const moralisAPIToken = await getMoralisAPIKeyFromJson();
    const options = {
      headers: {
        accept: 'application/json',
        'X-API-Key': moralisAPIToken,
      },
      data: {
        chain: 'eth',
        format: 'decimal',
        media_items: false,
      },
    };
    const url = `https://deep-index.moralis.io/api/v2.2/${WALLET_ADDRESS}/nfts`;
    const response = await request.get(url, options);
    const headers = response.headers();
    expect(response.status()).toEqual(HTTP_STATUSES.notFound_404);
    await verifyHeadersHasNoSensitiveData(headers);
  });
});
