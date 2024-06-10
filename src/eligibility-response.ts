import 'dotenv/config';
import { ScreenedAddress } from './types';
import { readAndParseCSV } from './utils/fs';
import { EligibilityMerkleTree } from './modules';
import { ACCEPTED_RISK_LEVELS, SCREENED_ADDRESS_HEADERS } from './constants';
import fs from "fs";

const attestation = async (data: string) => {
  const target_info = fs.readFileSync("/dev/attestation/my_target_info");
  fs.writeFileSync("/dev/attestation/target_info", target_info);
  fs.writeFileSync("/dev/attestation/user_report_data", Buffer.from(data.slice(2), "hex"));

  const quote = fs.readFileSync("/dev/attestation/quote", "base64");
  console.log(quote)
}


(async () => {
  const screeningDataPath = "aethir-allocation.csv";

  const screeningData = readAndParseCSV<ScreenedAddress[]>(
    screeningDataPath,
    JSON.parse(JSON.stringify(SCREENED_ADDRESS_HEADERS)),
  );

  const eligibilityMerkleTree = new EligibilityMerkleTree(screeningData);
  const tree = eligibilityMerkleTree.createTree();

  console.log(
    "Proof of [0xb199Fd83378d33590E56018C1B9E5d2d8390B21f, 5000000000000000000000n]: ",
    tree.getProof(["0xb199Fd83378d33590E56018C1B9E5d2d8390B21f", 5000000000000000000000n]))
})();

