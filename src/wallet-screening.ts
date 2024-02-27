import axios from 'axios';
import * as fs from 'fs';
import * as readline from 'readline';

export async function isHighRiskWallet(address: string): Promise<boolean> {
  const entitiesUrl = `${process.env.CHAINALYSIS_BASE_URL}/v2/entities`;
  const config = {
    headers: {
      Token: process.env.CHAINALYSIS_API_KEY,
      Accept: 'application/json',
    },
  };

  await axios.post(entitiesUrl, { address: address }, config);
  const { data } = await axios.get(`${entitiesUrl}/${address}`, config);
  return data.risk;
}

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
    const list = await loadCSV('data/just-addresses.csv');
    const writer = fs.createWriteStream('data/wallet-screening.csv');

    const batchSize = 50;
    let processed = 1;

    for (let i = 0; i < list.length; i += batchSize) {
        const batch = list.slice(i, i + batchSize).filter(address => !!address);
        console.log(`Processing ${batch.length} addresses...`);

        const results = await Promise.all(
            batch
                
                .map(async (address) => {
                    const risk = await isHighRiskWallet(address);
                    console.log(`${processed++}: ${address}, ${risk}`);
                    return `${address}, ${risk}\n`
                })
        );

        writer.write(results.join(''));
    }

    writer.end();
})();
