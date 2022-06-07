import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { programs } from "@metaplex/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {filterMartians} from "../common/util";

export function useWalletNfts(): [
  programs.metadata.MetadataData[] | undefined,
  Dispatch<SetStateAction<programs.metadata.MetadataData[] | undefined>>
] {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nftList, setNftList] = useState<
    programs.metadata.MetadataData[] | undefined
  >();
  const prevWalletId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!prevWalletId.current) {
      prevWalletId.current = publicKey?.toBase58();
    } else if (prevWalletId.current !== publicKey?.toBase58()) {
      prevWalletId.current = publicKey?.toBase58();
      setNftList(undefined);
    }
  }, [publicKey]);

  useEffect(() => {
    let didCancel = false;
    const request = async () => {
      if (!publicKey || nftList) {
        return;
      }
      programs.metadata.Metadata.findDataByOwner(
        connection,
        publicKey
      ).then(
        (ownedMetadata) => {
          console.log('Wallet Nfts', { ownedMetadata });
          ownedMetadata = filterMartians(ownedMetadata);
          if (!didCancel) {
            setNftList(ownedMetadata);
          }
        }).catch(error =>{
        console.error("Error on findDataByOwner [Wallet Component]",error);
      });
    };

    request();

    return () => {
      didCancel = true;
    };
  }, [publicKey, nftList, connection]);

  return [nftList, setNftList];
}