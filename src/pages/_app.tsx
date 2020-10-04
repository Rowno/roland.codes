import React from 'react'
import { AppProps } from 'next/app'
import 'highlight.js/styles/github.css'
import '../css/index.scss'
import '../rolee'

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default CustomApp
