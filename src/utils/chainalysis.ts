import axios, { AxiosInstance } from 'axios';
import * as path from 'path';
import { ChainalysisAddressData, ChainalysisRiskLevel } from '../types';
import { retryAsync } from 'ts-retry';
import { CHAINALYSIS_MAX_RETRY, CHAINALYSIS_RETRY_DELAY } from '../constants';

export class ChainalysisAPI {

  private apiClient: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.apiClient = axios.create({
      baseURL,
      headers: {
        Token: apiKey,
      }
    });
  }

  /**
   * Retrieves the risk level for a given address from the Chainalysis API
   * @param address The address to check
   * @returns The risk level for the address, or undefined if the request fails
   */
  async retrieveRisk(address: string): Promise<ChainalysisRiskLevel> {
    try {
      const entitiesPath = '/api/risk/v2/entities';

      const risk = await retryAsync(async () => {
        await this.apiClient.post(entitiesPath, { address });

        const { data } = await this.apiClient.get<ChainalysisAddressData>(path.join(entitiesPath, address));
        if (!Object.values(ChainalysisRiskLevel).includes(data.risk)) {
          throw new Error(`Invalid risk level: ${data.risk}`);
        }

        return data.risk;
      }, { delay: CHAINALYSIS_RETRY_DELAY, maxTry: CHAINALYSIS_MAX_RETRY });

      return risk;
    } catch (error: unknown) {
      console.error(`Failed to retrieve risk for address ${address}: ${error}`);
      return ChainalysisRiskLevel.FailedToRetrieve;
    }
  }
}
