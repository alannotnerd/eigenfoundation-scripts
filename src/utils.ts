import axios from 'axios';
import { createReadStream } from 'fs';
import * as readline from 'readline';

export async function retrieveRisk(address: string): Promise<string> {
  const entitiesUrl = `${process.env.CHAINALYSIS_BASE_URL}/v2/entities`;
  const config = {
    headers: {
      Token: process.env.CHAINALYSIS_API_KEY,
      Accept: 'application/json',
    },
  };

  try {
    await axios.post(entitiesUrl, { address: address }, config);
    const { data } = await axios.get(`${entitiesUrl}/${address}`, config);
    return data.risk;
  } catch (error: any) {
    console.log(error);
    return 'Error';
  }
}

export async function streamFile(filePath: string): Promise<string[]> {
  const fileStream = createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines: string[] = [];

  for await (const line of rl) {
    lines.push(line);
  }

  return lines;
}

export function log(message: string): void {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}
