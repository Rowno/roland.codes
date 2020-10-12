import React from 'react'
import { NextPage, GetStaticProps, InferGetStaticPropsType as InferProps } from 'next'
import Link from 'next/link'
import { BASE_URL } from '../config'
import { Layout } from '../components/layout'
import { StructuredData } from '../components/structured-data'
import { HtmlIcon, CssIcon, NodeIcon, LinuxIcon, GitIcon, TetrisIcon, icons } from '../components/icons'
import { loadProjects, Project } from '../project-loader'

type MinimalProject = Pick<Project, 'title' | 'description' | 'slug' | 'logos'>

interface HomePageProps {
  projects: MinimalProject[]
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const projects = await loadProjects()
  return {
    props: {
      // Only include the minimum required properties to reduce the amount of data embeded
      // onto the page for React hydration
      projects: projects.map((project) => ({
        title: project.title,
        description: project.description,
        slug: project.slug,
        logos: project.logos ?? null,
      })),
    },
  }
}

const HomePage: NextPage<InferProps<typeof getStaticProps>> = ({ projects }) => {
  return (
    <Layout
      socialImage="/assets/content/index-social.png"
      twitterCard="summary_large_image"
      description={`I’m from New Zealand and I build the internets. When I’m not reading about web technologies or coding, I listen to podcasts, play computer games, watch movies and read books.`}
    >
      <div className="hero">
        <h1 className="hero__heading">
          Software engineer.
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
            <section key={project.slug} className="project-list__project">
              <div className="project-list__project__image">
                <img
                  className="themed--bg"
                  src={`/assets/content/projects/${project.slug}/home.png`}
                  srcSet={`/assets/content/projects/${project.slug}/home@2x.png 2x`}
                  alt=""
                  loading="lazy"
                />
              </div>

              <div className="project-list__project__content">
                <h3 className="project-list__project__heading">{project.title}</h3>

                <div className="project-list__project__logos">
                  {project.logos?.map((logoName) => {
                    const Icon = icons[logoName]
                    return <Icon key={logoName} className="themed--stroke" />
                  })}
                </div>

                <p className="project-list__project__description">{project.description}</p>

                <Link href={`/projects/${project.slug}/`}>
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
