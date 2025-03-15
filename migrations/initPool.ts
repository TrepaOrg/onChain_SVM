import * as anchor from "@project-serum/anchor";
import { Trepa } from "../target/types/trepa";
import { createPool } from "./utils/createPool";
import { ConnectedSolanaWallet } from "@privy-io/react-auth";

async function main() {
  // Set up the provider and program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Trepa as anchor.Program<Trepa>;

  if (!program) {
    throw new Error("⚠️ Program not found. Make sure it is deployed.");
  }

  console.log(`📜 Program loaded with ID: ${program.programId.toBase58()}`);


  const question = "b9cdc74e-c59a-4dbc-8006-c3e32604081a"; // 16 bytes uuid
  // Calculate prediction end time one year later (in seconds)
  const predictionEndTime = Math.floor(Date.now() / 1000) + 31536000;
  // Prepare transaction to initialize the Config account
  const tx = await createPool(
    program, 
    provider.wallet.publicKey, 
    question, 
    predictionEndTime
  );

  const signature = await provider.sendAndConfirm(tx);
  console.log("Transaction Signature:", signature);
}

main()
  .then(() => console.log("Initialization successful"))
  .catch((err) => {
    console.error("Error initializing:", err);
  });
