import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import 'highlight.js/styles/github.css'
import '../css/index.scss'
import '../rolee'
import '../analytics'

const THEME_NUM = 6
const SECOND = 1000
const THEME_INTERVAL = 3.5 * SECOND
let currentTheme = 1

function changeTheme() {
  document.documentElement.classList.remove(`theme--${currentTheme}`)

  currentTheme += 1
  if (currentTheme > THEME_NUM) {
    currentTheme = 1
  }

  document.documentElement.classList.add(`theme--${currentTheme}`)
}

const CustomApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Prevents transitions from triggering on page load
    setTimeout(() => document.documentElement.classList.remove('preload'), 300)

    setInterval(changeTheme, THEME_INTERVAL)
  }, [])

  return <Component {...pageProps} />
}

export default CustomApp
