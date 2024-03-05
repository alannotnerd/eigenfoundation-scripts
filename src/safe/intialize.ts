import dotenv from "dotenv";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

dotenv.config();

const networksInfo = {
  ["1"]: {
    name: "mainnet",
    scan: "https://etherscan.io",
    prefix: "eth",
  },
  ["11155111"]: {
    name: "sepolia",
    scan: "https://sepolia.etherscan.io",
    prefix: "sep",
  },
};

export async function initialize() {
  const RPC_URL = process.env.RPC_URL!;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS;
  const SIGNER_PK = process.env.SIGNER_PK!;

  console.log("Initializing Safe SDK...");

  // Initialize provider
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const { chainId } = await provider.getNetwork();
  const networkInfo = networksInfo[chainId.toString()];

  // Initialize signer
  const signer = new ethers.Wallet(SIGNER_PK, provider);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeFactory = await SafeFactory.create({
    ethAdapter,
  });

  const safeSdk = SAFE_ADDRESS
    ? await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRESS })
    : null;

  const safeService = new SafeApiKit({ chainId });

  console.log("Safe SDK Initialized!");

  return {
    provider,
    signer,
    ethAdapter,
    safeFactory,
    safeSdk,
    safeService,
    networkInfo,
  };
}
