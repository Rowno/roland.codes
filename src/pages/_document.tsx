import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" className="theme--1">
        <Head />
        <body className="themed--bg">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
