import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface NavLinkProps {
  href: string
  isSecondary?: boolean
  activePath?: string
}

const NavLink: React.FC<NavLinkProps> = ({ children, href, isSecondary, activePath }) => {
  const router = useRouter()
  const levelClass = isSecondary ? 'push-nav__link--secondary' : 'push-nav__link--primary'
  const activeClass = `${router.pathname}/`.startsWith(activePath || href) ? 'push-nav__link--active' : ''

  return (
    <Link href={href}>
      <a className={`push-nav__link ${levelClass} ${activeClass} themed--no-color`} tabIndex={1}>
        {isSecondary ? children : <span className="push-nav__link__line">{children}</span>}
      </a>
    </Link>
  )
}

interface Project {
  title: string
  slug: string
}

interface PushNavProps {
  isThemed?: boolean
  projects?: Project[]
}

export const PushNav: React.FC<PushNavProps> = ({ isThemed, projects = [] }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  function togglePushNav(isOpen: boolean) {
    setIsOpen(isOpen)
    if (isOpen) {
      document.body.classList.add('push-nav-active')
    } else {
      document.body.classList.remove('push-nav-active')
    }
  }

  const handleToggleButtonClick = useCallback(() => togglePushNav(!isOpen), [isOpen])

  useEffect(() => {
    function closePushNavOnEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        togglePushNav(false)
      }
    }
    document.addEventListener('keydown', closePushNavOnEsc)

    function closePushNav() {
      togglePushNav(false)
    }
    const pushNavOverlay = document.querySelector('.push-nav-overlay')
    pushNavOverlay?.addEventListener('click', closePushNav)

    router.events.on('routeChangeStart', closePushNav)
    router.events.on('hashChangeStart', closePushNav)

    return () => {
      document.removeEventListener('keydown', closePushNavOnEsc)
      pushNavOverlay?.removeEventListener('click', closePushNav)
      router.events.off('routeChangeStart', closePushNav)
      router.events.off('hashChangeStart', closePushNav)
    }
  }, [router.events])

  return (
    <>
      <button
        type="button"
        className="push-nav-toggle themed--hover"
        aria-controls="push-nav"
        aria-expanded={isOpen}
        aria-haspopup="true"
        tabIndex={1}
        onClick={handleToggleButtonClick}
      >
        Toggle navigation
        <div className={`push-nav-toggle__line push-nav-toggle__line--1 ${isThemed ? 'themed--bg' : ''}`}></div>
        <div className={`push-nav-toggle__line push-nav-toggle__line--2 ${isThemed ? 'themed--bg' : ''}`}></div>
        <div className={`push-nav-toggle__line push-nav-toggle__line--3 ${isThemed ? 'themed--bg' : ''}`}></div>
      </button>

      <nav role="navigation" className="push-nav" id="push-nav">
        <ul className="push-nav__links">
          <li>
            <NavLink href="/#about">About</NavLink>
          </li>

          <li>
            <NavLink href="/#projects" activePath="/projects/">
              Projects
            </NavLink>
            {projects.length > 0 && (
              <ul>
                {projects.map((project) => (
                  <li key={project.slug}>
                    <NavLink href={`/projects/${project.slug}/`} isSecondary>
                      {project.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <NavLink href="/blog/">Blog</NavLink>
          </li>

          <li>
            <NavLink href="/#contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
