import { BN, Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Trepa } from "../../target/types/trepa";

/**
 * Creates a new prediction.
 * @param program - The program instance.
 * @param wallet - The wallet instance.
 * @param poolId - The pool to be predicted. (16 bytes uuid)
 * @param prediction - The prediction to be made.
 * @param stake - The stake to be made.
 */
export async function claimReward(
    program: Program<Trepa>, 
    wallet: PublicKey, 
    poolId: string, 
): Promise<Transaction> {
    
    console.log("Program ID:", program.programId.toBase58());

    // Get the PDA for the pool
    const cleanedPoolId = poolId.replace(/-/g, '');
    const poolBytes = Buffer.from(cleanedPoolId, 'hex');
    const [poolPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolBytes],
        program.programId
    );
    console.log("Pool PDA:", poolPDA.toBase58());

    // Get the PDA for the prediction       
    const [predictionPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("prediction"), poolPDA.toBuffer(), wallet.toBuffer()],
        program.programId
    );
    console.log("Prediction PDA:", predictionPDA.toBase58());

    // Create the prediction
    const tx = await program.methods
        .claimRewards()
        .accounts({
            prediction: predictionPDA,
            pool: poolPDA,
            predictor: wallet,
            systemProgram: SystemProgram.programId,
        })
        .transaction();

    console.log(`Transaction created! ${tx}`);
    return tx;
}