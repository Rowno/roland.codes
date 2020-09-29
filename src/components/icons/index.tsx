import { AddIcon } from './add'
import { CssIcon } from './css'
import { GitIcon } from './git'
import { HtmlIcon } from './html'
import { JsIcon } from './js'
import { LinuxIcon } from './linux'
import { NodeIcon } from './node'
import { TetrisIcon } from './tetris'
import { SvgProps } from './types'

export { AddIcon, CssIcon, GitIcon, HtmlIcon, JsIcon, LinuxIcon, NodeIcon, TetrisIcon }

export const icons: { [k: string]: React.FC<SvgProps> } = {
  add: AddIcon,
  css: CssIcon,
  git: GitIcon,
  html: HtmlIcon,
  js: JsIcon,
  linux: LinuxIcon,
  node: NodeIcon,
  tetris: TetrisIcon,
}
