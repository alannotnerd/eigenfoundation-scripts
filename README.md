# EigenLayer Scripts

A collection of scripts for processing the EIGEN distribution data.

## Features

- **Wallet screening**: Queries the Chainalysis API and assigns a risk score to each address
- **The merkle tree and proofs generation**: Creates a merkle tree with all eligible wallets and generates proofs for each of them
- **The signatures generation**: A unique signature is created for each address, which is used to claim the EIGEN tokens

## Prerequisites

Ensure you have a valid Chainalysis API key. This key must be set as the `CHAINALYSIS_API_KEY` environment variable before running the script.

The signer private key must be set in the env variable `SIGNER_PRIVATE_KEY`, and should match the signer address from the merkle distributor contract.

And lastly, the eligibility CSV must contain the `Restaker`, `Balance USD`, and `Allocation (EIGEN)` fields.

## Installation

1. Clone the repository.
```bash
git clone git@github.com:defi-wonderland/eigenfoundation-scripts.git
```

2. Install the necessary dependencies.
```bash
yarn install
```

3. Set up the `.env` file with the required environment variables.

4. Prepare the eligibility and optionally the screening data files.

## Usage

There are 2 scripts in the repository.

### Wallet Screening

This script will screen all addresses in the eligibility CSV file and output a new CSV file with the risk score for each address. It takes approximately 1 hour to screen 100k addresses.

```bash
yarn wallet-screening --eligibility-data data/eligible.csv --output data/eligible-screened.csv
```

#### Parameters

All parameters are mandatory.

| Option               | Description                              |
| -------------------- | -----------------------------------------|
| `eligibility-data`   | Path to the address data CSV             |
| `output`             | Output path of the screening results CSV |

### Merkle Tree and Proofs Generation

Generates the merkle tree and prints its root in the console. It also generates the merkle proofs for each of the addresses in the eligibility CSV file, excluding the ones that are assigned a risk score above the threshold. Finally, a claim signature is created for the eligible addresses and is saved to the same file as the proofs.

```bash
yarn eligibility-response --eligibility-data data/eligible.csv --screening-data data/eligible-screened.csv --output data/proofs-and-signatures.json
```

#### Parameters

All parameters are mandatory.

| Option               | Description                               |
| -------------------- | ------------------------------------------|
| `eligibility-data`   | Path to the address data CSV              |
| `screening-data`     | Path to the screening results CSV          |
| `output`             | Output path of the processed results JSON |

## License
The primary license for the scripts is MIT, see [`LICENSE`](./LICENSE).

## Contributors

EigenLayer scripts were built with ❤️ by [Wonderland](https://defi.sucks).

Wonderland is the largest core development group in web3. Our commitment is to the financial future that's open, decentralized, and accessible to all.

[DeFi sucks](https://defi.sucks), but Wonderland is here to make it better.
