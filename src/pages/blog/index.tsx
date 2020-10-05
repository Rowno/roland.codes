import React from 'react'
import { NextPage, GetStaticProps, InferGetStaticPropsType as InferProps } from 'next'
import Link from 'next/link'
import { Layout } from '../../components/layout'
import { StructuredData } from '../../components/structured-data'
import { BASE_URL } from '../../config'
import { format, formatISO } from 'date-fns'
import { loadBlogPosts, BlogPost } from '../../blog-post-loader'

type MinimalBlogPost = Pick<BlogPost, 'title' | 'slug' | 'date' | 'excerpt'>

interface BlogProps {
  blogPosts: MinimalBlogPost[]
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const blogPost = await loadBlogPosts()
  return {
    props: {
      blogPosts: blogPost.map((blogPost) => ({
        title: blogPost.title,
        slug: blogPost.slug,
        date: blogPost.date,
        excerpt: blogPost.excerpt,
      })),
    },
  }
}

const BlogPage: NextPage<InferProps<typeof getStaticProps>> = ({ blogPosts }) => {
  return (
    <Layout title="Blog" headerShortName headerWhite pushNavThemed useShortFooter>
      <div className="blog-list">
        <h1 className="blog-list__title blog-list__title--top">&lt;blog&gt;</h1>

        <div className="blog-list__posts">
          {blogPosts.map((post, index) => (
            <article key={post.slug} className="blog-list__post">
              <header>
                <time className="blog-list__post__date" dateTime={formatISO(post.date)} title={formatISO(post.date)}>
                  {format(post.date, 'd MMM, yyyy')}
                </time>

                <h2 className="blog-list__post__title">
                  <Link href={`/blog/${post.slug}/`}>
                    <a>{post.title}</a>
                  </Link>
                </h2>
              </header>

              <div className="blog-list__post__content" dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>

              {index < blogPosts.length - 1 && <div className="blog-list__post__separator themed--bg"></div>}
            </article>
          ))}
        </div>

        <div className="blog-list__title blog-list__title--bottom">&lt;/blog&gt;</div>
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
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default BlogPage