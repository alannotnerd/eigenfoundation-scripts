import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';
import { ELIGIBILITY_CSV_PATH, ADDRESSES_LIST_PATH, CSV_PARSER_OPTIONS} from './constants';

try {
  // Read the CSV file
  const csvData = readFileSync(ELIGIBILITY_CSV_PATH, 'utf-8');

  // Parse the CSV data into JSON
  const records = parse(csvData, CSV_PARSER_OPTIONS);

  // Write the list of addresses to a file
  writeFileSync(ADDRESSES_LIST_PATH, records.map((record: any) => record.Address).join("\n"), 'utf-8');

  console.log(`The list of eligible addresses has been saved to ${ADDRESSES_LIST_PATH}`);
} catch (error) {
  console.error('Error:', error);
}
