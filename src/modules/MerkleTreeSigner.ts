import { Address, EligibilityResponseDataMapping } from '../types';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { getBytes, solidityPackedKeccak256, Wallet } from 'ethers';

export class MerkleTreeSigner {
  constructor(
    private tree: StandardMerkleTree<[Address, bigint]>,
    private signer: Wallet,
  ) {}

  async signLeaves(): Promise<EligibilityResponseDataMapping> {
    const outputData: EligibilityResponseDataMapping = {};

    for (const [index, leaf] of this.tree.entries()) {
      const [address, allocation] = leaf;

      const proof = this.tree.getProof(index);
      const signature = await this.generateSignature(address, allocation, this.signer);

      outputData[address] = {
        signature,
        proof,
        allocation,
      };

      process.stdout.write(`Generated ${index + 1} signatures\r`);
    }
    console.log(''); // Necessary to move to the next line after the stdout.write

    return outputData;
  }

  private async generateSignature(address: Address, amount: bigint, signer: Wallet): Promise<string> {
    const messageHash = solidityPackedKeccak256(['address', 'uint256'], [address, amount]);
    const ethSignedMessageHash = getBytes(messageHash);
    const signature = await signer.signMessage(ethSignedMessageHash);
    return signature;
  }
}
