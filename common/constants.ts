import { env } from './env-config';
import { Credentials } from './types';

/** Global constnats */

export const BASE_URL = 'https://admin.moralis.io/' as const;

export const API_DASHBOARD_BASE_URL = 'https://api.dashboard.moralis.io' as const;

export const AUTH_FILE = 'playwright/.auth/user.json' as const;

export const MORALIS_API_FILE = 'playwright/moralis-api-tokens.json' as const;

export const ADMIN_CREDENTIALS: Credentials = {
  email: env.ADMIN_EMAIL,
  password: env.ADMIN_PASSWORD,
} as const;

export enum PROTOCOLS {
  ethereum = 'Ethereum',
  base = 'Base',
}

export const PROTOCOL_NETWORKS = {
  [PROTOCOLS.ethereum]: {
    mainnet: '0x1-Mainnet',
    sepolia: '0xaa36a7-Sepolia',
    holesky: '0x4268-Holesky',
  },
  [PROTOCOLS.base]: {
    mainnet: '0x2105-Mainnet',
    sepolia: '0x14a34-Sepolia',
  },
} as const;

export enum SYMBOLS {
  space = ' ',
  dash = '-',
}

export enum HTML_ATTRIBUTES {
  ariaExpanded = 'aria-expanded',
  value = 'value',
}

export enum HTTP_STATUSES {
  ok_200 = 200,
  created_201 = 201,
  mulChoices_300 = 300,
  badRequest_400 = 400,
  unauthorized_401 = 401,
  forbidden_403 = 403,
  notFound_404 = 404,
  serverError_500 = 500,
}

export enum MORALIS_NODE_API_REQUEST {
  ethBlockNumber = 'eth_blockNumber',
  ethGetBlockByNumber = 'eth_getBlockByNumber',
  ethGetTransactionByHash = 'eth_getTransactionByHash',
}
