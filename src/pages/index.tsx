import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
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

const HomePage: NextPage = () => {
  const projects: Project[] = []

  return (
    <Layout
      socialImage="/assets/content/index-social.png"
      twitterCard="summary_large_image"
      description={`I’m from New Zealand and I build the internets. When I’m not reading about web technologies or coding, I listen to podcasts, play computer games, watch movies and read books.`}
    >
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
              <Link href="/#projects">
                <a className="line-hover themed--no-color">Projects</a>
              </Link>
            </li>
            <li>
              <Link href="/#about">
                <a className="line-hover themed--no-color">About</a>
              </Link>
            </li>
            <li>
              <Link href="/blog/">
                <a className="line-hover themed--no-color">Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/#contact">
                <a className="line-hover themed--no-color">Contact</a>
              </Link>
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
                  src={`/assets/content/${project.path}}/home.png`}
                  srcSet={`/assets/content/${project.path}}/home@2x.png 2x`}
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

                <Link href={project.path}>
                  <a className="project-list__project__link themed--no-color themed--bg">
                    <span className="project-list__project__link__hover">Check it out</span>
                  </a>
                </Link>
              </div>
            </section>
          ))}
        </div>
      </section>

      <StructuredData>
        {{
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
