import { MerkleTreeSigner } from '../../../src/modules/MerkleTreeSigner';
import { Wallet } from 'ethers';
import { EligibilityMerkleTree } from '../../../src/modules/EligibilityMerkleTree';
import { ChainalysisRiskLevel } from '../../../src/types';
import { mockScreenedData, mockScreenedDataProofsSigned } from '../helpers/mocks';

describe('MerkleTreeSigner', () => {
  const signerMock = new Wallet('8f90c96efc7f928dcee007a8396bc01b73638dabc47359b31bd8e165742afe7e');

  describe('signLeaves', () => {
    it('should sign all leaves of the merkle tree', async () => {
      const treeMock = new EligibilityMerkleTree(mockScreenedData, Object.values(ChainalysisRiskLevel)).createTree();
      const merkleTreeSigner = new MerkleTreeSigner();
      const outputData = await merkleTreeSigner.signLeaves(treeMock, signerMock);
      expect(outputData).toEqual(mockScreenedDataProofsSigned);
    });
  });

  describe('generateSignature', () => {
    it('should generate a signature for the given address and amount', async () => {
      const address = '0x980a6D04D42b34529192a41566895F2E67efEF4a';
      const mockSignature =
        '0x955048815ef7900c79e8a636edb4c102b606c4ccc9475a460d2b7048bd3400c348a1c336a2f29de05450e17d1f5bc3c9278971b17a88ae7ccce2b29a536e89971c';
      const amount = BigInt(100);
      const merkleTreeSigner = new MerkleTreeSigner();
      const signature = await merkleTreeSigner['generateSignature'](address, amount, signerMock);
      expect(signature).toEqual(mockSignature);
    });

    it('should reject if address is invalid', async () => {
      const address = 'asd';
      const amount = BigInt(100);
      const merkleTreeSigner = new MerkleTreeSigner();
      await expect(merkleTreeSigner['generateSignature'](address, amount, signerMock)).rejects.toEqual(
        new Error(`Invalid address provided while signing merkle tree leaves: ${address}`),
      );
    });
  });
});
