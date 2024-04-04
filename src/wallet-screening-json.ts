import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from 'fs';
import { SCREENING_CSV_PATH, SCREENING_JSON_PATH, CSV_PARSER_OPTIONS } from './constants';

try {
  // Read the CSV file
  const screeningCsvData = readFileSync(SCREENING_CSV_PATH, 'utf-8');

  // Parse the CSV data into JSON
  const screeningJson = parse(screeningCsvData, { ...CSV_PARSER_OPTIONS, columns: false });
  const result = screeningJson.reduce(
    (acc: object, [key, value]) => {
      acc[key] = value.trim();
      return acc;
    },
    {} as { [key: string]: string },
  );

  // Write the JSON data to a file
  writeFileSync(SCREENING_JSON_PATH, JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Error:', error);
}
