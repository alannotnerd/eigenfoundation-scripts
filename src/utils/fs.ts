import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

/**
 * Read and parse a CSV file.
 * @param filePath - The path to the CSV file.
 * @param firstRowColumns - Whether the first row contains the column names.
 * @returns The parsed CSV data.
 */
export function readAndParseCSV<T extends Array<unknown>>(filePath: string, headers: string[]): T {
  const csvData = readFileSync(filePath, 'utf-8');
  const parsedData = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  if (parsedData.length === 0) {
    throw new Error('No data found in the CSV file');
  }
  validateHeaders(parsedData, headers);
  return parsedData;
}

export const validateHeaders = (parsedData: Record<string, unknown>[], headers: string[]) => {
  if (parsedData.length > 0) {
    const parsedHeaders = Object.keys(parsedData[0]);
    for (const header of headers) {
      if ((parsedHeaders.findIndex((v) => v === header) === -1)) {
        throw new Error(`Invalid headers: expected headers are ${headers}`);
      }
    }

  }
};
