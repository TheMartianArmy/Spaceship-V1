import { Idl, Program, Provider } from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import idl from "../idl.json";

const opts: ConfirmOptions = {
  preflightCommitment: "processed",
};

// Martian Army
const programId = new PublicKey("DpQHKRuMRANSGEXa3FH12JWchskXKuPduHDBadEHtvfo");

export function useProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useMemo(() => {
    if (!wallet) return;
    const provider = new Provider(connection, wallet, opts);
    return new Program(idl as Idl, programId, provider);
  }, [connection, wallet]);
}
