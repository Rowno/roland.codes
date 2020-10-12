import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface NavLinkProps {
  href: string
  /** Indicates that the link is a child link */
  isSecondary?: boolean
  /**
   * Sets an alternate path for determining if the path is active.
   * Used for index page links that only exist as a hash link (like `/#projects`).
   */
  activePath?: string
}

/** A link in the navigation */
const NavLink: React.FC<NavLinkProps> = ({ children, href, isSecondary, activePath }) => {
  const router = useRouter()
  const levelClass = isSecondary ? 'push-nav__link--secondary' : 'push-nav__link--primary'
  const activeClass = router.asPath.startsWith(activePath || href) ? 'push-nav__link--active' : ''

  return (
    <Link href={href}>
      <a className={`push-nav__link ${levelClass} ${activeClass} themed--no-color`} tabIndex={1}>
        {isSecondary ? children : <span className="push-nav__link__line">{children}</span>}
      </a>
    </Link>
  )
}

/** The minimal `Project` properties required by the nav */
export interface PushNavProject {
  title: string
  slug: string
}

interface PushNavProps {
  /** Whether the toggle button should be themed */
  isToggleThemed?: boolean
  projects?: PushNavProject[]
}

/** The main side navigation of the site */
export const PushNav: React.FC<PushNavProps> = ({ isToggleThemed, projects = [] }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  /** Toggles the class on the body that opens/closes the nav */
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
    // Close the nav when the Esc key is pressed
    function closePushNavOnEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        togglePushNav(false)
      }
    }
    document.addEventListener('keydown', closePushNavOnEsc)

    // Close the nav when the full page overlay is clicked
    function closePushNav() {
      togglePushNav(false)
    }
    const pushNavOverlay = document.querySelector('.push-nav-overlay')
    pushNavOverlay?.addEventListener('click', closePushNav)

    // Automatically close the nav when a link is clicked
    router.events.on('routeChangeStart', closePushNav)
    // `routeChangeStart` doesn't fire for hash links to the current page
    router.events.on('hashChangeStart', closePushNav)

    // Clean up event listeners on unmount
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
        <div className={`push-nav-toggle__line push-nav-toggle__line--1 ${isToggleThemed ? 'themed--bg' : ''}`}></div>
        <div className={`push-nav-toggle__line push-nav-toggle__line--2 ${isToggleThemed ? 'themed--bg' : ''}`}></div>
        <div className={`push-nav-toggle__line push-nav-toggle__line--3 ${isToggleThemed ? 'themed--bg' : ''}`}></div>
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
