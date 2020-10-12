import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      // The `preload` class prevents transitions from triggering on page load
      <Html lang="en" className="theme--1 preload">
        <Head>
          {/* Preload the two most commonly used fonts to minimise any jank from the fonts changing */}
          <link
            rel="preload"
            href="/assets/fonts/roboto-thin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/assets/fonts/roboto-light.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>

        <body className="themed--bg">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
