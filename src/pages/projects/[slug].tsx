import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType as InferProps } from 'next'
import { Layout } from '../../components/layout'
import { StructuredData } from '../../components/structured-data'
import { BASE_URL } from '../../config'
import { icons } from '../../components/icons'
import { loadProjectSlugs, loadProjectBySlug, Project } from '../../project-loader'

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

export const getStaticProps: GetStaticProps<Project, Params> = async (context) => {
  const slug = context.params?.slug ?? '404'

  const project = await loadProjectBySlug(slug)
  if (!project) {
    throw new Error(`Project '${slug}' not found`)
  }

  return {
    props: project,
  }
}

const ProjectPage: NextPage<InferProps<typeof getStaticProps>> = (props) => {
  const { title, slug, contents, description, twitterCard, socialImage, logos, links } = props

  return (
    <Layout
      title={title}
      description={description}
      twitterCard={twitterCard}
      socialImage={socialImage}
      headerWhite
      headerShortName
      pushNavThemed
    >
      <div className="project-detail">
        <div className="project-detail__wrapper">
          <div className="project-detail__top">
            <div className="project-detail__image">
              <img
                className="themed--bg"
                src={`/assets/content/projects/${slug}/large.png`}
                srcSet={`/assets/content/projects/${slug}/large@2x.png 2x`}
                alt=""
                loading="lazy"
              />
            </div>

            <div className="project-detail__text">
              <h1 className="project-detail__heading">{title}</h1>

              {logos && (
                <div className="project-detail__logos">
                  {logos.map((logoName) => {
                    const Icon = icons[logoName]
                    return <Icon key={logoName} className="themed--stroke" />
                  })}
                </div>
              )}

              <div className="project-detail__description" dangerouslySetInnerHTML={{ __html: contents }}></div>

              <ul className="project-detail__links">
                {links.map((link) => (
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
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default ProjectPage
