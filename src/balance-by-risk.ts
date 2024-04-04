import { readFileSync, writeFileSync } from 'fs';
import { log, readAndParseCSV } from './utils';
import { ELIGIBILITY_CSV_PATH, SCREENING_JSON_PATH } from './constants';

try {
  // Read the files
  const eligibilityRecords = readAndParseCSV(ELIGIBILITY_CSV_PATH);
  const screenedWalletsFile = readFileSync(SCREENING_JSON_PATH, 'utf-8');

  const eligibilityMap = eligibilityRecords.reduce((acc: any, record: any) => {
    const address = record.Address;
    const amount = parseFloat(record['Balance USD']);
    // const amount = parseFloat(record['Share of TVL']);
    acc[address] = amount;
    return acc;
  }, {});

  const screenedWallets = JSON.parse(screenedWalletsFile);
  const totalRecords = eligibilityRecords.length;
  const results = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    error: 0,
  };

  let index = 1;
  let highAndSevereCsv = '';
  for (const [address, share] of Object.entries(eligibilityMap)) {
    const risk = screenedWallets[address];
    const addressBalance = share as number;

    if (risk === 'Severe') {
      results.severe += addressBalance;
      highAndSevereCsv += `${address},${addressBalance}\n`;
    } else if (risk === 'High') {
      results.high += addressBalance;
      highAndSevereCsv += `${address},${addressBalance}\n`;
    } else if (risk === 'Medium') {
      results.medium += addressBalance;
    } else if (risk === 'Low') {
      results.low += addressBalance;
    } else if (risk === 'Error') {
      results.error += addressBalance;
    } else {
      console.error(`Unknown risk for address ${address}: ${risk}`);
    }

    log(`Processing ${index}/${totalRecords}`);
    index++;
  }

  console.log();
  console.log(results);

  // Write to a CSV
  writeFileSync('data/high-and-severe.csv', highAndSevereCsv);
} catch (error) {
  console.error('Error:', error);
}
