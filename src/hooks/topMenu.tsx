import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function TopMenu() {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  return (
    <div className="header-main">
      <div className="header-container container">
        <div className="header-wrap">
          <div className="header-logo logo">
            <a href="https://www.martianarmy.space/#" className="logo-link">
              <img className="" src="./images/logo.png" alt="logo"></img>
            </a>
          </div>
          <div className="header-nav-toggle">
            <a
              href="/#"
              id="mobile-menu-toggle"
              className="navbar-toggle"
              data-menu-toggle="example-menu-04"
              onClick={() => setMobileMenuActive(!mobileMenuActive)}
            >
              <div className="toggle-line">
                <span></span>
              </div>
            </a>
          </div>
          <div
            className={
              'header-navbar header-navbar-s1 menu-border-bottom ' +
              (mobileMenuActive ? 'mobile-menu-active' : '')
            }
          >
            <nav
              className="header-menu"
              id="example-menu-04 menu-border-bottom"
            >
              <ul className="menu menu-s2 align-items-end social">
                <li className="menu-item">
                  <a href="https://magiceden.io/marketplace/marsarmy">
                    <img
                      src={'/images/partner/magic-eden.png'}
                      width={'32px'}
                      alt={'Magic Eden'}
                    />
                  </a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/#utility">Utility</a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/#economics">Token</a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/#dao">DAO</a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/#spacemap">Spacemap</a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/games">Game</a>
                </li>
                <li className="menu-item">
                  <a href="https://www.martianarmy.space/whitepaper">
                    Whitepaper
                  </a>
                </li>

                <li className="menu-item">
                  <WalletMultiButton />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
