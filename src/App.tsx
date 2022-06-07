import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletConnectionProvider } from './providers/walletConnectProvider';
import { Router } from './containers';
import { SnackbarProvider } from 'notistack';
import TopMenu from './hooks/topMenu';
import FooterContent from './hooks/footContent';

function App() {
  return (
    <div className="app">
      <SnackbarProvider>
        <WalletConnectionProvider>
          <WalletModalProvider>
            <header
              className="nk-header page-header is-transparent is-sticky is-shrink bg-dark is-dark has-fixed"
              id="header"
            >
              <TopMenu />
            </header>
            <main className="mainSpaceship " id="home-spaceship">
              <div className={'Big-Container'}>
                <Router />
              </div>
            </main>
          </WalletModalProvider>
        </WalletConnectionProvider>
      </SnackbarProvider>
      <footer className="nk-footer bg-theme tc-dark bg-theme-martian-footer-background">
        <FooterContent />
      </footer>
    </div>
  );
}

export default App;
