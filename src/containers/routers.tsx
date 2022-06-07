import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  useRewarder,
  useStakedNfts,
  useWalletNfts,
  useNotify,
  useStakeAccount,
} from '../hooks';
import { StakingInterface } from '.';
import { Spinner } from '../components';
import { programs } from '@metaplex/js';
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { deserializeAccount } from '../common/util';

export interface UpdateFuncProps {
  previousLocation: 'wallet' | 'staked';
  nftMoved: programs.metadata.MetadataData;
}

export function Router() {
  const [stakedNfts, setStakedNfts] = useStakedNfts();
  const [walletNfts, setWalletNfts] = useWalletNfts();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const notify = useNotify();
  const rewarder = useRewarder();
  const [tokenCount, setTokenCount] = useState<null | number>(null);
  const [pendingRewards, setPendingRewards] = useState<null | number>(null);
  const [unstakeCount, setUnstakeCount] = useState<number>(0);
  // Calculation for pending rewards is fuzzy, when justClaimed show 0 pending
  const [justClaimed, setJustClaimed] = useState<boolean>(false);

  const stakeAccount = useStakeAccount();
  const walletNotConnected = !publicKey;
  const nftsUndefined = stakedNfts === undefined || walletNfts === undefined;

  const updateNftList = (props: UpdateFuncProps) => {
    if (stakedNfts === undefined || walletNfts === undefined) {
      throw new Error('Unabled to find list');
    }
    let newStakedList = [...stakedNfts];
    let newWalletList = [...walletNfts];
    if (props.previousLocation === 'staked') {
      newWalletList.push(props.nftMoved);
      newStakedList = newStakedList.filter(
        (val) => val.mint !== props.nftMoved.mint
      );
      // increment unstake count to trigger refresh of account
      setJustClaimed(true);
      setUnstakeCount(unstakeCount + 1);
    } else {
      newStakedList.push(props.nftMoved);
      newWalletList = newWalletList.filter(
        (val) => val.mint !== props.nftMoved.mint
      );
    }
    setStakedNfts(newStakedList);
    setWalletNfts(newWalletList);
  };

  // console.log("Stake Account: ",stakeAccount? stakeAccount.data : "");

  useEffect(() => {
    let didCancel = false;
    const teardown = () => {
      didCancel = true;
    };

    async function requestRewarder() {
      // console.log("Starting Requesting Rewarder...");
      const slot = await connection.getSlot();
      const time = await connection.getBlockTime(slot);
      if (!rewarder || !publicKey || !stakeAccount?.data || time === null) {
        return teardown;
      }
      const tokenAccountAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        rewarder.data.rewardMint,
        publicKey,
        false
      );
      const rewarderAccount = await connection.getAccountInfo(
        tokenAccountAddress
      );

      const lastClaimed = stakeAccount.data.lastClaimed.toNumber();
      const numStaked = stakeAccount.data.numStaked;
      console.log('Last Claimed ', lastClaimed);
      console.log('Number Staked ', numStaked);
      if (!didCancel) {
        if (rewarderAccount !== null) {
          const res = deserializeAccount(rewarderAccount.data);
          setTokenCount(res.amount.toNumber());
        }
        if (numStaked === 0 || justClaimed) {
          setPendingRewards(0);
        } else {
          const pending =
            (time - lastClaimed) * rewarder.data.rewardRate * numStaked;
          setPendingRewards(pending);
        }
      }
    }

    requestRewarder();

    return teardown;
  }, [
    rewarder,
    publicKey,
    connection,
    notify,
    unstakeCount,
    stakeAccount,
    justClaimed,
  ]);

  return (
    <>
      <div className={'container container-sm'}>
        <div className={'row'}>
          {walletNotConnected && (
            <div className="col-12 offset-0 col-sm-8 offset-sm-2  justify-center items-center ">
              <div className={' loading-background text-center'}>
                <div className={'position-relative padding-top-250'}>
                  <h1 className="title title-lg-s3 text-color-green  ">
                    {'Please connect your wallet'}
                  </h1>
                  <div className={'connect-wallet-box'}>
                    <WalletMultiButton />
                  </div>
                </div>
              </div>
            </div>
          )}
          {publicKey && nftsUndefined && (
            <div className="col-12 offset-0 col-sm-8 offset-sm-2  justify-center items-center ">
              <div className={' loading-background text-center'}>
                <div className={'position-relative padding-top-250'}>
                  <Spinner />
                  <div className="css-typing">
                    <h2 className="text-color-green ">
                      Connecting to Solana Network
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
          {publicKey && !nftsUndefined && (
            <>
              <StakingInterface
                stakedNfts={stakedNfts}
                walletNfts={walletNfts}
                onNftUpdated={updateNftList}
                tokenCount={tokenCount}
                pendingRewards={pendingRewards}
                onClaimRouter={() => {
                  console.log('On Claim Router');
                  setJustClaimed(true);
                  setUnstakeCount(unstakeCount + 1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
