import { EligibleAddress, ChainalysisRiskLevel, RiskCount } from '../types';
import * as asyncLib from 'async';
import { ChainalysisAPI } from '../utils';

export class WalletScreeningProcessor {
  private _outputData: string[] = [];
  private _processedCount: number = 0;

  private _riskCounts: RiskCount = {
    [ChainalysisRiskLevel.Empty]: 0,
    [ChainalysisRiskLevel.Low]: 0,
    [ChainalysisRiskLevel.Medium]: 0,
    [ChainalysisRiskLevel.High]: 0,
    [ChainalysisRiskLevel.Severe]: 0,
    [ChainalysisRiskLevel.FailedToRetrieve]: 0,
  };

  constructor(
    private chainalysisAPI: ChainalysisAPI,
    private inputData: EligibleAddress[],
    private maxConcurrentRequest: number,
  ) { }

  get outputData(): string[] {
    return this._outputData;
  }

  get riskCounts(): RiskCount {
    return this._riskCounts;
  }

  get processedCount(): number {
    return this._processedCount;
  }

  /**
   * Process the given addresses
   * @returns CSV data with the risk level for each address
   */
  async run(): Promise<string[]> {
    try {
      await asyncLib.eachLimit(this.inputData, this.maxConcurrentRequest, this.processAddress.bind(this));
      console.log(''); // Add a newline after the progress bar
      console.log(`Screening completed. Risk level counts:`);
      Object.entries(this.riskCounts).forEach(([riskLevel, count]) => {
        console.log(`${riskLevel}: ${count}`);
      });
      return this.outputData;
    } catch (error) {
      throw new Error(`WalletProcessor: ${error}`);
    }
  }

  /**
   * Process an address and update the risk level
   * @param addressData The address data to process
   * @param callback The callback to call when the address has been processed
   * @returns A promise that resolves when the address has been processed
   */
  private async processAddress(addressData: EligibleAddress): Promise<void> {
    const riskLevel = await this.chainalysisAPI.retrieveRisk(addressData.Restaker);
    this.updateData(addressData, riskLevel);
  }

  /**
   * Update the data with the risk level
   * @param addressData The address data
   * @param riskLevel The risk level
   */
  private updateData(addressData: EligibleAddress, riskLevel: ChainalysisRiskLevel): void {
    // Save the result and update the risk counts
    this.outputData.push(`${addressData.Restaker},${addressData['Allocation (EIGEN)']},${riskLevel}`);
    this._riskCounts[riskLevel]++;
    this._processedCount++;
    process.stdout.write(`Processing: ${this.processedCount}/${this.inputData.length} addresses\r`);
  }
}
