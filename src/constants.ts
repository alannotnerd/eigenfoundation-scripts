// Input and output paths
export const ELIGIBILITY_CSV_PATH = 'data/eligible.csv';
export const ELIGIBILITY_JSON_PATH = 'data/eligible.json';
export const SCREENING_JSON_PATH = 'data/eligible-screened.json';
export const SCREENING_CSV_PATH = 'data/eligible-screened.csv';
export const ADDRESSES_LIST_PATH = 'data/eligible-addresses.txt';

// CSV parser options
export const CSV_PARSER_OPTIONS = {
  // Assumes the first row contains column headings
  columns: true,
  skip_empty_lines: true,
  bom: true,
};
