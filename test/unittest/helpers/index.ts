import { ethers } from 'ethers';
import { ChainalysisRiskLevel, EligibleAddress, ScreenedAddress } from '../../../src/types';

export function generateEligibilityData(n: number): { eligibile: EligibleAddress[]; screened: ScreenedAddress[] } {
  const data: { eligibile: EligibleAddress[]; screened: ScreenedAddress[] } = { eligibile: [], screened: [] };
  const riskLevels: ChainalysisRiskLevel[] = Object.values(ChainalysisRiskLevel);
  for (let i = 1; i <= n; i++) {
    const randomValue = Math.floor(Math.random() * riskLevels.length);
    const risk: ChainalysisRiskLevel = riskLevels[randomValue];

    const eligibilityData: EligibleAddress = {
      Restaker: `${ethers.Wallet.createRandom().address}`,
      'Allocation (EIGEN)': `${randomValue * 100}`,
    };
    data.eligibile.push(eligibilityData);
    data.screened.push({ ...eligibilityData, Risk: risk });
  }
  return data;
}

export function computeEmptyRiskCounts() {
  const result: Partial<Record<ChainalysisRiskLevel, number>> = {};
  for (const value of Object.values(ChainalysisRiskLevel)) result[value] = 0;
  return result;
}

export function computeRiskCount(eligibilityDataWithRisk: ScreenedAddress[]): Record<ChainalysisRiskLevel, number> {
  const init = computeEmptyRiskCounts();
  return eligibilityDataWithRisk.reduce<Record<ChainalysisRiskLevel, number>>(
    (acc, data) => {
      acc[data.Risk as ChainalysisRiskLevel]++;
      return acc;
    },
    init as Record<ChainalysisRiskLevel, number>,
  );
}
