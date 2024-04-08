import {
  Address,
  ChainalysisRiskLevel,
  ScreeningData,
  EligibilityMerkleData,
  RiskLevelsMapping,
  EligibleAddressData,
} from '../types';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { parseEther } from 'ethers';

export class EligibilityMerkleTree {
  constructor(
    private eligibilityData: EligibleAddressData[],
    private screeningData: ScreeningData,
    private acceptedRiskLevels: ChainalysisRiskLevel[],
  ) {}

  createTree(): StandardMerkleTree<[string, bigint]> {
    const riskLevels = this.getRiskLevels(this.screeningData);
    const eligibilityMerkleData = this.computeMerkleData(this.eligibilityData, riskLevels);

    console.log(`Inserting ${eligibilityMerkleData.length} addresses into the merkle tree`);
    const tree = StandardMerkleTree.of(eligibilityMerkleData, ['address', 'uint256']);

    // Log the Merkle root
    console.log(`Merkle Root: ${tree.root}`);

    return tree;
  }

  private getRiskLevels(screeningData: ScreeningData): RiskLevelsMapping {
    // Save each address and its risk level to an object to keep O(1) access time
    const addressRiskLevel: RiskLevelsMapping = {};
    screeningData.forEach(([address, riskLevel]) => {
      addressRiskLevel[address] = riskLevel;
    });
    return addressRiskLevel;
  }

  private computeMerkleData(
    eligibilityData: EligibleAddressData[],
    riskLevels: RiskLevelsMapping,
  ): EligibilityMerkleData {
    return eligibilityData.reduce(
      (acc, data) => {
        const isRiskAcceptable = this.acceptedRiskLevels.includes(riskLevels[data.Restaker]);
        if (isRiskAcceptable) {
          acc.push([data.Restaker, parseEther(data['Allocation (EIGEN)'])]);
        }
        return acc;
      },
      [] as [Address, bigint][],
    );
  }
}
