import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';

const eligibilityFilePath = 'data/eligible.csv';
const walletScreeningFilePath = 'data/wallet-screening.csv';

try {
  // Read the files
  const eligibilityFile = readFileSync(eligibilityFilePath, 'utf-8');
  const walletScreeningFile = readFileSync(walletScreeningFilePath, 'utf-8');

  // Parse the CSV data into JSON
  const eligibilityRecordsRaw = parse(eligibilityFile, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  const eligibilityMap = eligibilityRecordsRaw.reduce((acc: any, record: any) => {
    const address = record.Address;
    // const amount = parseFloat(record['Balance USD']);
    const amount = parseFloat(record['Share of TVL']);
    acc[address] = amount;
    return acc;
  }, {});

  const walletScreeningRecordsRaw = parse(walletScreeningFile, {
    columns: false,
    skip_empty_lines: true,
    bom: true,
  });

  const walletScreeningMap = walletScreeningRecordsRaw.reduce((acc: any, record: any) => {
    acc[record[0]] = record[1].trim();
    return acc;
  }, {});

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
    const risk = walletScreeningMap[address];
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

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Processing ${index}/${totalRecords}`);
    index++;
  }

  console.log();
  console.log(results);
} catch (error) {
  console.error('Error:', error);
}
