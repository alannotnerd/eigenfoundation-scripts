import { ChainalysisRiskLevel } from '../../../src/types';

export const mockScreenedData = [
  {
    'Allocation (EIGEN)': '100',
    'Balance USD': '100',
    Restaker: '0x980a6D04D42b34529192a41566895F2E67efEF4a',
    Risk: ChainalysisRiskLevel.Low,
  },
  {
    'Allocation (EIGEN)': '100',
    'Balance USD': '100',
    Restaker: '0x3DfB8f56cbc5860BC16D43D3608Dddc2B8128291',
    Risk: ChainalysisRiskLevel.Medium,
  },
  {
    'Allocation (EIGEN)': '100',
    'Balance USD': '100',
    Restaker: '0x63C7015B7bCE92e86021077d0d4778A0A123393C',
    Risk: ChainalysisRiskLevel.High,
  },
  {
    'Allocation (EIGEN)': '100',
    'Balance USD': '100',
    Restaker: '0xC795eA209170D5D47Bd72E2AFae1A9F3A440D176',
    Risk: ChainalysisRiskLevel.FailedToRetrieve,
  },
];

export const mockScreenedDataProofsSigned = {
  '0x980a6D04D42b34529192a41566895F2E67efEF4a': {
    signature:
      '0x5e70cb5c66de85867030b2676cb04ba998bd64032613665f03401bef980b824979be01585e7ad711c03c609d9e116e9a38b06c8879ef7767fe04220dd6a3700c1b',
    proof: [
      '0xf768d80f912a9eda480d910e9c64ee5230f79bc6318cdcfaf15bbb31e371fc70',
      '0x52f9ff771bd2202d00e90b88c254f32ad15bb5a9782324fe9f066d0cd04cc24c',
    ],
    allocation: 100000000000000000000n,
  },
  '0x3DfB8f56cbc5860BC16D43D3608Dddc2B8128291': {
    signature:
      '0x42902b553271a924484e50ad4304cabc9d1a1ace179702eb95d6830d286ba34e2f186d18c0e4daeae21b4fa1e3af2f5a78b957dcefb14a8d8ddfc3c96fef62d71b',
    proof: [
      '0x4a0d71f7bdd82400b128f7fc0c1374fe626c1f83f4dac46dcf8f1461f31cad34',
      '0xadfa4ea512ce354f1cd3f047b2c9792587ef1ee57f15b23804df29b73f009d08',
    ],
    allocation: 100000000000000000000n,
  },
  '0x63C7015B7bCE92e86021077d0d4778A0A123393C': {
    signature:
      '0x40c8fe8be3fda4df425e13b311033e49abb52be9cab5bfa9fac4a033f4187a2e2b290e79a0986c7ae123be5a31622783e7425320a6f039f7e25b1d6df04122d41c',
    proof: [
      '0xe276c6bc19d4e200d12524f8ec6c19a73e32df7a038cfdb0d0574c104da793dd',
      '0x52f9ff771bd2202d00e90b88c254f32ad15bb5a9782324fe9f066d0cd04cc24c',
    ],
    allocation: 100000000000000000000n,
  },
  '0xC795eA209170D5D47Bd72E2AFae1A9F3A440D176': {
    signature:
      '0xbe426c8199e95a34b70947ca32203a781f2205b1241f8f38ffd1a94344f134720a5b002c1b57ad5721b0415b54ddfaaa48ebd690b33f0e06bf312e180404a4771c',
    proof: [
      '0x2aad6ff9839166e329a3e130a119e29a66d05d7acf61bd5f4c490ce53f6e4214',
      '0xadfa4ea512ce354f1cd3f047b2c9792587ef1ee57f15b23804df29b73f009d08',
    ],
    allocation: 100000000000000000000n,
  },
};
