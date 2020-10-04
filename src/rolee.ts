export {}

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

const STYLES = `
.rolee {
  overflow: hidden;
  position: fixed;
  z-index: 999999;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.rolee__wrapper {
  opacity: 1;
  position: absolute;
  transition: opacity 2s cubic-bezier(0.95, 0.05, 0.795, 0.035),
              transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.rolee img {
  max-width: none;
  animation: 1s steps(1) infinite rolee;
}

@keyframes rolee {
  0% {
    transform: none;
  }

  25% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotateY(180deg);
  }
}
`

function randomCoordinate() {
  const min = -DISTANCE
  const max = DISTANCE
  return Math.random() * (max - min) + min
}

function injectImage() {
  const startX = mouseX - IMAGE_SIZE / 2
  const startY = mouseY - IMAGE_SIZE / 2
  const destX = randomCoordinate()
  const destY = randomCoordinate()

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
    wrapper.style.webkitTransform = `translate(${destX}px, ${destY}px)`
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

  // Inject styles
  const style = document.createElement('style')
  style.textContent = STYLES
  document.head.appendChild(style)

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
