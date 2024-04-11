import { MerkleTreeSigner } from '../../../src/modules/MerkleTreeSigner';
import { Wallet } from 'ethers';
import { EligibilityMerkleTree } from '../../../src/modules/EligibilityMerkleTree';
import { ChainalysisRiskLevel } from '../../../src/types';
import { mockScreenedData, mockScreenedDataPoofsSigned } from '../helpers/mocks';

describe('MerkleTreeSigner', () => {
  const signerMock = new Wallet('8f90c96efc7f928dcee007a8396bc01b73638dabc47359b31bd8e165742afe7e');

  describe('signLeaves', () => {
    it('should sign all leaves of the merkle tree', async () => {
      const treeMock = new EligibilityMerkleTree(mockScreenedData, Object.values(ChainalysisRiskLevel)).createTree();
      const merkleTreeSigner = new MerkleTreeSigner();
      const outputData = await merkleTreeSigner.signLeaves(treeMock, signerMock);
      expect(outputData).toEqual(mockScreenedDataPoofsSigned);
    });
  });

  describe('generateSignature', () => {
    it('should generate a signature for the given address and amount', async () => {
      const address = '0x980a6D04D42b34529192a41566895F2E67efEF4a';
      const mockSignature =
        '0xcc281175103df3b23b152072f393b238ec8322de33015a040b857c1e7e910ff805e4ee4949158dc15eceb34970d303290e0577bc4a0900f4f8d3961a4bd1b2501b';
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
