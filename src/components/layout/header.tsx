import React from 'react'
import Link from 'next/link'

interface HeaderProps {
  /** Renders the header with a white background */
  isWhite?: boolean
  /** Renders the header with the name in short acronym form */
  hasShortName?: boolean
}

/** Site wide header */
export const Header: React.FC<HeaderProps> = ({ isWhite, hasShortName }) => {
  return (
    <header role="banner" className={`header ${isWhite ? 'header--white' : ''}`}>
      <Link href="/">
        {hasShortName ? (
          <a
            className="header__name header__name--short"
            title="Roland Warmerdam"
            aria-label="Roland Warmerdam"
            rel="home"
            tabIndex={1}
          >
            RW
          </a>
        ) : (
          <a className="header__name" rel="home" tabIndex={1}>
            Roland Warmerdam
          </a>
        )}
      </Link>
    </header>
  )
}
