import React from 'react'

interface HeaderProps {
  isWhite?: boolean
  isShortName?: boolean
}

export const Header: React.FC<HeaderProps> = ({ isWhite, isShortName }) => {
  return (
    <header role="banner" className={`header ${isWhite ? 'header--white' : ''}`}>
      {isShortName ? (
        <a
          className="header__name header__name--short"
          href="/"
          title="Roland Warmerdam"
          aria-label="Roland Warmerdam"
          rel="home"
          tabIndex={1}
        >
          RW
        </a>
      ) : (
        <a className="header__name" href="/" rel="home" tabIndex={1}>
          Roland Warmerdam
        </a>
      )}
    </header>
  )
}
