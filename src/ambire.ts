import { ethers, isAddress } from "ethers";
import * as fs from 'fs';
import * as readline from 'readline';

// Connect to a provider (e.g., Infura, Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// // ABI containing just the isValidSignature method
const abi = [
  "function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4)",
];

// const abi = [
//   "function implementation() public view returns (address)",
// ];

// // EIP-1271 Magic Value
// const EIP1271_MAGIC_VALUE = '0x1626ba7e';

// enum AccountType {
//     EOA = 'eoa',
//     EIP1271 = 'eip1271',
//     NOT_SUPPORTED = 'not_supported'
// }

// async function getAccountType(address: string): Promise<AccountType> {
//     // Check if the address has associated contract code
//     const code = await provider.getCode(address);

//     // If no code, it's an EOA, return true
//     if (code === '0x') {
//         return AccountType.EOA;
//     }

//     // Create a contract instance
//     const contract = new ethers.Contract(address, abi, provider);

//     try {
//         // Call the isValidSignature method with dummy values
//         const result = await contract.isValidSignature(ethers.randomBytes(32), []);
//         // Check if the magic value is returned
//         return result === EIP1271_MAGIC_VALUE ? AccountType.EIP1271 : AccountType.NOT_SUPPORTED;
//     } catch (error) {
//         // If the function doesn't exist or fails, it's not EIP-1271 compliant
//         return AccountType.NOT_SUPPORTED;
//     }
// };

async function loadCSV(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines: string[] = [];

    for await (const line of rl) {
        lines.push(line);
    }

    return lines;
}

(async () => {
    const list = await loadCSV('data/possibly-ambire.csv');
    const writer = fs.createWriteStream('data/ambire-result.csv');

    const batchSize = 50;
    let processed = 1;

    for (let i = 0; i < list.length; i += batchSize) {
        const batch = list.slice(i, i + batchSize).filter(address => !!address);
        console.log(`Processing ${batch.length} addresses...`);

        const results = await Promise.all(
            batch
                .map(async (address) => {
                    const contract = new ethers.Contract(address, abi, provider);
                    let isAmbire = false;

                    try {
                      await contract.isValidSignature(ethers.randomBytes(32), '0x0000000000000000000000000000000000000000000000000000000000000280')
                      isAmbire = false;
                    } catch (error: any) {
                      if (error.message.includes('invalid signature')) {
                        isAmbire = true;
                      } else {
                        console.log(`Error: ${address}, ${error}`);
                      }
                    }
                    
                    console.log(`${processed++}: ${address}, ${isAmbire}`);
                    return `${address}, ${isAmbire}\n`
                })
        );

        writer.write(results.join(''));
    }

    writer.end();
})();
