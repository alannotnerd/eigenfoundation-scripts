import { AbiCoder, getBytes, keccak256, verifyMessage } from "ethers";
import { readFileSync, writeFileSync } from "fs";

const attestation = async (data: string) => {
  const target_info = readFileSync("/dev/attestation/my_target_info");
  writeFileSync("/dev/attestation/target_info", target_info);
  writeFileSync("/dev/attestation/user_report_data", Buffer.from(data.slice(2), "hex"));

  const quote = readFileSync("/dev/attestation/quote", "base64");
  console.log(quote)
}

(async () => {
  const content = readFileSync("./Top_Restakers_by_All_Final.response.json");
  const hash = keccak256(content);
  console.log(`Hash: ${hash}`);

  const response = JSON.parse(content.toString("utf-8"));
  const address = "0xd682cec5858EDeB651c16d8d3f0648044aAB9a5a";
  const infos = Object.entries(response) as any;
  const total = infos.length;
  let processed = 0;

  for (const [key, { signature, allocation }] of infos) {
    const encodedMessage = AbiCoder.defaultAbiCoder().encode(['address', 'uint256'], [key, allocation]);
    const messageHash = keccak256(keccak256(encodedMessage));
    const ethSignedMessageHash = getBytes(messageHash);
    const recovered = verifyMessage(ethSignedMessageHash, signature);
    if (recovered !== address) {
      console.log(`key: ${key}`);
      console.log(`Invalid signature: recovered is ${recovered} but expected ${address}`);
      process.exit(1);
    }
    processed++;
    process.stdout.write(`Processed ${processed}/${total}\r`);
  }
  attestation(hash);
})()

