import { WalletScreeningProcessor } from '../../../src/modules/WalletScreeningProcessor';
import { ChainalysisRiskLevel } from '../../../src/types';
import { ChainalysisAPI } from '../../../src/utils/chainalysis';
import { computeEmptyRiskCounts, computeRiskCount, generateEligibilityData } from '../helpers';

describe('WalletScreeningProcessor', () => {
  const mockMaxConcurrentRequest = 2;
  const mockChainalysisAPI = {
    retrieveRisk: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should process addresses and update data correctly', async () => {
      const dataCount = 200;
      const eligibilityData = generateEligibilityData(dataCount);
      const processor = new WalletScreeningProcessor(
        mockChainalysisAPI as unknown as ChainalysisAPI,
        eligibilityData.eligibile,
        mockMaxConcurrentRequest,
      );
      // mockResolveRisk
      for (const data of eligibilityData.screened) {
        mockChainalysisAPI.retrieveRisk.mockResolvedValueOnce(data.Risk);
      }
      const outputData = await processor.run();
      expect(mockChainalysisAPI.retrieveRisk).toHaveBeenCalledTimes(dataCount);
      expect(processor.riskCounts).toEqual(computeRiskCount(eligibilityData.screened));
      expect(processor.processedCount).toEqual(dataCount);
      expect(outputData).toEqual(
        eligibilityData.screened.map((elm) => `${elm.Restaker},${elm['Allocation (EIGEN)']},${elm.Risk}`),
      );
    });

    it('should throw error if api fails', async () => {
      const dataCount = 10;
      const errorMessage = new Error('Failed to retrieve risk');
      const eligibilityData = generateEligibilityData(dataCount);
      const processor = new WalletScreeningProcessor(
        mockChainalysisAPI as unknown as ChainalysisAPI,
        eligibilityData.eligibile,
        mockMaxConcurrentRequest,
      );
      // mockResolveRisk
      mockChainalysisAPI.retrieveRisk.mockRejectedValue(errorMessage);

      await expect(processor.run()).rejects.toEqual(new Error(`WalletProcessor: ${errorMessage}`));
    });
  });

  describe('processAddress', () => {
    it('should process the address successfully', async () => {
      const dataCount = 1;
      const eligibilityData = generateEligibilityData(dataCount);
      const processor = new WalletScreeningProcessor(
        mockChainalysisAPI as unknown as ChainalysisAPI,
        eligibilityData.eligibile,
        mockMaxConcurrentRequest,
      );
      mockChainalysisAPI.retrieveRisk.mockResolvedValueOnce(eligibilityData.screened[0].Risk);
      await processor['processAddress'](eligibilityData.eligibile[0]);

      expect(processor.processedCount).toBe(dataCount);
      expect(processor.outputData).toEqual(
        eligibilityData.screened.map((elm) => `${elm.Restaker},${elm['Allocation (EIGEN)']},${elm.Risk}`),
      );
      expect(processor.riskCounts).toEqual(computeRiskCount(eligibilityData.screened));
    });

    it('should update info with fail to retrieve ', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const address = 'fakeAddress';
      const api = new ChainalysisAPI('https://api.chainalysis.com', 'TEST_KEY');
      const eligibilityData = {
        Restaker: address,
        'Allocation (EIGEN)': '100',
        'Balance USD': '100',
      };
      const screenedData = {
        ...eligibilityData,
        risk: ChainalysisRiskLevel.High,
      };
      const processor = new WalletScreeningProcessor(api, [eligibilityData], mockMaxConcurrentRequest);
      await processor['processAddress'](eligibilityData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to retrieve risk for address ${address}: Error: Invalid address: ${address}`,
      );
      expect(processor.processedCount).toBe([eligibilityData].length);
      expect(processor.riskCounts).toEqual({ ...computeEmptyRiskCounts(), [ChainalysisRiskLevel.FailedToRetrieve]: 1 });
      expect(processor.outputData).toEqual(
        [screenedData].map(
          (elm) => `${elm.Restaker},${eligibilityData['Allocation (EIGEN)']},${ChainalysisRiskLevel.FailedToRetrieve}`,
        ),
      );
    });
  });

  describe('updateData', () => {
    it('should update the data with the given risk level', () => {
      const address = 'fakeAddress';
      const api = new ChainalysisAPI('https://api.chainalysis.com', 'TEST_KEY');
      const eligibilityData = {
        Restaker: address,
        'Allocation (EIGEN)': '100',
      };
      const screenedData = {
        ...eligibilityData,
        risk: ChainalysisRiskLevel.High,
      };
      const processor = new WalletScreeningProcessor(api, [eligibilityData], mockMaxConcurrentRequest);
      processor['updateData'](eligibilityData, screenedData.risk);

      expect(processor.processedCount).toEqual([eligibilityData].length);
      expect(processor.outputData).toEqual([
        `${eligibilityData.Restaker},${eligibilityData['Allocation (EIGEN)']},${ChainalysisRiskLevel.High}`,
      ]);
      expect(processor.riskCounts).toEqual({ ...computeEmptyRiskCounts(), [ChainalysisRiskLevel.High]: 1 });
    });
  });
});
