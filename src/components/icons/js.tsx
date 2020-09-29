import React from 'react'
import { SvgProps } from './types'

export const JsIcon: React.FC<SvgProps> = (props) => {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" {...props}>
      <title>JavaScript</title>
      <path
        fill="none"
        d="M.5.614h54.745V55.36H.5V.613zm27.1 26.14v17.11c0 4.24-6.805 7.526-10.774 1.504m29.836-15.602c-.82-2.968-9.99-4.654-9.99 1.78 0 6.43 11.358 5.747 11.358 11.495 0 5.75-7.005 7.668-11.988 2.604"
      />
    </svg>
  )
}
