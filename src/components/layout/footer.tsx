import React from 'react'

/** Full size version of the site wide footer */
export const Footer: React.FC = () => {
  return (
    <div className="footer">
      <section className="footer__about footer__column" id="about">
        <h2 className="footer__heading">About</h2>

        <img
          className="footer__avatar"
          src="/assets/images/avatar.jpg"
          sizes="50px"
          srcSet="/assets/images/avatar.jpg 100w, /assets/images/avatar@2x.jpg 200w"
          alt="Roland Warmerdam"
          loading="lazy"
        />

        <p className="footer__content">
          I’m from New Zealand and I build the internets. When I’m not reading about web technologies or coding, I
          listen to podcasts, play computer games, watch movies and read books.
        </p>
      </section>

      <section className="footer__contact footer__column" id="contact">
        <h2 className="footer__heading">Contact</h2>

        <ul className="footer__social">
          <li>
            <a href="https://twitter.com/rowno1">
              <img src="/assets/images/twitter.svg" alt="Twitter" width="27" height="22" loading="lazy" />
            </a>
          </li>
          <li>
            <a href="https://github.com/Rowno">
              <img src="/assets/images/github.svg" alt="GitHub" width="27" height="27" loading="lazy" />
            </a>
          </li>
          <li>
            <a href="https://www.npmjs.com/~rowno">
              <img src="/assets/images/npm.svg" alt="npm" width="41" height="17" loading="lazy" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/rolandwarmerdam">
              <img src="/assets/images/linkedin.svg" alt="LinkedIn" width="24" height="24" loading="lazy" />
            </a>
          </li>
        </ul>

        <br />

        <a
          className="footer__email themed--no-color themed--color"
          target="_blank"
          rel="noreferrer"
          href="mailto:hi@roland.codes"
        >
          hi@roland.codes
        </a>
      </section>
    </div>
  )
}
