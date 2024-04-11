import { Address, ChainalysisRiskLevel } from '.';

export type EligibilityMerkleData = [Address, bigint][];
export type RiskLevelsMapping = Record<Address, ChainalysisRiskLevel>;
export type EligibilityResponseMapping = Record<Address, EligibilityResponse>;

export interface EligibilityResponse {
  signature: string;
  proof: string[];
  allocation: bigint;
}
