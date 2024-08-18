import { MORALIS_NODE_API_REQUEST, PROTOCOL_NETWORKS, PROTOCOLS } from './constants';

/** Union types below */

/** Protocols that available for Moralis RPC Node */
export type ProtocolUnion = `${PROTOCOLS}`;

export type NodeAPIRequest = `${MORALIS_NODE_API_REQUEST}`;

type Flatten<T> = T extends { [key: string]: infer U } ? U : never;
export type ProtocolNetworkUnion = Flatten<{
  [K in keyof typeof PROTOCOL_NETWORKS]: Flatten<(typeof PROTOCOL_NETWORKS)[K]>;
}>;

/** Regular types below */

export type Credentials = {
  email: string;
  password: string;
};

export type NodeAPIMetadata = {
  id: number;
  createdAt: string;
  updatedAt: string;
  key: string;
  typeId: string;
  organizationId: string;
  chainId: string;
  status: string;
  [key: string]: any;
};

export type MoralisAPITokens = {
  moralisAPIToken: string;
};

export type APIHeaders = {
  [key: string]: string;
};
