import React from 'react'
import { AppProps } from 'next/app'
import '../css/index.scss'

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default CustomApp
