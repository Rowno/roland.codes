import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType as InferProps } from 'next'
import { Layout } from '../../components/layout'
import { StructuredData } from '../../components/structured-data'
import { BASE_URL } from '../../config'
import { icons } from '../../components/icons'
import { loadProjectSlugs, loadProjectBySlug, Project, loadProjects } from '../../project-loader'
import { PushNavProject } from '../../components/layout/push-nav'

interface Params {
  slug: string
  [k: string]: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await loadProjectSlugs()

  return {
    fallback: false,
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
  }
}

interface ProjectPageProps {
  project: Project
  projects?: PushNavProject[]
}

export const getStaticProps: GetStaticProps<ProjectPageProps, Params> = async (context) => {
  const slug = context.params?.slug ?? '404'

  const [project, projects] = await Promise.all([loadProjectBySlug(slug), loadProjects()])
  if (!project) {
    throw new Error(`Project '${slug}' not found`)
  }

  return {
    props: {
      project,
      // Only embed the minimum required data on the page
      projects: projects.map((p) => ({ title: p.title, slug: p.slug })),
    },
  }
}

const ProjectPage: NextPage<InferProps<typeof getStaticProps>> = ({ project, projects }) => {
  return (
    <Layout
      title={project.title}
      description={project.description}
      twitterCard={project.twitterCard}
      socialImage={project.socialImage}
      headerWhite
      headerShortName
      pushNavThemed
      projects={projects}
    >
      <div className="project-detail">
        <div className="project-detail__wrapper">
          <div className="project-detail__top">
            <div className="project-detail__image">
              <img
                className="themed--bg"
                src={`/assets/content/projects/${project.slug}/large.png`}
                srcSet={`/assets/content/projects/${project.slug}/large@2x.png 2x`}
                alt=""
                loading="lazy"
              />
            </div>

            <div className="project-detail__text">
              <h1 className="project-detail__heading">{project.title}</h1>

              {project.logos && (
                <div className="project-detail__logos">
                  {project.logos.map((logoName) => {
                    const Icon = icons[logoName]
                    return <Icon key={logoName} className="themed--stroke" />
                  })}
                </div>
              )}

              <div className="project-detail__description" dangerouslySetInnerHTML={{ __html: project.contents }}></div>

              <ul className="project-detail__links">
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

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
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': `${BASE_URL}/projects/${project.slug}/`,
                name: project.title,
              },
            },
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default ProjectPage
