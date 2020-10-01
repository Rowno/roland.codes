import React from 'react'
import Link from 'next/link'

interface HeaderProps {
  isWhite?: boolean
  isShortName?: boolean
}

export const Header: React.FC<HeaderProps> = ({ isWhite, isShortName }) => {
  return (
    <header role="banner" className={`header ${isWhite ? 'header--white' : ''}`}>
      {isShortName ? (
        <Link href="/">
          <a
            className="header__name header__name--short"
            title="Roland Warmerdam"
            aria-label="Roland Warmerdam"
            rel="home"
            tabIndex={1}
          >
            RW
          </a>
        </Link>
      ) : (
        <Link href="/">
          <a className="header__name" rel="home" tabIndex={1}>
            Roland Warmerdam
          </a>
        </Link>
      )}
    </header>
  )
}
