import * as fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

/**
 * Reads a JSON file and parses its content.
 * @param filePath Path to the JSON file.
 * @returns The parsed JSON content, or undefined if the file doesn't exist or is invalid.
 */
export async function readJsonFile<T>(filePath: string): Promise<T | undefined> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    return undefined;
  }
}

export function readAndParseCSV<T>(filePath: string, firstRowColumns = true): T {
  const csvData = readFileSync(filePath, 'utf-8');

  return parse(csvData, {
    columns: firstRowColumns,
    skip_empty_lines: true,
    bom: true,
  });
}
