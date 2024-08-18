import { MORALIS_API_FILE, SYMBOLS } from './constants';
import { MoralisAPITokens, ProtocolNetworkUnion, ProtocolUnion } from './types';
import fs from 'fs/promises';

export async function actionWithDelay(action: () => Promise<void>, delay: number = 4000) {
  await new Promise(resolve => setTimeout(resolve, delay));
  await action();
}

export async function getSiteURLNetworkPath(protocol: ProtocolUnion, network: ProtocolNetworkUnion) {
  const networkType = network.split(SYMBOLS.dash)[1];
  const networkPath = `${protocol.toLocaleLowerCase()}-${networkType.toLocaleLowerCase()}`;
  return networkPath;
}

/**
 * Returns Moralis API key as string from `MORALIS_API_FILE` path
 */
export async function getMoralisAPIKeyFromJson() {
  const fileContent = await fs.readFile(MORALIS_API_FILE, 'utf-8');
  const tokensObject: MoralisAPITokens = JSON.parse(fileContent);
  return tokensObject.moralisAPIToken;
}
