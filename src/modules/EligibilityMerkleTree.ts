import { Address, ChainalysisRiskLevel, EligibilityMerkleData, ScreenedAddress } from '../types';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { parseEther } from 'ethers';

export class EligibilityMerkleTree {
  constructor(
    private screeningData: ScreenedAddress[],
    private _acceptedRiskLevels: ChainalysisRiskLevel[],
  ) {}

  get acceptedRiskLevels(): ChainalysisRiskLevel[] {
    return this._acceptedRiskLevels;
  }
  createTree(): StandardMerkleTree<[string, bigint]> {
    const merkleData = this.computeMerkleData(this.screeningData);
    if (merkleData.length <= 0) {
      throw new Error(
        `No data to insert into the merkle tree, accepted risk levels are [${this._acceptedRiskLevels.join(', ')}]`,
      );
    }
    console.log(`Inserting ${merkleData.length} addresses into the merkle tree`);
    const tree = StandardMerkleTree.of(merkleData, ['address', 'uint256']);
    // Log the Merkle root
    console.log(`Merkle Root: ${tree.root}`);

    return tree;
  }

  private computeMerkleData(eligibilityData: ScreenedAddress[]): EligibilityMerkleData {
    return eligibilityData.reduce(
      (acc, data) => {
        const isRiskAcceptable = this.acceptedRiskLevels.includes(data.Risk as ChainalysisRiskLevel);
        if (isRiskAcceptable) {
          acc.push([data.Restaker, parseEther(parseFloat(data['Allocation (EIGEN)']).toFixed(18))]);
        }
        return acc;
      },
      [] as [Address, bigint][],
    );
  }
}
