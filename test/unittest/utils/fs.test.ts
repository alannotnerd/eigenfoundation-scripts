import { readAndParseCSV } from '../../../src/utils/fs';
import * as fs from 'fs';

jest.mock('fs');

type CsvData = { name: string; age: string };

describe('readAndParseCSV', () => {
  const filePath = '/path/to/file.csv';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read and parse the CSV file', () => {
    const data: string = 'name,age\nJohn,30\nJane,25\n';
    const parsedData: CsvData[] = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ];
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(data);
    const result = readAndParseCSV<Array<CsvData>>(filePath, ['name', 'age']);
    expect(result).toEqual(parsedData);
  });

  it('should fail reading invalid CSV (missing column)', () => {
    const csvData = 'name,age\nJohn,30\nJane\n';
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(csvData);
    expect(() => readAndParseCSV<CsvData[]>(filePath, ['name', 'age'])).toThrow(
      'Invalid Record Length: columns length is 2, got 1 on line 3',
    );
  });

  it('should throw when reading an empty CSV', () => {
    const data = '';
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(data);
    expect(() => readAndParseCSV<Array<CsvData>>(filePath, ['name', 'age'])).toThrow('No data found in the CSV file');
  });

  it('should fail reading invalid CSV (extra column)', () => {
    const csvData = 'name,age\nJohn,30\nJane,123,32\n';
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(csvData);
    expect(() => readAndParseCSV<CsvData[]>(filePath, ['name', 'age'])).toThrow(
      'Invalid Record Length: columns length is 2, got 3 on line 3',
    );
  });

  it('should throw validating headers', () => {
    const csvData = 'name,aga\nJohn,30\nJane,123\n';
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(csvData);
    expect(() => readAndParseCSV<Array<CsvData>>('path', ['name', 'age'])).toThrow(
      'Invalid headers: expected headers are name,age',
    );
  });
});
