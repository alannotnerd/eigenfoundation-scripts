import { ELIGIBLE_ADDRESS_HEADERS, SCREENED_ADDRESS_HEADERS } from '../constants';
export type Address = string;

type EligibleAddressCSVHeaders = (typeof ELIGIBLE_ADDRESS_HEADERS)[number];
export type EligibleCSVAddress = {
  [key in EligibleAddressCSVHeaders]: string;
};
export type EligibleAddress = Pick<EligibleCSVAddress, 'Restaker' | 'Allocation (EIGEN)'>;

type ScreenedAddressHeaders = (typeof SCREENED_ADDRESS_HEADERS)[number];
export type ScreenedAddress = {
  [key in ScreenedAddressHeaders]: string;
};

export enum ChainalysisRiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Severe = 'Severe',
  FailedToRetrieve = 'Failed to retrieve',
}

export type RiskCount = { [key in ChainalysisRiskLevel]: number };

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
