// Pulled from the nunjucks source code:
// https://github.com/mozilla/nunjucks/blob/f91f1c3fd14fde683e71a61563e46b547c9160e4/nunjucks/src/lib.js#L140-L142

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
}

const escapeRegex = /[&"'<>]/g

function lookupEscape(character: string): string {
  return escapeMap[character]
}

export function htmlEscape(value: string): string {
  return value.replace(escapeRegex, lookupEscape)
}
