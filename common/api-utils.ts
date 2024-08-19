import { AUTH_FILE } from './constants';
import fs from 'fs/promises';
import { NodeAPIRequest, APIHeaders } from './types';
import { expect } from './fixtures';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
let lazyAuthToken: any = undefined;
export async function getAuthToken() {
  if (lazyAuthToken === undefined) {
    try {
      const fileContent = await fs.readFile(AUTH_FILE, 'utf8');
      const data = JSON.parse(fileContent);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const moralisOrigin = data.origins.find((origin: any) => origin.origin === 'https://admin.moralis.io');
      if (moralisOrigin) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authStore = moralisOrigin.localStorage.find((entry: any) => entry.name === 'authStore');
        if (authStore) {
          const authData = JSON.parse(authStore.value);
          const token = authData.state.token;
          lazyAuthToken = token;
          return token;
        } else {
          throw new Error('The "authStore" not found in "localStorage"');
        }
      } else {
        throw new Error('Origin "https://admin.moralis.io" not found');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return lazyAuthToken;
}

export async function getAuthHeaderOptions() {
  return {
    headers: {
      Authorization: `Bearer ${await getAuthToken()}`,
    },
  };
}

export async function verifyHeadersHasNoSensitiveData(headers: APIHeaders) {
  expect(headers['x-api-key'], 'Security issue!!!').toBeUndefined();
  expect(headers.authorization, 'Security issue!!!').toBeUndefined();
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getHeadersAndBodyForNodeAPI(method: NodeAPIRequest, params?: any[]) {
  return {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    },
  };
}
