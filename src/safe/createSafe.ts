import { SafeAccountConfig } from "@safe-global/protocol-kit";
import { initialize } from "./intialize";

type CreateSafeArgs = {
  owners: string[];
  threshold: number;
};

export async function createSafe(args: CreateSafeArgs) {
  const { safeFactory, networkInfo } = await initialize();

  const { owners, threshold } = args;

  const safeAccountConfig: SafeAccountConfig = {
    owners,
    threshold,
  };

  console.log("Deploying Safe...");

  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

  const safeAddress = await safeSdk.getAddress();

  console.log("Your Safe has been deployed:");
  console.log(`${networkInfo?.scan}/address/${safeAddress}`);
  console.log(`https://app.safe.global/${networkInfo?.prefix}:${safeAddress}`);
}
