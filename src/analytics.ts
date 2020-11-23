/** Unminified version of the Google Analytics snippet */

// Don't execute on the server-side
if (typeof window !== 'undefined') {
  window.ga =
    window.ga ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      ;(ga.q = ga.q || []).push(arguments)
    }
  ga.l = +new Date()

  if (process.env.NODE_ENV === 'production') {
    ga('create', 'UA-21361814-6', 'auto')
    ga('send', 'pageview')
  }

  const scripts = document.getElementsByTagName('script')
  // Inject at the bottom of the page to avoid injecting next to the structured data script tags
  // inside the React root and confusing React
  const injectionPoint = scripts[scripts.length - 1]
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://www.google-analytics.com/analytics.js'
  injectionPoint.parentNode?.insertBefore(script, injectionPoint)
}

export {}
