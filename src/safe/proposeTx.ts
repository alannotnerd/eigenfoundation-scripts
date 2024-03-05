import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { initialize } from "./intialize";

type ProposeTxArgs = {
  transactions: MetaTransactionData[];
};

export async function proposeTx(args: ProposeTxArgs) {
  const { safeSdk, safeService, signer } = await initialize();

  if (!safeSdk) throw new Error("Safe SDK not initialized");

  const { transactions } = args;

  // Get the addresses
  const safeAddress = await safeSdk.getAddress();
  const senderAddress = await signer.getAddress();

  // Get the next nonce taking into account the pending transactions
  const nonce = await safeService.getNextNonce(safeAddress);

  console.log("Creating transactions...");

  // Create a Safe transaction with the provided parameters
  const safeTransaction = await safeSdk.createTransaction({
    transactions,
    options: {
      nonce,
    },
  });

  // Deterministic hash based on transaction parameters
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

  // Sign transaction to verify that the transaction is coming from signer
  const senderSignature = await safeSdk.signHash(safeTxHash);

  console.log("Proposing transaction...");

  // Propose the transaction
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: senderSignature.data,
  });

  console.log(`Transaction created: ${safeTxHash}`);
}
