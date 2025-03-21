import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Keypair,
} from "@solana/web3.js";
import { createBatchTransfer } from "./utils/createBatchTransfer";

/**
 * Generates an array of 21 random Solana public keys.
 *
 * Note: Each public key is generated by creating a new keypair.
 * The corresponding private keys are not returned.
 *
 * @returns {PublicKey[]} An array containing 21 Solana public keys.
 */
export function generate21PublicKeys(): PublicKey[] {
  const publicKeys: PublicKey[] = [];
  for (let i = 0; i < 21; i++) {
    const keypair = Keypair.generate();
    publicKeys.push(keypair.publicKey);
  }
  return publicKeys;
}

const AMOUNT_SOL = 0.01;

async function main() {
  // Set up the provider as in your resolvePool script
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log("Connection: ", provider.connection.rpcEndpoint);
  console.log(`Sender: ${provider.wallet.publicKey.toBase58()}`);

  // Create a new transaction and add a transfer instruction for each recipient.
  const recipients = generate21PublicKeys();
  const transaction = await createBatchTransfer(provider.wallet.publicKey, provider.connection, recipients, Array(recipients.length).fill(AMOUNT_SOL));
  
  // Sign, send, and confirm the transaction using the provider
  try {
    const signature = await provider.sendAndConfirm(transaction);
    console.log("Transaction successful with signature:", signature);
    console.log("Transaction size: ", transaction.serialize().length);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

main()
  .then(() => console.log("Batch SOL transfer completed"))
  .catch((err) => console.error("Error in batch SOL transfer:", err));
