

import { EligibleAddressData, ChainalysisRiskLevel, RiskCount } from '../types';
import * as asyncLib from 'async';
import { ChainalysisAPI } from '../utils';

export class WalletScreeningProcessor {

  outputData: string[] = [];
  processedCount: number = 0;

  private riskCounts: RiskCount = {
    [ChainalysisRiskLevel.Low]: 0,
    [ChainalysisRiskLevel.Medium]: 0,
    [ChainalysisRiskLevel.High]: 0,
    [ChainalysisRiskLevel.Severe]: 0,
    [ChainalysisRiskLevel.FailedToRetrieve]: 0,
  };

  constructor(
    private chainalysisAPI: ChainalysisAPI,
    private inputData: EligibleAddressData[],
    private maxConcurrentRequest: number
  ) { }

  /**
   * Process the given addresses
   * @returns CSV data with the risk level for each address
   */
  async run(): Promise<string[]> {
    return await this.batchProcess();
  }

  /**
   * Process an address and update the risk level
   * @param addressData The address data to process
   * @param callback The callback to call when the address has been processed
   * @returns A promise that resolves when the address has been processed
   */
  private async processAddress(addressData: EligibleAddressData, callback: (error?: Error) => void): Promise<void> {
    const riskLevel = await this.chainalysisAPI.retrieveRisk(addressData.Address);
    this.updateData(addressData, riskLevel);
    callback();
  }

  /**
   * Update the data with the risk level
   * @param addressData The address data
   * @param riskLevel The risk level
   */
  private updateData(addressData: EligibleAddressData, riskLevel: ChainalysisRiskLevel): void {
    // Save the result and update the risk counts
    this.outputData.push(`${addressData.Address},${riskLevel}`);
    this.riskCounts[riskLevel]++;
    this.processedCount++;
    process.stdout.write(`Processing: ${this.processedCount}/${this.inputData.length} addresses\r`);
  };

  /**
   * Process the addresses in batches
   * @returns A promise that resolves when all addresses have been processed
   */
  private async batchProcess(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      asyncLib.eachLimit(this.inputData, this.maxConcurrentRequest, this.processAddress.bind(this), (err: Error) => {
        console.log(''); // Necessary to move to the next line after the stdout.write

        if (err) {
          console.error('An error occurred:', err);
          return reject();
        }

        // Log the counts of each risk level
        console.log(`Screening completed. Risk level counts:`);
        Object.entries(this.riskCounts).forEach(([riskLevel, count]) => {
          console.log(`${riskLevel}: ${count}`);
        });

        resolve(this.outputData);
      });
    });
  }
}