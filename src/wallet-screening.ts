import 'dotenv/config';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { EligibleAddressData } from './types';
import { ChainalysisAPI, readAndParseCSV } from './utils';
import { cleanEnv, str } from 'envalid';
import { WalletScreeningProcessor } from './modules';
import { CHAINALYSIS_API_URL, MAX_CHAINALYSIS_CONCURRENT_REQUESTS } from './constants';

const env = cleanEnv(process.env, {
  CHAINALYSIS_API_KEY: str(),
});

(async () => {
  const { eligibilityData: eligibilityDataPath, output: outputPath } = parseArguments();
  const eligibilityData = readAndParseCSV<EligibleAddressData[]>(eligibilityDataPath);

  const chainalysisAPI = new ChainalysisAPI(CHAINALYSIS_API_URL, env.CHAINALYSIS_API_KEY);
  const screeningProcessor = new WalletScreeningProcessor(
    chainalysisAPI,
    eligibilityData,
    MAX_CHAINALYSIS_CONCURRENT_REQUESTS,
  );

  const outputData = await screeningProcessor.run();

  // save output data to file
  fs.writeFileSync(outputPath, outputData.join('\n') + '\n');
})();

/**
 * Parse command-line arguments.
 * @returns The parsed arguments.
 */
function parseArguments() {
  return yargs(hideBin(process.argv))
    .option('eligibility-data', {
      describe: 'Path to the address data CSV',
      type: 'string',
      demandOption: true,
    })
    .option('output', {
      describe: 'Output path of the screening results CSV',
      type: 'string',
      demandOption: true,
    })
    .parseSync();
}
