import { ChainalysisRiskLevel } from '../../../src/types';
import { ChainalysisAPI } from '../../../src/utils/chainalysis';
import axios, { AxiosInstance } from 'axios';

jest.mock('axios');

describe('ChainalysisAPI', () => {
  const baseURL = 'https://api.chainalysis.com';
  const apiKey = 'TEST_KEY';
  const address = '0xC420192FFc5166DF9A15a1581A0940f3dD42A2fe';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if baseURL is invalid', () => {
    expect(() => new ChainalysisAPI('', apiKey)).toThrow();
  });

  it('should retrieve risk level for a given address', async () => {
    const expectedRiskLevel = ChainalysisRiskLevel.High;
    jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          risk: expectedRiskLevel,
        },
      }),
      post: jest.fn(),
    } as unknown as AxiosInstance);
    const chainalysisAPI = new ChainalysisAPI(baseURL, apiKey);

    const riskLevel = await chainalysisAPI.retrieveRisk(address);

    expect(riskLevel).toBe(expectedRiskLevel);
  });

  it('should handle invalid risk level', async () => {
    const invalidRiskLevel = 'InvalidRiskLevel';
    jest.spyOn(axios, 'create').mockReturnValue({
      get: () => {
        return {
          data: {
            risk: invalidRiskLevel,
          },
        };
      },
      post: () => {},
    } as unknown as AxiosInstance);
    const chainalysisAPI = new ChainalysisAPI(baseURL, apiKey, 1, 1);

    const riskLevel = await chainalysisAPI.retrieveRisk(address);

    expect(riskLevel).toBe(ChainalysisRiskLevel.FailedToRetrieve);
  });

  it('should handle request failure', async () => {
    const errorMessage = 'Request failed';
    jest.spyOn(axios, 'create').mockReturnValue({
      post: () => {
        throw new Error(errorMessage);
      },
    } as unknown as AxiosInstance);
    const chainalysisAPI = new ChainalysisAPI(baseURL, apiKey, 1, 1);

    const riskLevel = await chainalysisAPI.retrieveRisk(address);

    expect(riskLevel).toBe(ChainalysisRiskLevel.FailedToRetrieve);
  });

  it('should return FailedToRetrieve if it is invalid address', async () => {
    const address = 'invalid_address';
    jest.spyOn(axios, 'create').mockReturnValue({} as unknown as AxiosInstance);
    const chainalysisAPI = new ChainalysisAPI(baseURL, apiKey, 1, 1);
    const riskLevel = await chainalysisAPI.retrieveRisk(address);

    expect(riskLevel).toBe(ChainalysisRiskLevel.FailedToRetrieve);
  });
});
