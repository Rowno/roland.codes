import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import 'highlight.js/styles/github.css'
import '../css/index.scss'
import '../rolee'

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Prevents transitions from triggering on page load
    document.documentElement.classList.remove('preload')
  }, [])

  return <Component {...pageProps} />
}

export default CustomApp
