import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { log } from './utils';
import { ELIGIBILITY_CSV_PATH, SCREENING_JSON_PATH, CSV_PARSER_OPTIONS } from './constants';

try {
  // Read the files
  const eligibilityFile = readFileSync(ELIGIBILITY_CSV_PATH, 'utf-8');
  const screenedWalletsFile = readFileSync(SCREENING_JSON_PATH, 'utf-8');

  // Parse the CSV data into JSON
  const eligibilityRecordsRaw = parse(eligibilityFile, CSV_PARSER_OPTIONS);

  const eligibilityMap = eligibilityRecordsRaw.reduce((acc: any, record: any) => {
    const address = record.Address;
    // const amount = parseFloat(record['Balance USD']);
    const amount = parseFloat(record['Share of TVL']);
    acc[address] = amount;
    return acc;
  }, {});

  const screenedWallets = JSON.parse(screenedWalletsFile);
  const totalRecords = eligibilityRecordsRaw.length;
  const results = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    error: 0,
  }

  let index = 1;
  for (const [address, share] of Object.entries(eligibilityMap)) {
    const risk = screenedWallets[address];
    const addressBalance = share as number;

    if(risk === 'Severe') {
      results.severe += addressBalance;
    } else if(risk === 'High') {
      results.high += addressBalance
    } else if(risk === 'Medium') {
      results.medium += addressBalance;
    } else if(risk === 'Low') {
      results.low += addressBalance;
    } else if(risk === 'Error') {
      results.error += addressBalance;
    } else {
      console.error(`Unknown risk for address ${address}: ${risk}`);
    }

    log(`Processing ${index}/${totalRecords}`);
    index++;
  }

  console.log();
  console.log(results);
} catch (error) {
  console.error('Error:', error);
}
