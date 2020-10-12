const DISTANCE = 300
const EXPLODE_PARTICLES = 20
const IMAGE_SIZE = 32
const ANIMATION_DURATION = 2000
const TRIGGER_PHRASE = 'rolee'
let triggerPosition = 0
let activated = false
let mouseX = 0
let mouseY = 0
let overlay: HTMLDivElement

export {}

function getRandomCoordinate() {
  const min = -DISTANCE
  const max = DISTANCE
  return Math.random() * (max - min) + min
}

function injectImage() {
  const startX = mouseX - IMAGE_SIZE / 2
  const startY = mouseY - IMAGE_SIZE / 2
  const destX = getRandomCoordinate()
  const destY = getRandomCoordinate()

  // Create wrapper div with starting position
  const wrapper = document.createElement('div')
  wrapper.className = 'rolee__wrapper'
  wrapper.style.left = `${startX}px`
  wrapper.style.top = `${startY}px`

  // Create image and inject into wrapper div
  const img = document.createElement('img')
  img.src = '/assets/images/rolee.png'
  img.width = IMAGE_SIZE
  img.height = IMAGE_SIZE
  wrapper.appendChild(img)

  // Inject wrapper div into the dom
  overlay.appendChild(wrapper)

  // Allow the browser to batch recalculate styles
  setTimeout(() => {
    // Apply destination position and fade out
    wrapper.style.opacity = '0'
    wrapper.style.transform = `translate(${destX}px, ${destY}px)`

    // Garbage collection
    setTimeout(() => overlay.removeChild(wrapper), ANIMATION_DURATION)
  }, 1)
}

function explode() {
  window.requestAnimationFrame(() => {
    for (let i = 0; i < EXPLODE_PARTICLES; i += 1) {
      injectImage()
    }
  })
}

function activate() {
  if (activated) {
    return
  }

  activated = true

  // Inject overlay
  overlay = document.createElement('div')
  overlay.className = 'rolee'
  document.body.appendChild(overlay)

  // Set initial mouse coordinates to center screen
  mouseX = overlay.offsetWidth / 2
  mouseY = overlay.offsetHeight / 2

  document.addEventListener('mousedown', explode, false)

  // Capture relative mouse coordinates
  document.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.pageX - document.body.scrollLeft
      mouseY = e.pageY - document.body.scrollTop
    },
    false
  )
}

// Don't execute on the server-side
if (typeof window !== 'undefined') {
  document.addEventListener(
    'keypress',
    (e) => {
      // Match entered characters to trigger phrase
      if (e.key === TRIGGER_PHRASE[triggerPosition]) {
        triggerPosition += 1
      } else {
        triggerPosition = 0
      }

      if (triggerPosition === TRIGGER_PHRASE.length) {
        triggerPosition = 0
        activate()
        explode()
      }
    },
    false
  )
}
