import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { Wallet, solidityPackedKeccak256, getBytes } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import { ELIGIBILITY_CSV_PATH, SCREENING_JSON_PATH, ELIGIBILITY_JSON_PATH } from './constants';
import { log, retrieveRisk, readAndParseCSV } from './utils';

async function excludeHighRiskAddresses(
  addresses: Record<string, any>,
  screeningResults: Record<string, string>,
): Promise<Record<string, any>> {
  // TODO: Print a message if the API call is being made
  // TODO: Risk can be Error if the API call fails, handle this case
  for (const address of Object.keys(addresses)) {
    const risk = screeningResults[address] || (await retrieveRisk(address));
    if (risk !== 'Medium' && risk !== 'Low') {
      delete addresses[address];
    }
  }
  return addresses;
}

function collectEligibleAddresses(records: any[]): Record<string, any> {
  return records.reduce((acc, record) => {
    const amount = (Math.round(Number(record['Balance USD']) * 100) / 100).toFixed(0);
    acc[record.Address] = { amount };
    return acc;
  }, {});
}

async function generateSignature(address: string, amount: string, signer: Wallet): Promise<string> {
  const messageHash = solidityPackedKeccak256(['address', 'uint256'], [address, amount]);
  const ethSignedMessageHash = getBytes(messageHash);
  const signature = await signer.signMessage(ethSignedMessageHash);
  return signature;
}

function createMerkleTree(eligibleAddresses: Record<string, any>): StandardMerkleTree<any[]> {
  const values = Object.entries(eligibleAddresses).map(([address, properties]) => [address, properties['amount']]);
  return StandardMerkleTree.of(values, ['address', 'uint256']);
}

(async () => {
  // TODO: Error if the private key is missing
  try {
    console.log('Reading data');
    const eligibilityCvsData = readAndParseCSV(ELIGIBILITY_CSV_PATH);
    const screeningResults = JSON.parse(readFileSync(SCREENING_JSON_PATH, 'utf-8'));

    console.log('Processing eligible addresses');
    let eligibleAddresses = collectEligibleAddresses(eligibilityCvsData);
    eligibleAddresses = await excludeHighRiskAddresses(eligibleAddresses, screeningResults);

    console.log('Creating the Merkle tree');
    const tree = createMerkleTree(eligibleAddresses);

    const eligibility = {};
    const signer = new Wallet(process.env.SIGNER_PRIVATE_KEY);
    const totalAddresses = Object.keys(eligibleAddresses).length;

    console.log('Generating proofs and signatures');
    for (const [index, leaf] of tree.entries()) {
      const [address, amount] = leaf;
      log(`[${index}/${totalAddresses}] Creating a signature for ${address}`);

      const proof = tree.getProof(index);
      const signature = await generateSignature(address, amount, signer);

      eligibility[address] = {
        signature: signature,
        proof: proof,
        amount: amount,
      };
    }

    // Log the Merkle root
    console.log(`\nMerkle Root: ${tree.root}`);

    // Write the list of addresses to a file
    writeFileSync(ELIGIBILITY_JSON_PATH, JSON.stringify(eligibility), 'utf-8');
  } catch (error) {
    console.error('Error:', error);
  }
})();
