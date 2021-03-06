import { programs } from "@metaplex/js";
import { web3, Idl, Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Connection } from "@solana/web3.js";
import { RewarderAccount } from "../hooks/useRewarder";
import { StakeAccount } from "../hooks/useStakeAccount";
import * as SplToken from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

export interface StakeProps {
  nft: programs.metadata.MetadataData;
  rewarder: RewarderAccount;
  stakeAccount: StakeAccount;
  wallet: WalletContextState;
  connection: Connection;
  program: Program<Idl>;
}

export async function createAccountsAndStake(props: StakeProps) {
  const owner = props.wallet;
  const stakeAccountAddress = props.stakeAccount.address.toBase58();
  const instructions: web3.TransactionInstruction[] = [];

  const mint = props.rewarder.data.rewardMint;
  const rewardAuthority = props.rewarder.rewardAuthority;

  const rewardVault = await anchor.utils.token.associatedAddress({ mint, owner: rewardAuthority });
  console.log({ rewardVault: rewardVault.toBase58() });

  if (props.stakeAccount === undefined) {
    throw new Error("still loading stake account, please wait");
  } else if (props.stakeAccount?.data === null) {
    // create stake account if needed
    if (props.wallet.publicKey === null) {
      throw new WalletNotConnectedError();
    }
    instructions.push(
      props.program.instruction.initializeStakeAccount(
        props.stakeAccount.bump,
        {
          accounts: {
            owner: owner.publicKey!,
            stakeAccount: props.stakeAccount.address,
            rewarder: props.rewarder.address,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          },
        }
      )
    );
  }

  // create reward account if needed
  const tokenAccountAddress = await SplToken.Token.getAssociatedTokenAddress(
    SplToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    SplToken.TOKEN_PROGRAM_ID,
    props.rewarder.data.rewardMint,
    owner.publicKey!,
    false
  );
  const receiverAccount = await props.connection.getAccountInfo(
    tokenAccountAddress
  );

  if (receiverAccount === null) {
    instructions.push(
      SplToken.Token.createAssociatedTokenAccountInstruction(
        SplToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        SplToken.TOKEN_PROGRAM_ID,
        props.rewarder.data.rewardMint,
        tokenAccountAddress,
        owner.publicKey!,
        owner.publicKey!
      )
    );
  }

  // create PDA Associated Token Account

  const nftMint = new web3.PublicKey(props.nft.mint);

  const nftTokenAccountAddress = await SplToken.Token.getAssociatedTokenAddress(
    SplToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    SplToken.TOKEN_PROGRAM_ID,
    nftMint,
    owner.publicKey!,
    false
  );
  const nftMetadata = await Metadata.getPDA(nftMint);
  instructions.push(
    props.program.instruction.stakeNft({
      accounts: {
        owner: owner.publicKey!.toBase58(),
        rewarder: props.rewarder.address.toBase58(),
        rewardAuthority: props.rewarder.rewardAuthority.toBase58(),
        stakeAccount: stakeAccountAddress,
        rewardMint: props.rewarder.data.rewardMint.toBase58(),
        rewardTokenAccount: tokenAccountAddress.toBase58(),
        nftMint: nftMint.toBase58(),
        nftTokenAccount: nftTokenAccountAddress,
        tokenProgram: SplToken.TOKEN_PROGRAM_ID.toBase58(),
        systemProgram: web3.SystemProgram.programId.toBase58(),
        rent: web3.SYSVAR_RENT_PUBKEY.toBase58(),
        clock: web3.SYSVAR_CLOCK_PUBKEY.toBase58(),
        rewardVault: rewardVault.toBase58(),
      },
      remainingAccounts: [
        { pubkey: nftMetadata, isSigner: false, isWritable: false },
      ],
    })
  );
  let transaction = new web3.Transaction().add(...instructions);
  let signature = await props.wallet.sendTransaction(
    transaction,
    props.connection
  );
  return props.connection.confirmTransaction(signature, "confirmed");
}

export async function unstakeNft(props: StakeProps) {
  console.log('Unstaking NFT');
  const tokenAccountAddress = await SplToken.Token.getAssociatedTokenAddress(
    SplToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    SplToken.TOKEN_PROGRAM_ID,
    props.rewarder.data.rewardMint,
    props.wallet.publicKey!,
    false
  );
  const nftMint = new web3.PublicKey(props.nft.mint);
  const nftTokenAccountAddress = await SplToken.Token.getAssociatedTokenAddress(
    SplToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    SplToken.TOKEN_PROGRAM_ID,
    nftMint,
    props.wallet.publicKey!,
    false
  );

  const mint = props.rewarder.data.rewardMint;
  const rewardAuthority = props.rewarder.rewardAuthority;

  const rewardVault = await anchor.utils.token.associatedAddress({ mint, owner: rewardAuthority });
  console.log({ rewardVault: rewardVault.toBase58() });

  return props.program.rpc.unstakeNft({
    accounts: {
      owner: props.wallet.publicKey!.toBase58(),
      rewarder: props.rewarder.address.toBase58(),
      rewardAuthority: props.rewarder.rewardAuthority.toBase58(),
      stakeAccount: props.stakeAccount.address.toBase58(),
      rewardMint: props.rewarder.data.rewardMint.toBase58(),
      rewardTokenAccount: tokenAccountAddress.toBase58(),
      nftMint: nftMint.toBase58(),
      nftTokenAccount: nftTokenAccountAddress,
      tokenProgram: SplToken.TOKEN_PROGRAM_ID.toBase58(),
      systemProgram: web3.SystemProgram.programId.toBase58(),
      rent: web3.SYSVAR_RENT_PUBKEY.toBase58(),
      clock: web3.SYSVAR_CLOCK_PUBKEY.toBase58(),
      rewardVault: rewardVault.toBase58(),
    },
  });
}
