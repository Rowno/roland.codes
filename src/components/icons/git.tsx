import React from 'react'
import { SvgProps } from './types'

export const GitIcon: React.FC<SvgProps> = (props) => {
  return (
    <svg width={62} height={62} viewBox="0 0 62 62" {...props}>
      <title>Git</title>
      <path
        fill="none"
        d="M22.902 7.546l6.847 6.874a4.533 4.533 0 014.68 1.095 4.596 4.596 0 011.08 4.732l6.6 6.624a4.549 4.549 0 014.712 1.09 4.596 4.596 0 010 6.48 4.548 4.548 0 01-6.453 0 4.597 4.597 0 01-.993-4.98l-6.154-6.18v16.26c.433.217.844.505 1.205.867a4.596 4.596 0 010 6.48 4.55 4.55 0 01-6.45 0 4.592 4.592 0 011.492-7.48V22.99a4.494 4.494 0 01-1.494-.998 4.588 4.588 0 01-.98-5.007l-6.75-6.777L2.426 28.1a3.856 3.856 0 000 5.444L28.42 59.638a3.825 3.825 0 005.423 0l25.872-25.972a3.862 3.862 0 000-5.446L33.72 2.127a3.821 3.821 0 00-5.42 0l-2.846 2.857"
      />
    </svg>
  )
}