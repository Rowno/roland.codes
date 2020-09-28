import React from 'react'
import { WebSite, Person, BreadcrumbList } from 'schema-dts'

interface StructuredDataProps {
  children: Exclude<WebSite | Person | BreadcrumbList, string>
}

export const StructuredData: React.FC<StructuredDataProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = {
    '@context': 'http://schema.org',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ...children,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
