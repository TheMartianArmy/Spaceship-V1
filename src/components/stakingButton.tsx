import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { FC, useCallback, useState } from 'react';
import { Spinner } from './index';
import { NFTProps } from '../containers/nfts';
import { useNotify, useProgram } from '../hooks';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { createAccountsAndStake, unstakeNft } from '../common/actions';

export const StakeButton: FC<NFTProps> = (props) => {
  const notify = useNotify();

  const [loading, setLoading] = useState(false);
  const program = useProgram();
  const wallet = useWallet();
  const { connection } = useConnection();
  // check has stake account
  const onClick = useCallback(async () => {
    const owner = wallet;
    if (
      !program ||
      owner === null ||
      owner.publicKey === null ||
      !props.rewarder ||
      !props.stakeAccount ||
      !props.stakeAccount?.address
    )
      throw new WalletNotConnectedError();
    try {
      if (loading === true) return;
      setLoading(true);
      if (props.isStaked) {
        await unstakeNft({
          program,
          wallet,
          connection,
          rewarder: props.rewarder,
          stakeAccount: props.stakeAccount,
          nft: props.nft,
        });
      } else {
        await createAccountsAndStake({
          program,
          wallet,
          connection,
          rewarder: props.rewarder,
          stakeAccount: props.stakeAccount,
          nft: props.nft,
        });
      }
      notify('success', 'SUCCESS!!!');
      setLoading(false);
      props.onChange(props.nft);
    } catch (e: any) {
      console.log('Error with transaction', e);
      notify('error', `Transaction failed! ${e?.message}`);
      setLoading(false);
      return;
    }
  }, [notify, loading, program, wallet, props, connection]);

  if (loading) {
    return <Spinner />;
  }
  let color = '';
  let copy = '';
  if (props.isStaked) {
    color = 'unstake';
    copy = 'Unstake';
  } else {
    color = 'stake';
    copy = 'Stake';
  }
  return (
    <button onClick={onClick} className={`mft-${color}-button title-bold`}>
      {copy}
    </button>
  );
};
