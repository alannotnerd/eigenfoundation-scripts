import { initialize } from "./intialize";

type ExecuteTxArgs = {
  safeTxHash: string;
};

export async function executeTx(args: ExecuteTxArgs) {
  const { safeSdk, safeService, networkInfo } = await initialize();

  if (!safeSdk) throw new Error("Safe SDK not initialized");

  const { safeTxHash } = args;

  console.log("Executing transaction...");

  // Get the transaction from the Safe service
  const safeTransaction = await safeService.getTransaction(safeTxHash);

  // Check if the transaction can be executed
  const isValidTx = await safeSdk.isValidTransaction(safeTransaction);

  if (!isValidTx) throw new Error("Invalid transaction");

  // Execute the transaction
  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

  // Wait for the transaction to be processed
  const receipt = await executeTxResponse.transactionResponse?.wait();

  console.log("Transaction executed:");

  console.log(`${networkInfo?.scan}/tx/${receipt?.hash}`);
}
