import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import 'dotenv/config';
import { ScreenedAddress } from './types';
import { readAndParseCSV } from './utils/fs';
import { cleanEnv, str } from 'envalid';
import { EligibilityMerkleTree, MerkleTreeSigner } from './modules';
import { Wallet } from 'ethers';
import { stringify } from './utils/miscellaneous';
import { ACCEPTED_RISK_LEVELS, SCREENED_ADDRESS_HEADERS } from './constants';

const env = cleanEnv(process.env, {
  SIGNER_PRIVATE_KEY: str(),
});

(async () => {
  const { screeningData: screeningDataPath, output: outputPath } = parseArguments();

  const screeningData = readAndParseCSV<ScreenedAddress[]>(
    screeningDataPath,
    JSON.parse(JSON.stringify(SCREENED_ADDRESS_HEADERS)),
  );

  const signer = new Wallet(env.SIGNER_PRIVATE_KEY);

  const eligibilityMerkleTree = new EligibilityMerkleTree(screeningData, ACCEPTED_RISK_LEVELS);
  const tree = eligibilityMerkleTree.createTree();

  const merkleTreeSigner = new MerkleTreeSigner();
  const signedData = await merkleTreeSigner.signLeaves(tree, signer);

  // Write the list of addresses to a file
  fs.writeFileSync(outputPath, stringify(signedData), 'utf-8');
})();

/**
 * Parse command-line arguments.
 * @returns The parsed arguments.
 */
function parseArguments() {
  return yargs(hideBin(process.argv))
    .option('screening-data', {
      describe: 'Path to the screening results CSV',
      type: 'string',
      demandOption: true,
    })
    .option('output', {
      describe: 'Output path of the process results JSON',
      type: 'string',
      demandOption: true,
    })
    .parseSync();
}
