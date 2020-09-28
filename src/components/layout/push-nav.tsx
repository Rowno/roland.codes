import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface NavLinkProps {
  href: string
  isSecondary?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({ children, href, isSecondary }) => {
  const levelClass = isSecondary ? 'push-nav__link--secondary' : 'push-nav__link--primary'
  return (
    <Link href={href}>
      <a className={`push-nav__link ${levelClass} themed--no-color`} tabIndex={1}>
        {isSecondary ? children : <span className="push-nav__link__line">{children}</span>}
      </a>
    </Link>
  )
}

interface Project {
  title: string
  path: string
}

interface PushNavProps {
  isThemed?: boolean
}

export const PushNav: React.FC<PushNavProps> = ({ isThemed }) => {
  const router = useRouter()
  const projects: Project[] = []

  return (
    <>
      <button
        type="button"
        className="push-nav-toggle themed--hover"
        aria-controls="push-nav"
        aria-expanded="false"
        aria-haspopup="true"
        tabIndex={1}
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
            <NavLink href="/#projects">Projects</NavLink>
            {router.pathname.startsWith('/projects/') && (
              <ul>
                {projects.map((project) => (
                  <li key={project.path}>
                    <NavLink href={project.path} isSecondary>
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
