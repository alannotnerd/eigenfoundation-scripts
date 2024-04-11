import { Address, EligibilityResponseMapping } from '../types';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { getBytes, isAddress, solidityPackedKeccak256, Wallet } from 'ethers';

export class MerkleTreeSigner {
  constructor() {}

  async signLeaves(tree: StandardMerkleTree<[Address, bigint]>, signer: Wallet): Promise<EligibilityResponseMapping> {
    const outputData: EligibilityResponseMapping = {};

    for (const [index, leaf] of tree.entries()) {
      const [address, allocation] = leaf;

      const proof = tree.getProof(index);
      const signature = await this.generateSignature(address, allocation, signer);

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
    if (!isAddress(address)) {
      throw new Error(`Invalid address provided while signing merkle tree leaves: ${address}`);
    }
    const messageHash = solidityPackedKeccak256(['address', 'uint256'], [address, amount]);
    const ethSignedMessageHash = getBytes(messageHash);
    const signature = await signer.signMessage(ethSignedMessageHash);
    return signature;
  }
}
