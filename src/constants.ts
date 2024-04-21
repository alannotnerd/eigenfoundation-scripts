import { ChainalysisRiskLevel } from './types';

export const CHAINALYSIS_RETRY_DELAY = 500;
export const CHAINALYSIS_MAX_RETRY = 10;
export const MAX_CHAINALYSIS_CONCURRENT_REQUESTS = 20;
export const CHAINALYSIS_API_URL = 'https://api.chainalysis.com';
export const ACCEPTED_RISK_LEVELS = [ChainalysisRiskLevel.Low, ChainalysisRiskLevel.Medium];
export const ELIGIBLE_ADDRESS_HEADERS = [
  'Restaker',
  'Debank',
  'Time Averaged ETH Balance',
  'Balance USD',
  'Restaking Time (Days)',
  'Restaked Points',
  'Allocation (EIGEN)',
  'New Address',
] as const;
export const SCREENED_ADDRESS_HEADERS = ['Restaker', 'Allocation (EIGEN)', 'Risk'] as const;
export const ELIGIBILITY_RESPONSE_HEADERS = ['Signature', 'Proof', 'Allocation'] as const;
