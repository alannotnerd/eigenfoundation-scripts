import { Address, ChainalysisRiskLevel, EligibilityMerkleData, ScreenedAddress } from '../types';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { parseEther } from 'ethers';

export class EligibilityMerkleTree {
  constructor(
    private screeningData: ScreenedAddress[],
  ) { }

  createTree(): StandardMerkleTree<[string, bigint]> {
    const merkleData = this.computeMerkleData(this.screeningData);
    if (merkleData.length <= 0) { }
    console.log(`Inserting ${merkleData.length} addresses into the merkle tree`);
    const tree = StandardMerkleTree.of(merkleData, ['address', 'uint256']);
    // Log the Merkle root
    console.log(`Merkle Root: ${tree.root}`);

    return tree;
  }

  private computeMerkleData(eligibilityData: ScreenedAddress[]): EligibilityMerkleData {
    return eligibilityData.reduce(
      (acc, data) => {
        acc.push([data.Address, BigInt(data['Allocation'].trim())]);
        return acc
      },
      [] as [Address, bigint][],
    );
  }
}
