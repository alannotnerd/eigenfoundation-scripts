import * as fs from 'fs';
import { retrieveRisk, streamFile, log } from './utils';
import { SCREENING_CSV_PATH, ADDRESSES_LIST_PATH } from './constants';

export interface WalletRisk {
  [address: string]: string;
}

const BATCH_SIZE = 30;

(async () => {
  const list = await streamFile(ADDRESSES_LIST_PATH);
  const processedWallets = await streamFile(SCREENING_CSV_PATH);

  const walletsRisk: WalletRisk = processedWallets.reduce(
    (result, item) => {
      const [address, risk] = item.split(', ');
      result[address] = risk;
      return result;
    },
    <WalletRisk>{},
  );

  const writer = fs.createWriteStream(SCREENING_CSV_PATH, { flags: 'a' });

  let processed = 1;
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list
      .slice(i, i + BATCH_SIZE)
      .filter((address: string) => !!address && walletsRisk[address] === undefined);

    const results = await Promise.all(
      batch.map(async (address: string) => {
        const risk = await retrieveRisk(address);
        log(`Processed ${processed++}: ${address}, ${risk}`);
        return `${address}, ${risk}\n`;
      }),
    );

    writer.write(results.join(''));
  }

  writer.end();
})();
