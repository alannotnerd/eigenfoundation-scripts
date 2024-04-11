import { EligibilityMerkleTree } from '../../../src/modules/EligibilityMerkleTree';
import { generateEligibilityData } from '../helpers';
import { ChainalysisRiskLevel, ScreenedAddress } from '../../../src/types';
import { parseEther } from 'ethers';

describe('EligibilityMerkleTree', () => {
  describe('createTree', () => {
    it('should create a merkle tree with eligible addresses', () => {
      const eligibilityData = generateEligibilityData(100);
      const acceptedRiskLevels = [ChainalysisRiskLevel.High, ChainalysisRiskLevel.Medium];
      const eligibilityMerkleTree = new EligibilityMerkleTree(eligibilityData.screened, acceptedRiskLevels);
      const tree = eligibilityMerkleTree.createTree();
      expect(tree.dump().values.length).toEqual(
        eligibilityData.screened.filter((elm) =>
          [ChainalysisRiskLevel.High, ChainalysisRiskLevel.Medium].includes(elm.Risk as ChainalysisRiskLevel),
        ).length,
      );
    });

    it('should throw if there are no leaves', () => {
      const eligibilityData = generateEligibilityData(0);
      const acceptedRiskLevels = [ChainalysisRiskLevel.High, ChainalysisRiskLevel.Medium];
      const eligibilityMerkleTree = new EligibilityMerkleTree(eligibilityData.screened, acceptedRiskLevels);
      expect(() => eligibilityMerkleTree.createTree()).toThrow(
        `No data to insert into the merkle tree, accepted risk levels are [${acceptedRiskLevels.join(', ')}]`,
      );
    });

    it('should log the merkle root', () => {
      const eligibilityData = generateEligibilityData(100);
      const acceptedRiskLevels = [ChainalysisRiskLevel.High, ChainalysisRiskLevel.Medium];
      const eligibilityMerkleTree = new EligibilityMerkleTree(eligibilityData.screened, acceptedRiskLevels);
      const tree = eligibilityMerkleTree.createTree();

      // Mock console.log to capture the log output
      const consoleLogSpy = jest.spyOn(console, 'log');

      eligibilityMerkleTree.createTree();

      expect(consoleLogSpy).toHaveBeenCalledWith(`Merkle Root: ${tree.root}`);

      consoleLogSpy.mockRestore();
    });
  });

  describe('computeMerkleData', () => {
    it('should compute merkle data filtering with 1 risk level', () => {
      const screenedData: ScreenedAddress[] = [
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x1',
          Risk: ChainalysisRiskLevel.Low,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x2',
          Risk: ChainalysisRiskLevel.Medium,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x3',
          Risk: ChainalysisRiskLevel.High,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x4',
          Risk: ChainalysisRiskLevel.Severe,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x5',
          Risk: ChainalysisRiskLevel.FailedToRetrieve,
        },
      ];
      const elegibilityMerkleTree = new EligibilityMerkleTree(screenedData, [ChainalysisRiskLevel.Medium]);
      const merkleData = elegibilityMerkleTree['computeMerkleData'](screenedData);
      expect(merkleData).toEqual([['0x2', parseEther('100')]]);
    });
    it('should compute merkle data filtering with 2 risk levels', () => {
      const screenedData: ScreenedAddress[] = [
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x1',
          Risk: ChainalysisRiskLevel.Low,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x2',
          Risk: ChainalysisRiskLevel.Medium,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x3',
          Risk: ChainalysisRiskLevel.High,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x5',
          Risk: ChainalysisRiskLevel.FailedToRetrieve,
        },
      ];
      const elegibilityMerkleTree = new EligibilityMerkleTree(screenedData, [
        ChainalysisRiskLevel.Low,
        ChainalysisRiskLevel.Medium,
      ]);
      const merkleData = elegibilityMerkleTree['computeMerkleData'](screenedData);
      expect(merkleData).toEqual([
        ['0x1', parseEther('100')],
        ['0x2', parseEther('100')],
      ]);
    });
    it('should return empty', () => {
      const screenedData: ScreenedAddress[] = [
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x1',
          Risk: ChainalysisRiskLevel.Low,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x2',
          Risk: ChainalysisRiskLevel.Medium,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x3',
          Risk: ChainalysisRiskLevel.High,
        },
        {
          'Allocation (EIGEN)': '100',
          Restaker: '0x5',
          Risk: ChainalysisRiskLevel.FailedToRetrieve,
        },
      ];
      const elegibilityMerkleTree = new EligibilityMerkleTree(screenedData, [ChainalysisRiskLevel.Severe]);
      const merkleData = elegibilityMerkleTree['computeMerkleData'](screenedData);
      expect(merkleData).toEqual([]);
    });
  });
});
