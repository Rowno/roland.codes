import path from 'path'
import cheerio from 'cheerio'
import { listFilePaths, loadFile, parseFilePath, findFileBySlug } from './content-loader'

const PREFIX_REGEXP = /^([0-9]+-[0-9]+-[0-9]+)-/
const BLOG_POST_PATH = path.resolve('src/content/blog-posts')

interface BlogPostMetadata {
  title: string
  description?: string
  commentsIssueId: number
}

export interface BlogPost extends BlogPostMetadata {
  slug: string
  contents: string
  date: number
  excerpt: string
}

async function loadBlogPost(filePath: string): Promise<BlogPost | undefined> {
  const file = await loadFile<BlogPostMetadata>(filePath)
  const parsedFilePath = parseFilePath(filePath, PREFIX_REGEXP)
  if (!parsedFilePath) {
    return
  }

  let contents = file.contents
  const $ = cheerio.load(contents)
  const excerpt = $.html('p:first-child').trim()

  const codepen = $('.codepen')
  if (codepen.length) {
    const id = codepen.data('id') as string | undefined
    const height = codepen.data('height') as number | undefined

    if (id && height) {
      codepen.replaceWith(`
        <iframe
          class="codepen-embed"
          src="https://codepen.io/anon/embed/${id}?height=${height}&amptheme-id=17006&ampdefault-tab=result"
          height="${height}"
          scrolling="no"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen="true"></iframe>
      `)

      contents = $('body').html() ?? ''
    }
  }

  return {
    ...file.metadata,
    slug: parsedFilePath.slug,
    contents,
    date: new Date(parsedFilePath.prefix).getTime(),
    excerpt,
  }
}

export async function loadBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const filePath = await findFileBySlug(BLOG_POST_PATH, PREFIX_REGEXP, slug)
  if (!filePath) {
    return
  }

  return loadBlogPost(filePath)
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const filePaths = await listFilePaths(BLOG_POST_PATH)

  const blogPosts = await Promise.all(filePaths.map((filePath) => loadBlogPost(filePath)))

  return blogPosts.filter((blogPost): blogPost is BlogPost => Boolean(blogPost)).reverse()
}

export async function loadBlogPostSlugs(): Promise<string[]> {
  const filePaths = await listFilePaths(BLOG_POST_PATH)

  const slugs: string[] = []
  for (const filePath of filePaths) {
    const parsedFilePath = parseFilePath(filePath, PREFIX_REGEXP)
    if (parsedFilePath) {
      slugs.push(parsedFilePath.slug)
    }
  }

  return slugs.reverse()
}
