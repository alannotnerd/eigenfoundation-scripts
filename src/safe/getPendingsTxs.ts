import { initialize } from "./intialize";

export async function pendingTxs() {
  const { safeSdk, safeService } = await initialize();

  if (!safeSdk) throw new Error("Safe SDK not initialized");

  const safeAddress = await safeSdk.getAddress();

  console.log("Getting pending transactions...");

  const pendingTxs = await safeService.getPendingTransactions(safeAddress);

  console.log("Pending transactions:", pendingTxs);

  return pendingTxs;
}
