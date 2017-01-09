'use strict'
const $ = require('jquery')

for (const codepen of $('.codepen')) {
  const $codepen = $(codepen)
  const data = $codepen.data()

  const iframe = `
    <iframe
      class="codepen-embed"
      src="https://codepen.io/anon/embed/${data.id}?height=${data.height}&amptheme-id=17006&ampdefault-tab=result"
      height="${data.height}"
      scrolling="no"
      frameborder="0"
      allowtransparency="true"
      allowfullscreen="true"></iframe>
  `

  $codepen.replaceWith(iframe)
}
