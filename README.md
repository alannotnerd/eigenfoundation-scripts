# EigenLayer Scripts

A collection of scripts for processing the airdrop data, including
- Wallet screening
- The merkle tree and proofs generation
- The signatures generation

## Prepare
Place the `eligible.csv` file in the `data` directory. The file should contain `Address`, `Balance USD`, `Share of TVL`, and `Allocation` fields.

## Run

1. First of all, the list of eligible addresses needs to be extracted from the `eligibility.csv` file. To do so, run `yarn extract-addresses`.
2. Next, the addresses should be screened to exclude any high-risk wallets from the airdrop. Run `yarn wallet-screening` and wait for it to finish.
3. Convert the screening results from CVS to JSON: `yarn wallet-screening-json`
4. And lastly, generate the merkle tree and proofs: `yarn create-merkle-tree`
