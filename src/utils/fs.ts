import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

/**
 * Read and parse a CSV file.
 * @param filePath - The path to the CSV file.
 * @param firstRowColumns - Whether the first row contains the column names.
 * @returns The parsed CSV data.
 */
export function readAndParseCSV<T extends Array<unknown>>(filePath: string, firstRowColumns = true): T {
  const csvData = readFileSync(filePath, 'utf-8');
  return parse(csvData, {
    columns: firstRowColumns,
    skip_empty_lines: true,
    bom: true,
  });
}
