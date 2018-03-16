/**
 * Smaller version of Vincent Garreau's particles.js
 * @see https://github.com/VincentGarreau/particles.js
 */

const TAU = Math.PI * 2

class Particle {
  constructor(canvasWidth, canvasHeight, minSpeed, maxSpeed) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight

    const randX = Math.random() * 2 - 1
    const randY = Math.random() * 2 - 1

    const min = randX > 0 ? 0.1 : 0.1 * -1
    const max = randX > 0 ? 1.0 : 1.0 * -1

    this.vx = min + ( ( randX * maxSpeed ) - min )
    this.vy = max + ( ( randY * maxSpeed ) - max )
  }
}

class ParticleCanvas {
  constructor({
    tag = ".particles",
    amount = 10,
    minSpeed = 0.1,
    maxSpeed = 1.0,
    pixelRatio = 1,
    canvasWidth = 0,
    canvasHeight = 0,
  } = {}) {
    this.conf = { tag, amount, minSpeed, maxSpeed, pixelRatio, canvasWidth, canvasHeight }

    this.initCanvas()
    this.sizeCanvas()

    // Create particles
    this.particles = Array(amount).fill().map(() =>
      new Particle(
        this.canvas.width,
        this.canvas.height,
        this.conf.minSpeed,
        this.conf.maxSpeed,
      ))

    this.animCanvas()
  }

  initCanvas() {
    const tag = document.querySelector(this.conf.tag)

    if (!tag) {
      return console.error(`Tag ${this.conf.tag} not found in page`)
    }

    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"

    tag.appendChild(canvas)

    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    this.conf.pixelRatio = window.devicePixelRatio || 1
    this.conf.width = canvas.offsetWidth * this.conf.pixelRatio
    this.conf.height = canvas.offsetHeight * this.conf.pixelRatio
  }

  sizeCanvas() {
    this.canvas.width = this.conf.width
    this.canvas.height = this.conf.height

    window.addEventListener("resize", () => {
      this.conf.width = this.canvas.offsetWidth
      this.conf.height = this.canvas.offsetHeight

      this.canvas.width = this.conf.width * this.conf.pixelRatio
      this.canvas.height = this.conf.height * this.conf.pixelRatio
    })
  }

  createParticles() {
    while (this.particles.length < this.conf.amount) {
      this.particles.push(new Particle(
        this.canvas.width,
        this.canvas.height,
        this.conf.minSpeed,
        this.conf.maxSpeed,
      ))
    }
  }

  updateParticles() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.conf.width, this.conf.height)

    // Add new particles for those that went out of bounds
    this.createParticles()

    this.ctx.fillStyle = "rgba(255,255,255,0.125)"

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      // Remove the particles outside of the canvas
      if (particle.x > this.canvas.width || particle.x < 0 ||
          particle.y > this.canvas.height || particle.y < 0 ) {
            this.particles.splice(i, 1)
            continue
      }

      // Move the particle by its velocity
      particle.x += particle.vx
      particle.y += particle.vy

      // Draw the actual particle
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, 1, 0, TAU)
      this.ctx.fill()

      // Loop through all possible particle combinations
      for (let j = 1 + i; j < this.particles.length; j++) {
        // Connect the particles that are close to each other
        this.connectParticles(this.particles[i], this.particles[j])
      }     
    }
  }

  connectParticles(p1, p2) {
    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)

    if (dist <= 150) {
      const lineOpacity = 0.125 * ( 1 - ( dist / 150 ) )

      if (lineOpacity > 0) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
        this.ctx.lineWidth = "0.75"

        this.ctx.beginPath()
        this.ctx.moveTo(p1.x, p1.y)
        this.ctx.lineTo(p2.x, p2.y)
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
  }

  animCanvas() {
    requestAnimationFrame(() => this.animCanvas())
    this.updateParticles()
  }
}

new ParticleCanvas({
  tag: "#footer__particles",
  amount: 20,
  minSpeed: 0.1,
  maxSpeed: 0.2,
})
