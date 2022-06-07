import { FC, useCallback, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from '@solana/wallet-adapter-wallets';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletConnectionProvider: FC = (props) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  // TODO PAULO move to env file
  const network = WalletAdapterNetwork.Mainnet;
  // You can also provide a custom RPC endpoint
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = "https://solana--mainnet.datahub.figment.io/apikey/c50c633603d918a1bd9b0d154c99ba32/";
  // const endpoint = "https://solana--devnet.datahub.figment.io/apikey/c50c633603d918a1bd9b0d154c99ba32/";

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  const onError = useCallback((walletError: WalletError) => {
    console.log('error', walletError);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        {props.children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
