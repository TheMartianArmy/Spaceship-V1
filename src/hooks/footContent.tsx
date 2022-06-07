import React from 'react';

export default function FooterContent() {
  return (
    <div id="footer" className="pb-0">
      <div className="container py-4">
        <div className="row  align-items-end">
          <div className="col-12 ">
            <div className="text-center">
              <h4 className="title title-lg">Join our communities.</h4>

              <ul className="social ">
                <li>
                  <a
                    target="_blank"
                    href="https://twitter.com/_martianarmy_"
                    rel="noreferrer"
                  >
                    {' '}
                    <em className="social-icon fab text-black fa-3x fa-twitter"></em>{' '}
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href=" https://discord.gg/martianarmy"
                    rel="noreferrer"
                  >
                    {' '}
                    <em className="social-icon fab text-black fa-3x fa-discord "></em>{' '}
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.instagram.com/martianarmy.space/"
                    rel="noreferrer"
                  >
                    {' '}
                    <em className="social-icon fab text-black fa-3x fa-instagram "></em>{' '}
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://medium.com/@martianarmy"
                    rel="noreferrer"
                  >
                    {' '}
                    <em className="social-icon fab text-black fa-3x fa-medium "></em>{' '}
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/channel/UCqTtT-nIpb7KwG9CvqF23mQ/featured"
                    rel="noreferrer"
                  >
                    {' '}
                    <em className="social-icon fab text-black fa-3x fa-youtube "></em>{' '}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 bg-dark tc-light">
        <div className="copyright-text copyright-text-s2 pdt-m text-center mb-3">
          <p>
            <span className="d-sm-block">Copyright © 2022 Martian Army </span>
          </p>
          <p>
            <span className="d-sm-block">version 1.0.2 </span>
          </p>
        </div>
      </div>
    </div>
  );
}
