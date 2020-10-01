import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Header } from './header'
import { StructuredData } from '../structured-data'
import { BASE_URL } from '../../config'
import { PushNav } from './push-nav'
import { Footer } from './footer'
import { FooterShort } from './footer-short'

interface LayoutProps {
  title?: string
  description?: string
  socialImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  noindex?: boolean
  headerWhite?: boolean
  headerShortName?: boolean
  pushNavThemed?: boolean
  useShortFooter?: boolean
  hideFooter?: boolean
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const {
    children,
    title,
    description,
    socialImage,
    twitterCard = 'summary',
    noindex,
    headerWhite,
    headerShortName,
    pushNavThemed,
    useShortFooter,
    hideFooter,
  } = props

  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title && `${title} | `}Roland Warmerdam</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="alternate" type="application/atom+xml" href="/feed.xml" title="Roland Warmerdam" />

        <link rel="icon" sizes="192x192" href="/assets/images/touch-icon.png" />
        <link rel="apple-touch-icon" href="/assets/images/touch-icon.png" />
        <link rel="icon" sizes="32x32" href="/favicon.ico" />

        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}

        <meta name="application-name" content="Roland Warmerdam" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}${router.pathname}`} />
        <meta property="og:title" content={title} />
        {socialImage && <meta property="og:image" content={`${BASE_URL}${socialImage}`} />}
        <meta property="twitter:site" content="@rowno1" />
        <meta property="twitter:creator" content="@rowno1" />
        <meta property="twitter:card" content={twitterCard} />

        {noindex && <meta name="robots" content="noindex" />}
      </Head>

      <div className="body-wrapper">
        <Header isWhite={headerWhite} isShortName={headerShortName} />

        <main role="main">{children}</main>

        {!hideFooter && (useShortFooter ? <FooterShort /> : <Footer />)}

        <div className="push-nav-overlay"></div>
      </div>

      <PushNav isThemed={pushNavThemed} />

      <StructuredData>
        {{
          '@type': 'WebSite',
          name: 'Roland Warmerdam',
          url: BASE_URL,
        }}
      </StructuredData>
      <StructuredData>
        {{
          '@type': 'Person',
          name: 'Roland Warmerdam',
          url: BASE_URL,
          sameAs: [
            'https://twitter.com/rowno1',
            'https://github.com/Rowno',
            'https://www.npmjs.com/~rowno',
            'https://www.linkedin.com/in/rolandwarmerdam',
          ],
        }}
      </StructuredData>
    </>
  )
}
