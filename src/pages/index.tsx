import React from 'react'
import { BASE_URL } from '../config'
import { Layout } from '../components/layout'
import { StructuredData } from '../components/structured-data'
import { HtmlIcon, CssIcon, NodeIcon, LinuxIcon, GitIcon, TetrisIcon, icons } from '../components/icons'

interface Project {
  title: string
  description: string
  path: string
  logos: string[]
}

const HomePage: React.FC = () => {
  const projects: Project[] = []

  return (
    <Layout>
      <div className="hero">
        <h1 className="hero__heading">
          Front end engineer.
          <br /> Technology hacker. Gamer.
        </h1>

        <ul className="hero__skills">
          <li className="hero__skill">
            <HtmlIcon />
          </li>
          <li className="hero__skill">
            <CssIcon />
          </li>
          <li className="hero__skill">
            <NodeIcon />
          </li>
          <li className="hero__skill">
            <LinuxIcon />
          </li>
          <li className="hero__skill">
            <GitIcon />
          </li>
          <li className="hero__skill">
            <TetrisIcon />
          </li>
        </ul>

        <nav role="navigation">
          <ul className="hero__nav">
            <li>
              <a className="line-hover themed--no-color" href="/#projects">
                Projects
              </a>
            </li>
            <li>
              <a className="line-hover themed--no-color" href="/#about">
                About
              </a>
            </li>
            <li>
              <a className="line-hover themed--no-color" href="/blog/">
                Blog
              </a>
            </li>
            <li>
              <a className="line-hover themed--no-color" href="/#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <section className="project-list" id="projects">
        <div className="project-list__wrapper">
          <h2 className="project-list__heading">Projects</h2>

          {projects.map((project) => (
            <section key={project.path} className="project-list__project">
              <div className="project-list__project__image">
                <img
                  className="themed--bg"
                  src="/assets/content/{{ project.path }}/home.png"
                  srcSet="/assets/content/{{ project.path }}/home@2x.png 2x"
                  alt=""
                />
              </div>

              <div className="project-list__project__content">
                <h3 className="project-list__project__heading">{project.title}</h3>

                <div className="project-list__project__logos">
                  {project.logos.map((logoName) => {
                    const Icon = icons[logoName]
                    return <Icon key={logoName} className="themed--stroke" />
                  })}
                </div>

                <p className="project-list__project__description">{project.description}</p>

                <a className="project-list__project__link themed--no-color themed--bg" href="/{{ project.path }}/">
                  <span className="project-list__project__link__hover">Check it out</span>
                </a>
              </div>
            </section>
          ))}
        </div>
      </section>

      <StructuredData>
        {{
          '@context': 'http://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': BASE_URL,
                name: 'Home',
              },
            },
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default HomePage
