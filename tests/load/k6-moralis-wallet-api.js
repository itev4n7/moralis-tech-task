/** Bonus task */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { open, SeekMode } from 'k6/experimental/fs';

const requestDuration = 'p(90)<500';
const requestFailureRate = 'rate<0.01';

const WALLET_ADDRESS = '0x9659Bd1c6E89f9fd77d62e93a2192b97452bA823';
const CHAIN = 'eth';

let jsonWithToken;
(async function () {
  jsonWithToken = await open('../../playwright/moralis-api-tokens.json');
})();

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: [requestDuration],
    http_req_failed: [requestFailureRate],
  },
};

async function readAllAndReturnContent(file) {
  await file.seek(0, SeekMode.Start); // NOTE: without this line k6 cannot read the file and returns "null", no idea why
  const fileInfo = await file.stat();
  const buffer = new Uint8Array(fileInfo.size);
  const bytesRead = await file.read(buffer);
  if (bytesRead !== fileInfo.size) {
    throw new Error(`unexpected number of bytes read; expected ${fileInfo.size} but got ${bytesRead} bytes`);
  }
  return String.fromCharCode.apply(null, buffer);
}

const responseTimeTrend = new Trend('response_time_trend');
const errorRate = new Rate('request_error_rate');

export default async function () {
  const moralisAPIToken = JSON.parse(await readAllAndReturnContent(jsonWithToken)).moralisAPIToken;
  const baseURL = `https://deep-index.moralis.io/api/v2.2/${WALLET_ADDRESS}/nft?chain=${CHAIN}&format=decimal&media_items=false`;
  const params = {
    headers: {
      accept: 'application/json',
      'X-API-Key': moralisAPIToken,
    },
  };
  const response = http.get(baseURL, params);
  check(response, {
    'status is 200': res => res.status === 200,
  });
  responseTimeTrend.add(response.timings.duration);
  errorRate.add(response.status >= 400);
  const responseBody = JSON.parse(response.body);
  if (responseBody.message !== 'Rate limit exceeded.') {
    check(responseBody, {
      'response has page_size': body => body.page_size !== undefined,
      'response has token_id': body => body.result[0].token_id !== undefined,
      'response has token_address': body => body.result[0].token_address !== undefined,
      'response has contract_type': body => body.result[0].contract_type !== undefined,
      'response has name': body => body.result[0].name !== undefined,
      'response has symbol': body => body.result[0].symbol !== undefined,
      'response has token_uri': body => body.result[0].token_uri !== undefined,
    });
  }
  sleep(5);
}
