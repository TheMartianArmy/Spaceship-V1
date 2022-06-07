import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import { programs } from "@metaplex/js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useStakeAccount } from "../hooks";

export function useStakedNfts(): [
  programs.metadata.MetadataData[] | undefined,
  Dispatch<SetStateAction<programs.metadata.MetadataData[] | undefined>>
] {
  const { connection } = useConnection();
  const stakeAccount = useStakeAccount();
  const [nftList, setNftList] = useState<
    programs.metadata.MetadataData[] | undefined
  >();
  const prevWalletId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!prevWalletId.current) {
      prevWalletId.current = stakeAccount?.address?.toBase58();
    } else if (prevWalletId.current !== stakeAccount?.address?.toBase58()) {
      prevWalletId.current = stakeAccount?.address?.toBase58();
      setNftList(undefined);
    }
  }, [stakeAccount?.address]);

  useEffect(() => {
    let didCancel = false;
    const request = async () => {
      if (!stakeAccount || nftList) {
        return;
      }
      programs.metadata.Metadata.findDataByOwner(
        connection,
        stakeAccount.address
      ).then((ownedMetadata) => {
        console.log('Staked Nfts', { ownedMetadata });
        if (!didCancel) {
          setNftList(ownedMetadata);
        }
      }).catch(error =>{
        console.error("Error on findDataByOwner [Staking Component]",error);
      });
    };

    request();

    return () => {
      didCancel = true;
    };
  }, [stakeAccount, connection, nftList]);

  return [nftList, setNftList];
}