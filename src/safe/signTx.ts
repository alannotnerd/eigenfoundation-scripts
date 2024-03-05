import { initialize } from "./intialize";

type SignTxArgs = {
  safeTxHash: string;
};

export async function signTx(args: SignTxArgs) {
  const { safeSdk, safeService } = await initialize();

  if (!safeSdk) throw new Error("Safe SDK not initialized");

  const { safeTxHash } = args;

  console.log("Signing transaction...");

  const signature = await safeSdk.signHash(safeTxHash);

  await safeService.confirmTransaction(safeTxHash, signature.data);

  console.log("Transaction signed!");
}
