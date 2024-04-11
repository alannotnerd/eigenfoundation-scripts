import 'dotenv/config';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { EligibleCSVAddress } from './types';
import { ChainalysisAPI, readAndParseCSV } from './utils';
import { cleanEnv, str } from 'envalid';
import { WalletScreeningProcessor } from './modules';
import {
  CHAINALYSIS_API_URL,
  ELIGIBLE_ADDRESS_HEADERS,
  MAX_CHAINALYSIS_CONCURRENT_REQUESTS,
  SCREENED_ADDRESS_HEADERS,
} from './constants';
import path from 'path';

const env = cleanEnv(process.env, {
  CHAINALYSIS_API_KEY: str(),
});

(async () => {
  const { eligibilityData: eligibilityDataPath, output: outputPath } = parseArguments();
  const eligibilityData = readAndParseCSV<EligibleCSVAddress[]>(
    eligibilityDataPath,
    JSON.parse(JSON.stringify(ELIGIBLE_ADDRESS_HEADERS)),
  );
  const chainalysisAPI = new ChainalysisAPI(CHAINALYSIS_API_URL, env.CHAINALYSIS_API_KEY);
  const screeningProcessor = new WalletScreeningProcessor(
    chainalysisAPI,
    eligibilityData,
    MAX_CHAINALYSIS_CONCURRENT_REQUESTS,
  );

  const outputData = await screeningProcessor.run();

  // save output data to file
  fs.writeFileSync(outputPath, [SCREENED_ADDRESS_HEADERS.join(','), ...outputData].join('\n') + '\n');
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
    .check((argv) => {
      if (fs.existsSync(path.dirname(argv.output))) {
        return true;
      } else {
        throw new Error('Invalid output path, directory does not exist');
      }
    })
    .parseSync();
}
