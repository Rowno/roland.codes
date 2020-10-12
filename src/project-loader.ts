import path from 'path'
import { listFilePaths, loadFile, parseFilePath, findFileBySlug } from './content-loader'

const PREFIX_REGEXP = /^([0-9]+)-/
const PROJECTS_PATH = path.resolve('src/content/projects')

/** Represents the expected type of the YAML front matter for a project */
interface ProjectMetadata {
  title: string
  description: string
  twitterCard: 'summary' | 'summary_large_image'
  socialImage: string
  links: Link[]
  /** List of logo names. Available icons are in src/components/icons */
  logos?: string[] | null
}

interface Link {
  name: string
  url: string
}

export interface Project extends ProjectMetadata {
  /** URL slug of the project */
  slug: string
  /** Rendered Markdown content */
  contents: string
}

/** Loads a project by it's file path */
async function loadProject(filePath: string): Promise<Project | undefined> {
  const file = await loadFile<ProjectMetadata>(filePath)
  const parsedFilePath = parseFilePath(filePath, PREFIX_REGEXP)
  if (!parsedFilePath) {
    return
  }

  return {
    ...file.metadata,
    slug: parsedFilePath.slug,
    contents: file.contents,
  }
}

/** Loads a project by it's slug */
export async function loadProjectBySlug(slug: string): Promise<Project | undefined> {
  const filePath = await findFileBySlug(PROJECTS_PATH, PREFIX_REGEXP, slug)
  if (!filePath) {
    return
  }

  return loadProject(filePath)
}

/** Loads all of the projects */
export async function loadProjects(): Promise<Project[]> {
  const filePaths = await listFilePaths(PROJECTS_PATH)

  const projects = await Promise.all(filePaths.map((filePath) => loadProject(filePath)))

  return projects.filter((project): project is Project => Boolean(project))
}

/** Gets the slugs of all the projects without loading the files */
export async function loadProjectSlugs(): Promise<string[]> {
  const filePaths = await listFilePaths(PROJECTS_PATH)

  const slugs: string[] = []
  for (const filePath of filePaths) {
    const parsedFilePath = parseFilePath(filePath, PREFIX_REGEXP)
    if (parsedFilePath) {
      slugs.push(parsedFilePath.slug)
    }
  }

  return slugs
}
