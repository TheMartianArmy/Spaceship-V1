import { FC, useState } from 'react';
import { NFT } from './nfts';
import { useRewarder, useStakeAccount } from '../hooks';
import { programs } from '@metaplex/js';
import { UpdateFuncProps } from './routers';

// Core modules imports are same as usual
import { Navigation, Pagination } from 'swiper';
// Direct React component imports
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

// Styles must use direct files imports
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss';
import { ClaimInterface } from './claimsInterface';
import { nFormatter } from '../common/util'; // Pagination module

interface Props {
  walletNfts: programs.metadata.MetadataData[];
  stakedNfts: programs.metadata.MetadataData[];
  onNftUpdated: (props: UpdateFuncProps) => void;
  tokenCount: number | null;
  pendingRewards: number | null;
  onClaimRouter: () => void;
}

export const StakingInterface: FC<Props> = ({
  stakedNfts,
  walletNfts,
  onNftUpdated,
  tokenCount,
  pendingRewards,
  onClaimRouter,
}) => {
  const rewarder = useRewarder();
  const stakeAccount = useStakeAccount();

  const [showStakedNfts, setShowStakedNfts] = useState(false);
  const precisionValue = 2;

  const [unstakeCount, setUnstakeCount] = useState<number>(0);

  if (stakedNfts.length === 0 && walletNfts.length === 0) {
    return (
      <div className={'col-12 col-sm-8 offset-sm-2 min-vh-600'}>
        <h1 className={'title padding-top-150 text-color-green'}>
          It looks like you don't have any Martians
          <br />
          <br />
          You can purchase them on
          <br />
          <a
            className="underline text-color-white"
            href="https://www.martianarmy.space"
          >
            www.martianarmy.space
          </a>
        </h1>
      </div>
    );
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const hideClaimInterface =
    stakedNfts?.length === 0 && walletNfts?.length === 0;

  let displayPendingValue = nFormatter(
    pendingRewards ? pendingRewards * 0.000000001 : 0,
    precisionValue
  );

  return (
    <>
      <div className={'title-slider-box'}>
        {showStakedNfts && (
          <h3 className="lead text-uppercase title-bold spaceship-text-title">
            🛸️ SPACESHIP {stakedNfts.length}
          </h3>
        )}
        {!showStakedNfts && (
          <h3 className="lead tc-theme text-uppercase title-bold">
            🔒️ WALLET {walletNfts.length}
          </h3>
        )}
      </div>

      <div
        className={
          'col-12 col-sm-8 offset-sm-2 border-slider margin-bottom-30 margin-top-50 '
        }
      >
        <div className={'spaceship-container'}>
          {stakedNfts.length === 0 && showStakedNfts && (
            <div className={'empty-wallet-container lead'}>
              <h3 className="lead text-uppercase title-bold margin-bottom-100">
                Wallet Nft's: {walletNfts.length} <br />
                Staked Nft's: {stakedNfts.length}
              </h3>
            </div>
          )}
          {stakedNfts.length > 0 && showStakedNfts && (
            <Swiper
              className="absolute flex flex-row top-10 margin-top-50 w-1/2 select-none pt-0 pb-9 px-8"
              // install Swiper modules
              modules={[Navigation, Pagination]}
              slidesPerView={3}
              centeredSlides={true}
              centeredSlidesBounds={true}
              centerInsufficientSlides={true}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
              navigation={true}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {stakedNfts?.map((nft) => (
                <SwiperSlide>
                  <NFT
                    key={nft.key}
                    nft={nft}
                    rewarder={rewarder}
                    stakeAccount={stakeAccount}
                    onChange={(nftMoved) => {
                      onNftUpdated({ previousLocation: 'staked', nftMoved });
                    }}
                    isStaked
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {walletNfts.length === 0 && !showStakedNfts && (
            <div className={'empty-wallet-container lead'}>
              <h3 className="lead text-uppercase title-bold  margin-bottom-100">
                Wallet Nft's: 0 <br />
                Staked Nft's: {stakedNfts.length}
              </h3>
            </div>
          )}
          {walletNfts.length > 0 && !showStakedNfts && (
            <Swiper
              className="absolute flex flex-row top-10 margin-top-50 w-1/2 select-none pt-0 pb-9 px-8"
              // install Swiper modules
              modules={[Navigation, Pagination]}
              slidesPerView={3}
              centeredSlides={true}
              centeredSlidesBounds={true}
              centerInsufficientSlides={true}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
              navigation={true}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {walletNfts?.map((nft) => (
                <SwiperSlide>
                  <NFT
                    key={nft.key}
                    nft={nft}
                    rewarder={rewarder}
                    stakeAccount={stakeAccount}
                    isStaked={false}
                    onChange={(nftMoved) => {
                      onNftUpdated({ previousLocation: 'wallet', nftMoved });
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <div className={'col-12 col-sm-8 offset-sm-2'}>
        <div className={'row padding-50'}>
          <div className="col-3"></div>
          <div className="col-mb-12 col-sm-6 ">
            <div className={'row border-info-spaceship'}>
              <div className={'col-5 col-mb-5 col-sm-6'}>
                <div className="reward-text aligncenter">
                  <span className=" text-uppercase">
                    Your pending
                    <br />
                    rewards
                  </span>
                </div>
              </div>
              <div className={'col-7 col-mb-7 col-sm-6'}>
                <div className="reward-score ">
                  <span className="text-green-100">
                    {displayPendingValue || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>

      <div
        className={
          'col-mb-12 col-sm-8 offset-sm-2 border-staking margin-bottom-100'
        }
      >
        <div className={'row'}>
          <div className={'col-4 col-mb-4 col-sm-2 col-md-2'}>
            <br />
            <h6 className="text-uppercase tc-white ">Wallet</h6>
            <button
              onClick={() => {
                setShowStakedNfts(false);
                scrollTop();
              }}
              className="text-uppercase stake-button"
            >
              <div className={'team team-s3 team-s3-alt'}>
                <div className={'spaceship-number'}>{walletNfts.length}</div>
                <div className="spaceship-button-photo round-full spaceship-button-bg active">
                  <img
                    src={'./images/v2/wallet-button.png'}
                    width={'100px'}
                    className={'round-full'}
                    alt="spaceship"
                  />
                </div>
              </div>
              See more
            </button>
          </div>

          <div
            className={
              'col-4 col-mb-4 col-sm-8 col-md-8 zero-padding-left-right'
            }
          >
            {!hideClaimInterface && (
              <ClaimInterface
                tokenCount={tokenCount}
                pendingRewards={pendingRewards}
                onClaim={() => {
                  onClaimRouter();
                  console.log('On Claim executed');
                  setUnstakeCount(unstakeCount + 1);
                }}
              />
            )}
          </div>

          <div className={'col-4 col-mb-4 col-sm-2 col-md-2'}>
            <br />
            <h6 className="text-uppercase tc-white">Spaceship</h6>

            <button
              onClick={() => {
                setShowStakedNfts(true);
                scrollTop();
              }}
              className="text-uppercase stake-button"
            >
              <div className={'team team-s3 team-s3-alt'}>
                <div className={'staked-number'}>{stakedNfts.length}</div>
                <div className="spaceship-button-photo round-full spaceship-button-bg not-active">
                  <img
                    src={'./images/v2/spaceship-button.png'}
                    width={'120px'}
                    className={'round-full'}
                    alt="spaceship"
                  />
                </div>
              </div>
              See more
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
