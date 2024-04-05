import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import 'dotenv/config';
import { ChainalysisRiskLevel, EligibleAddressData, ScreeningData } from './types';
import { readAndParseCSV } from './utils/fs';
import { cleanEnv, str } from 'envalid'
import { ElegibilityMerkleTree, MerkleTreeSigner } from './modules';
import { Wallet } from 'ethers';
import { stringify } from './utils/miscellaneous';

const env = cleanEnv(process.env, {
    SIGNER_PRIVATE_KEY: str()
});

(async () => {
    const {
        eligibilityData: eligibilityDataPath,
        screeningData: screeningDataPath,
        output: outputPath
    } = parseArguments();

    const eligibilityData = readAndParseCSV<EligibleAddressData[]>(eligibilityDataPath);
    const screeningData = readAndParseCSV<ScreeningData>(screeningDataPath, false);

    const signer = new Wallet(env.SIGNER_PRIVATE_KEY);

    const eligibilityMerkleTree = new ElegibilityMerkleTree(eligibilityData, screeningData, [ChainalysisRiskLevel.Low, ChainalysisRiskLevel.Medium]);
    const tree = eligibilityMerkleTree.createTree();

    const merkleTreeSigner = new MerkleTreeSigner(tree, signer);
    const signedData = await merkleTreeSigner.signLeafs();

    // Write the list of addresses to a file
    fs.writeFileSync(outputPath, stringify(signedData), 'utf-8');
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
