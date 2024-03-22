import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';

const ELIGIBILITY_CSV_PATH = 'data/eligible.csv';
const OUTPUT_PATH = 'data/eligible-addresses.txt';

try {
  // Read the CSV file
  const csvData = readFileSync(ELIGIBILITY_CSV_PATH, 'utf-8');

  // Parse the CSV data into JSON
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  // Write the list of addresses to a file
  writeFileSync(OUTPUT_PATH, records.map((record: any) => record.Address).join("\n"), 'utf-8');

  console.log(`The list of eligible addresses has been saved to ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Error:', error);
}
