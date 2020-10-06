import React from 'react'
import { GetStaticPaths, GetStaticProps, NextPage, InferGetStaticPropsType as InferProps } from 'next'
import { format, utcToZonedTime } from 'date-fns-tz'
import { Layout } from '../../components/layout'
import { StructuredData } from '../../components/structured-data'
import { BASE_URL } from '../../config'
import { loadBlogPostSlugs, loadBlogPostBySlug, BlogPost } from '../../blog-post-loader'
import { BlogPostComments } from '../../components/blog-post-comments'

interface Params {
  slug: string
  [k: string]: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await loadBlogPostSlugs()

  return {
    fallback: false,
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
  }
}

export const getStaticProps: GetStaticProps<BlogPost, Params> = async (context) => {
  const slug = context.params?.slug ?? '404'

  const blogPost = await loadBlogPostBySlug(slug)
  if (!blogPost) {
    throw new Error(`Blog post '${slug}' not found`)
  }

  return {
    props: blogPost,
  }
}

const BlogPostPage: NextPage<InferProps<typeof getStaticProps>> = (props) => {
  const { title, description, slug, contents, date, commentsIssueId } = props
  // Use a Date object zoned to UTC time so that the server and client always render the same value
  const formattedDate = format(utcToZonedTime(date, 'UTC'), 'd MMM, yyyy')

  return (
    <Layout title={title} headerShortName useShortFooter>
      <div className="blog-post" itemScope itemType="http://schema.org/BlogPosting">
        <header className="blog-post__header">
          <div className="blog-post__header__wrapper">
            <h1 className="blog-post__title" itemProp="headline">
              {title}
            </h1>

            {description && (
              <div className="blog-post__description" itemProp="description">
                {description}
              </div>
            )}

            <time className="blog-post__date" dateTime={date} title={date} itemProp="datePublished">
              {formattedDate}
            </time>
          </div>
        </header>

        <div className="blog-post__body">
          <div className="blog-post__body__wrapper">
            <div
              className="blog-post__content"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: contents }}
            ></div>

            <div className="blog-post__separator themed--bg"></div>

            <BlogPostComments commentsIssueId={commentsIssueId} />
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
                '@id': `${BASE_URL}/blog/`,
                name: 'Blog',
              },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                '@id': `"${BASE_URL}/blog/${slug}/`,
                name: title,
              },
            },
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default BlogPostPage
