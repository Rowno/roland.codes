import React from 'react'
import { NextPage } from 'next'
import { Layout } from '../components/layout'

const NotFoundPage: NextPage = () => {
  return (
    <Layout title="404" hideFooter>
      <div className="not-found">
        <h1>404</h1>
        Oops. Looks like you’ve taken a wrong turn. Or maybe you just wanted to admire my 404 page. ;)
      </div>
    </Layout>
  )
}

export default NotFoundPage
