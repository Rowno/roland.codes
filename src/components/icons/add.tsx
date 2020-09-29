import React from 'react'
import { SvgProps } from './types'

export const AddIcon: React.FC<SvgProps> = (props) => {
  return (
    <svg width={31} height={31} viewBox="0 0 31 31" {...props}>
      <path d="M15.5 30C23.508 30 30 23.508 30 15.5S23.508 1 15.5 1 1 7.492 1 15.5 7.492 30 15.5 30zm0 1C6.94 31 0 24.06 0 15.5 0 6.94 6.94 0 15.5 0 24.06 0 31 6.94 31 15.5 31 24.06 24.06 31 15.5 31z" />
      <path d="M15 7h1v17h-1z" />
      <path d="M7 16v-1h17v1z" />
    </svg>
  )
}
