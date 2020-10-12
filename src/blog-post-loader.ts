import path from 'path'
import cheerio from 'cheerio'
import { listFilePaths, loadFile, parseFilePath, findFileBySlug } from './content-loader'

const PREFIX_REGEXP = /^([0-9]+-[0-9]+-[0-9]+)-/
const BLOG_POST_PATH = path.resolve('src/content/blog-posts')

/** Represents the expected type of the YAML front matter for a blog post */
interface BlogPostMetadata {
  title: string
  description?: string
  commentsIssueId: number
}

export interface BlogPost extends BlogPostMetadata {
  /** URL slug of the blog post */
  slug: string
  /** Rendered Markdown content */
  contents: string
  /** Date extracted from the blog post file name */
  date: string
  /** Short excerpt of the start of the blog post */
  excerpt: string
}

/** Loads a blog post by it's file path */
async function loadBlogPost(filePath: string): Promise<BlogPost | undefined> {
  const file = await loadFile<BlogPostMetadata>(filePath)
  const parsedFilePath = parseFilePath(filePath, PREFIX_REGEXP)
  if (!parsedFilePath) {
    return
  }

  const $ = cheerio.load(file.contents)
  // Use the first paragraph as the excerpt
  const excerpt = $.html('p:first-child').trim()
  const date = new Date(parsedFilePath.prefix).toISOString()

  return {
    ...file.metadata,
    slug: parsedFilePath.slug,
    contents: file.contents,
    date,
    excerpt,
  }
}

/**
 * Replaces the placeholder codepen element with an iframe.
 *
 * The element should have the `codepen` class and `data-id` and `data-height` attributes.
 *
 * For example:
 * ```html
 * <p class="codepen" data-id="rhlfd" data-height="380">
 *   See the demo: <a href="/demos/legacy-flexbox-invisible-float-bug/">Legacy flexbox invisible float bug fix</a>
 * </p>
 * ```
 */
export function injectCodepenIframe(contents: string): string {
  const $ = cheerio.load(contents)
  const codepen = $('.codepen')

  if (codepen.length) {
    const id = codepen.data('id') as string | undefined
    const height = codepen.data('height') as number | undefined

    if (id && height) {
      codepen.replaceWith(`
        <iframe
          class="codepen-embed"
          src="https://codepen.io/anon/embed/${id}?height=${height}&default-tab=result"
          height="${height}"
          scrolling="no"
          frameborder="0"
          allowtransparency="true"
          allowfullscreen="true"></iframe>
      `)

      return $('body').html() ?? ''
    }
  }

  return contents
}

/** Loads a blog post by it's slug */
export async function loadBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const filePath = await findFileBySlug(BLOG_POST_PATH, PREFIX_REGEXP, slug)
  if (!filePath) {
    return
  }

  return loadBlogPost(filePath)
}

/** Loads all of the blog posts */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  const filePaths = await listFilePaths(BLOG_POST_PATH)

  const blogPosts = await Promise.all(filePaths.map((filePath) => loadBlogPost(filePath)))

  return blogPosts.filter((blogPost): blogPost is BlogPost => Boolean(blogPost)).reverse()
}

/** Gets the slugs of all the blog posts without loading the files */
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
