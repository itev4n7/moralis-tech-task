import { BaseService } from './base.service';
import { getAuthHeaderOptions } from 'common/api-utils';
import { API_DASHBOARD_BASE_URL, SYMBOLS } from 'common/constants';
import { logger } from 'loggers/logger';
import { NodeAPIMetadata, ProtocolNetworkUnion } from 'common/types';
import { APIRequestContext } from 'playwright/test';

export class NodesAPIService extends BaseService {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getRPCNodeIdByNetwork(network: ProtocolNetworkUnion) {
    const chainId = network.split(SYMBOLS.dash)[0];
    const nodesData = await this.getRPCNodesMetadata();
    const nodeId = nodesData.find(nodeObject => nodeObject.chainId === chainId);
    if (!nodeId) {
      throw new Error(`No nodes found on "${chainId}" chainId`);
    }
    return nodeId.key;
  }

  async getRPCNodesMetadata(): Promise<NodeAPIMetadata[]> {
    const options = await getAuthHeaderOptions();
    const response = await this.request.get(`${API_DASHBOARD_BASE_URL}/project/nodes/`, options);
    if (response.ok()) {
      const data = await response.json();
      logger.debug('Succesfully get nodes data: %o', data);
      return data;
    } else {
      logger.error(`Failed to get node IDs. Status: ${response.status()}`);
      throw new Error('Failed to get node IDs!');
    }
  }

  async deleteRPCNode(nodeId: string) {
    const options = await getAuthHeaderOptions();
    const response = await this.request.delete(`${API_DASHBOARD_BASE_URL}/project/nodes/${nodeId}`, options);
    if (response.ok()) {
      logger.info(`Node with ID ${nodeId} successfully deleted`);
    } else {
      logger.error(`Failed to delete node with ID ${nodeId}. Status: ${response.status()}`);
    }
  }

  async deleteAllRPCNodes() {
    try {
      const nodeIdArray = (await this.getRPCNodesMetadata()).map(nodeMetadata => nodeMetadata.key);
      for (const nodeId of nodeIdArray) {
        await this.deleteRPCNode(nodeId);
      }
    } catch (e) {
      if (e.message.includes('Failed to get node IDs!')) {
        logger.info('No RPC nodes found to delete');
      }
    }
  }
}
