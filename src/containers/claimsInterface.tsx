import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@project-serum/anchor"
import { useCallback, useState, FC } from 'react';
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useNotify, useRewarder, useProgram, useStakeAccount } from '../hooks';
import { web3 } from '@project-serum/anchor';
import { Spinner } from '../components';
import {nFormatter} from "../common/util";


interface Props {
  tokenCount: number | null;
  pendingRewards: number | null;
  onClaim: () => void;

}

export const ClaimInterface: FC<Props> = (props) => {
  const rewarder = useRewarder();
  const wallet = useWallet();
  const stakeAccount = useStakeAccount();
  const notify = useNotify();
  const program = useProgram();
  const [loading, setLoading] = useState(false);
  const onClaim = props.onClaim;



  const claim = useCallback(async () => {
    try {
      if (
        !rewarder?.rewardAuthority ||
        !wallet.publicKey ||
        !stakeAccount ||
        !rewarder ||
        !program
      ) {
        throw new Error('Not finished loading');
      }
      setLoading(true);
      const tokenAccountAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        rewarder.data.rewardMint,
        wallet.publicKey,
        false
      );

      const mint = rewarder.data.rewardMint;
      const rewardAuthority = rewarder.rewardAuthority;
    
      const rewardVault = await anchor.utils.token.associatedAddress({ mint, owner: rewardAuthority });

      const txId = await program.rpc.claim({
        accounts: {
          owner: wallet.publicKey.toBase58(),
          rewarder: rewarder.address.toBase58(),
          rewardAuthority: rewarder.rewardAuthority.toBase58(),
          stakeAccount: stakeAccount.address.toBase58(),
          rewardMint: rewarder.data.rewardMint.toBase58(),
          rewardAccount: tokenAccountAddress.toBase58(),
          tokenProgram: TOKEN_PROGRAM_ID.toBase58(),
          clock: web3.SYSVAR_CLOCK_PUBKEY.toBase58(),
          rewardVault: rewardVault.toBase58(),
        },
      });
      console.log(`Transaction Id: ${txId}`, txId);
      setLoading(false);
      notify('success', `Claiming Successful. Transaction Id: ${txId}`);

      onClaim();
    } catch (e) {
      setLoading(false);
      notify('error', `Error: ${e}`);
    }
  }, [program, rewarder, stakeAccount, wallet.publicKey, notify, onClaim]);
  const precisionValue = 2;
  let displayValue = nFormatter((props.tokenCount ? (props.tokenCount * 0.000000001) : 0),precisionValue);
  let displayPendingValue = nFormatter((props.pendingRewards ? (props.pendingRewards * 0.000000001) : 0),precisionValue);

  // console.log('Current Wallet Value',displayValue);
  // console.log('Current Pending Value',displayPendingValue);

  return (

    <div className="row height-100">

      <div className={"col-12 col-mb-12 col-sm-7 zero-padding-left-right"}>
        <div className="cpn-head text-left ">
          <p className="lead tc-white title-lg-s3 your-tokens-text text-uppercase">
            Your tokens <span className="text-color-green">$MARS</span>
          </p>
        </div>
        <div className="text-left ">
          <h1 className="title title-lg-s2 text-color-green your-tokens-score "> {displayValue || 0}</h1>
        </div>
      </div>
      <div className={"col-12 col-mb-12 col-sm-5 zero-padding-left-right"}>
        {loading && <Spinner />}
        {!loading && displayPendingValue !== "0" && (
          <div className="vertical-center">
            <button
              onClick={claim}
              className="text-uppercase  claim-button  title-bold"
              disabled={rewarder === null || loading}
            >
              Claim your $MARS
            </button>
          </div>
        )}
      </div>





    </div>
  );
};
