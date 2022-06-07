import { programs } from '@metaplex/js';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Spinner, StakeButton } from '../components';
import { RewarderAccount } from '../hooks/useRewarder';
import { StakeAccount } from '../hooks/useStakeAccount';

export interface NFTProps {
  nft: programs.metadata.MetadataData;
  rewarder?: RewarderAccount | null;
  stakeAccount?: StakeAccount | null;
  isStaked: boolean;
  onChange: (nft: programs.metadata.MetadataData) => void;
}

export const NFT: FC<NFTProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>({});
  useEffect(() => {
    setLoading(true);
    axios
      .get(props.nft.data.uri)
      .then((res) => {
        setMetadata(res?.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [props.nft, setLoading, setMetadata]);

  if (loading) {
    return (
      <div className="h-24 p-2 flex justify-between items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={"margin-10"}>
      <img
        className="w-80 h-80 object-cover mx-auto nft-image"
        alt="nft"
        src={metadata.image}
      />
      <h6 className="tc-white nft-name py-2">{metadata?.name}</h6>
      <StakeButton {...props} onChange={props.onChange} />
    </div>
  );
};
