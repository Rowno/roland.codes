import React from 'react'

export const FooterShort: React.FC = () => {
  return (
    <div className="footer-short">
      <a className="footer-short__name themed--no-color" href="/" rel="home">
        Roland Warmerdam
      </a>

      <ul className="footer-short__social">
        <li>
          <a href="https://twitter.com/rowno1">
            <img src="/assets/images/twitter.svg" alt="Twitter" width="27" height="22" />
          </a>
        </li>
        <li>
          <a href="https://github.com/Rowno">
            <img src="/assets/images/github.svg" alt="GitHub" width="27" height="27" />
          </a>
        </li>
        <li>
          <a href="https://www.npmjs.com/~rowno">
            <img src="/assets/images/npm.svg" alt="npm" width="41" height="17" />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/rolandwarmerdam">
            <img src="/assets/images/linkedin.svg" alt="LinkedIn" width="24" height="24" />
          </a>
        </li>
      </ul>
    </div>
  )
}
