import * as fs from 'fs';
import { ethers } from 'ethers';
import { streamFile } from './utils';

// Connect to a provider (e.g., Infura, Alchemy)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const BATCH_SIZE = 50;

const abi = ['function implementation() public view returns (address)'];

(async () => {
  const list = await streamFile('data/contracts.csv');
  const writer = fs.createWriteStream('data/tmp-result.csv');

  let processed = 1;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE).filter((address) => !!address);
    console.log(`Processing ${batch.length} addresses...`);

    const results = await Promise.all(
      batch.map(async (address) => {
        const contract = new ethers.Contract(address, abi, provider);
        let proxyAddress;

        try {
          proxyAddress = await contract.implementation();

          if (
            proxyAddress == '' ||
            proxyAddress == '0x0000000000000000000000000000000000000000' ||
            proxyAddress == 'undefined' ||
            proxyAddress === undefined
          ) {
            proxyAddress = await provider.getStorage(address, 0);
          }
        } catch (e) {
          try {
            proxyAddress = await provider.getStorage(address, 0);
          } catch (e) {
            console.log(`Error: ${e}, address: ${address}`);
          }
        }

        console.log(`${processed++}: ${address}, ${proxyAddress}`);
        return `${address}, ${proxyAddress}\n`;
      }),
    );

    writer.write(results.join(''));
  }

  writer.end();
})();
