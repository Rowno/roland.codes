import React from 'react'
import { NextPage } from 'next'
import { Layout } from '../components/layout'
import { StructuredData } from '../components/structured-data'
import { BASE_URL } from '../config'

const NotFoundPage: NextPage = () => {
  return (
    <Layout title="404" hideFooter>
      <div className="not-found">
        <h1>404</h1>
        Oops. Looks like you’ve taken a wrong turn. Or maybe you just wanted to admire my 404 page. ;)
      </div>

      <StructuredData>
        {{
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': BASE_URL,
                name: 'Home',
              },
            },
          ],
        }}
      </StructuredData>
    </Layout>
  )
}

export default NotFoundPage
