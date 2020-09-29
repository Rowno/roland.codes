import React from 'react'
import { SvgProps } from './types'

export const CssIcon: React.FC<SvgProps> = (props) => {
  return (
    <svg width={48} height={55} viewBox="0 0 48 55" {...props}>
      <title>CSS</title>
      <path
        fill="none"
        d="M19.09 24.657h14.905m-22.882-12.75h23.6m-11.18 41.998l-18.818-6L.5.655h46.065l-4.216 47.25-18.82 6m11.18-41.998l-1.47 26.325-10.086 3.225-9.936-3.225-.338-4.284"
      />
    </svg>
  )
}
