import { promises as fs } from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import MarkdownIt from 'markdown-it'

const markdownParser = new MarkdownIt()

interface File<M> {
  fileName: string
  metadata: M
  contents: string
}

async function loadFiles<M>(directoryPath: string): Promise<File<M>[]> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true })
  const onlyFiles = files.filter((file) => file.isFile())

  return Promise.all(
    onlyFiles.map(async (file) => {
      const fileData = await fs.readFile(path.join(directoryPath, file.name), { encoding: 'utf8' })
      const fileFrontMatter = frontMatter(fileData)

      return {
        fileName: file.name,
        metadata: fileFrontMatter.attributes as M,
        contents: markdownParser.render(fileFrontMatter.body),
      }
    })
  )
}

interface ParsedFileName {
  slug: string
  prefix: string
}

function parseFileName(fileName: string, prefixRegex: RegExp): ParsedFileName | undefined {
  const { name } = path.parse(fileName)
  const result = prefixRegex.exec(name)
  if (!result) {
    return
  }

  const prefix = result[1]
  if (!prefix) {
    return
  }

  return {
    prefix,
    slug: name.replace(result[0], ''),
  }
}

interface ProjectMetadata {
  title: string
  description: string
  twitterCard: 'summary' | 'summary_large_image'
  socialImage: string
  links: Link[]
  logos?: string[]
}

export interface Project extends ProjectMetadata {
  slug: string
  contents: string
}

export interface Link {
  name: string
  url: string
}

export async function loadProjects(): Promise<Project[]> {
  const files = await loadFiles<ProjectMetadata>(path.resolve('src/content/projects'))

  const projects: Project[] = []

  for (const file of files) {
    const parsedFileName = parseFileName(file.fileName, /^([0-9]+)-/)
    if (!parsedFileName) {
      continue
    }

    projects.push({
      ...file.metadata,
      slug: parsedFileName.slug,
      contents: file.contents,
    })
  }

  return projects
}
