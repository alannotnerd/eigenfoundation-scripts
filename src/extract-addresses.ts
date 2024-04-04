import { writeFileSync } from 'fs';
import { ELIGIBILITY_CSV_PATH, ADDRESSES_LIST_PATH } from './constants';
import { readAndParseCSV } from './utils';

try {
  const records = readAndParseCSV(ELIGIBILITY_CSV_PATH);

  // Write the list of addresses to a file
  writeFileSync(ADDRESSES_LIST_PATH, records.map((record: any) => record.Address).join('\n'), 'utf-8');

  console.log(`The list of eligible addresses has been saved to ${ADDRESSES_LIST_PATH}`);
} catch (error) {
  console.error('Error:', error);
}
