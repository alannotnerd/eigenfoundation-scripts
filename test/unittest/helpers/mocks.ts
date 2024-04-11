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

export const mockScreenedDataPoofsSigned = {
  '0x980a6D04D42b34529192a41566895F2E67efEF4a': {
    signature:
      '0xfd87ce2e9e80438758e49cc10bdb96e89ae536fcc1c89a171734fc9920594daa4f76bfedc057b25cb823ed39b923f4d539326dc5cfc26c5251e40bfe157f32cc1b',
    proof: [
      '0xf768d80f912a9eda480d910e9c64ee5230f79bc6318cdcfaf15bbb31e371fc70',
      '0x52f9ff771bd2202d00e90b88c254f32ad15bb5a9782324fe9f066d0cd04cc24c',
    ],
    allocation: 100000000000000000000n,
  },
  '0x3DfB8f56cbc5860BC16D43D3608Dddc2B8128291': {
    signature:
      '0xd6aefcab12acd8c99efcfe6cf734130bb915612a73f168b455edfdca40300ff030799b8900af3fca67bc153348fee9a1624f260bd3dc88b549dfba8be7d54f511b',
    proof: [
      '0x4a0d71f7bdd82400b128f7fc0c1374fe626c1f83f4dac46dcf8f1461f31cad34',
      '0xadfa4ea512ce354f1cd3f047b2c9792587ef1ee57f15b23804df29b73f009d08',
    ],
    allocation: 100000000000000000000n,
  },
  '0x63C7015B7bCE92e86021077d0d4778A0A123393C': {
    signature:
      '0x57197312e6d395b89a54a071a1db2181273396e93f55837e7d887b4bf4d09f38569083ac41b4bc5da4f3c7db24ccbf93e2a54f1f3492b5adfce1460f3673ec061c',
    proof: [
      '0xe276c6bc19d4e200d12524f8ec6c19a73e32df7a038cfdb0d0574c104da793dd',
      '0x52f9ff771bd2202d00e90b88c254f32ad15bb5a9782324fe9f066d0cd04cc24c',
    ],
    allocation: 100000000000000000000n,
  },
  '0xC795eA209170D5D47Bd72E2AFae1A9F3A440D176': {
    signature:
      '0x0080cc18440e6f8d47f810d7a3f08dfec192a36d2be0d0275daf3c0fdebacce600b3edf83452b6cb63029ba3ab4e8741270d2641bcdda2a78d0d11469f65e4761c',
    proof: [
      '0x2aad6ff9839166e329a3e130a119e29a66d05d7acf61bd5f4c490ce53f6e4214',
      '0xadfa4ea512ce354f1cd3f047b2c9792587ef1ee57f15b23804df29b73f009d08',
    ],
    allocation: 100000000000000000000n,
  },
};
