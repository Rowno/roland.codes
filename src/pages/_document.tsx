import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" className="theme--1 preload">
        <Head>
          <link rel="preload" href="/assets/fonts/roboto-thin.woff2" as="font" type="font/woff2" />
          <link rel="preload" href="/assets/fonts/roboto-light.woff2" as="font" type="font/woff2" />
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
