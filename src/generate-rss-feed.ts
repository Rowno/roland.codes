import path from 'path'
import { formatISO } from 'date-fns'
import { BlogPost } from './blog-post-loader'
import { BASE_URL } from './config'
import { promises as fs } from 'fs'
import { htmlEscape } from './html-escape'

function generateEntry(blogPost: BlogPost): string {
  return `
    <entry>
      <id>${BASE_URL}/blog/${blogPost.slug}/</id>
      <title>${blogPost.title}</title>
      <updated>${formatISO(blogPost.date)}</updated>
      <link rel="alternate" href="${BASE_URL}/blog/${blogPost.slug}/" />
      <author>
        <name>Roland Warmerdam</name>
        <uri>${BASE_URL}/</uri>
      </author>
      <content type="html">
        ${htmlEscape(blogPost.contents)}
      </content>
    </entry>
  `
}

export async function generateRssFeed(blogPosts: BlogPost[]): Promise<void> {
  const now = new Date()
  const feed = `<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <id>${BASE_URL}/</id>
      <title>Roland Warmerdam</title>
      <updated>${now.toISOString()}</updated>
      <link rel="self" href="${BASE_URL}/feed.xml" />
      <rights>Copyright © 2011-${now.getFullYear()} Roland Warmerdam</rights>
      ${blogPosts.map(generateEntry).join('')}
    </feed>
  `

  await fs.writeFile(path.resolve('public/feed.xml'), feed)
}
