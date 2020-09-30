module.exports = {
  trailingSlash: true,

  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    // These headers are only used during development. See netlify.toml for the production headers
    const headers = [
      {
        key: 'Expect-Ct',
        value: 'max-age=0',
      },
      {
        key: 'Content-Security-Policy',
        value:
          "base-uri 'none'; block-all-mixed-content; connect-src 'self' https://api.github.com; default-src 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://codepen.io; img-src *; object-src 'none'; script-src 'self' https://www.google-analytics.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; style-src-elem 'self' 'unsafe-inline'; upgrade-insecure-requests",
      },
      {
        key: 'Referrer-Policy',
        value: 'no-referrer',
      },
      {
        key: 'X-Dns-Prefetch-Control',
        value: 'off',
      },
      {
        key: 'X-Download-Options',
        value: 'noopen',
      },
      {
        key: 'X-Permitted-Cross-Domain-Policies',
        value: 'none',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-XSS-Protection',
        value: '0',
      },
    ]

    return [
      {
        // Wildcards can't match the root path
        source: '/',
        headers,
      },
      {
        source: '/:path*',
        headers,
      },
    ]
  },
}
