import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '../components/layout'
import { StructuredData } from '../components/structured-data'
import { BASE_URL } from '../config'
import { format, formatISO } from 'date-fns'

interface Post {
  title: string
  excerpt: string
  path: string
  date: Date
}

const BlogPage: NextPage = () => {
  const posts: Post[] = []

  return (
    <Layout title="Blog" headerShortName headerWhite pushNavThemed useShortFooter>
      <div className="blog-list">
        <h1 className="blog-list__title blog-list__title--top">&lt;blog&gt;</h1>

        <div className="blog-list__posts">
          {posts.map((post, index) => (
            <article key={post.path} className="blog-list__post">
              <header>
                <time className="blog-list__post__date" dateTime={formatISO(post.date)} title={formatISO(post.date)}>
                  {format(post.date, 'D MMM, YYYY')}
                </time>

                <h2 className="blog-list__post__title">
                  <Link href={post.path}>
                    <a>{post.title}</a>
                  </Link>
                </h2>
              </header>

              <div className="blog-list__post__content">{post.excerpt}</div>

              {index < posts.length - 1 && <div className="blog-list__post__separator themed--bg"></div>}
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
