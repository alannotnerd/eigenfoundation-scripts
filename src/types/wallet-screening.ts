export type Address = string;

export interface EligibleAddressData {
  Restaker: string;
  'Allocation (EIGEN)': string;
  'Balance USD': string;
}

export enum ChainalysisRiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Severe = 'Severe',
  FailedToRetrieve = 'Failed to retrieve',
}

export type RiskCount = { [key in ChainalysisRiskLevel]: number };

export type ScreeningData = [Address, ChainalysisRiskLevel][];

export interface ChainalysisAddressData {
  address: Address;
  risk: ChainalysisRiskLevel;
  cluster: unknown;
  riskReason: unknown;
  addressIdentifications: [];
  exposures: {
    category: string;
    value: number;
  }[];
  triggers: unknown[];
  status: string;
}
