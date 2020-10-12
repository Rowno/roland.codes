import { promises as fs } from 'fs'
import path from 'path'
import frontMatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import highlightjs from 'highlight.js'

const markdownParser = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: function (code, language) {
    if (language && highlightjs.getLanguage(language)) {
      return highlightjs.highlight(language, code).value
    } else {
      return highlightjs.highlightAuto(code).value
    }
  },
})

/** Gets the paths of every file in a directory */
export async function listFilePaths(directoryPath: string): Promise<string[]> {
  const files = await fs.readdir(directoryPath, { withFileTypes: true })
  const onlyFiles = files.filter((file) => file.isFile())
  return onlyFiles.map((file) => path.join(directoryPath, file.name))
}

interface File<M> {
  filePath: string
  /** Parsed YAML front matter */
  metadata: M
  /** Compiled Markdown content */
  contents: string
}

/** Loads a Markdown file and parses the YAML front matter and compiles the Markdown content */
export async function loadFile<M>(filePath: string): Promise<File<M>> {
  const fileData = await fs.readFile(filePath, { encoding: 'utf8' })
  const fileFrontMatter = frontMatter(fileData)

  return {
    filePath,
    metadata: fileFrontMatter.attributes as M,
    contents: markdownParser.render(fileFrontMatter.body),
  }
}

interface ParsedFilePath {
  filePath: string
  slug: string
  prefix: string
}

/** Parses a file path, extracting the prefix and slug from the file name */
export function parseFilePath(filePath: string, prefixRegex: RegExp): ParsedFilePath | undefined {
  const { name } = path.parse(filePath)
  const result = prefixRegex.exec(name)
  if (!result) {
    return
  }

  const prefix = result[1]
  if (!prefix) {
    return
  }

  return {
    filePath,
    prefix,
    slug: name.replace(result[0], ''),
  }
}

/** Gets the path of a file in a directory by it's slug */
export async function findFileBySlug(
  directoryPath: string,
  prefixRegex: RegExp,
  slug: string
): Promise<string | undefined> {
  const filePaths = await listFilePaths(directoryPath)

  return filePaths.find((filePath) => {
    const parsedFilePath = parseFilePath(filePath, prefixRegex)
    if (!parsedFilePath) {
      return false
    }

    return parsedFilePath.slug === slug
  })
}
