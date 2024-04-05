import { Address, ChainalysisRiskLevel } from "."

export type EligibilityMerkleData = [Address, bigint][]
export type RiskLevelsMapping = Record<Address, ChainalysisRiskLevel>
export type EligibilityResponseDataMapping = Record<Address, EligibilityResponseData>

export interface EligibilityResponseData {
    signature: string,
    proof: string[],
    allocation: bigint,
}
