const randRange = (min, max) => Math.random() * (max - min) + min

class Particle {
  constructor(
    canvasWidth,
    canvasHeight,
    sizeMin,
    sizeMax,
    speedMin,
    speedMax,
    rotationMin,
    rotationMax,
    // bounds,
    renderOutside = true,
  ) {
    this.size = randRange(sizeMin, sizeMax)

    const bounds = 50

    // We want particles to already be visible at first
    if (renderOutside) {
      this.x = randRange(-canvasWidth, -this.size)
    } else {
      this.x = randRange(50, canvasWidth - 50)
    }

    this.y = randRange(50, canvasHeight - 50)

    this.opacity = 0.75
    this.shape = ["plus", "square", "triangle"][Math.floor(Math.random() * 3)]

    // Particle x and y direction
    const dirX = randRange(1, 2)
    const dirY = randRange(-1, 1)

    this.rotation = Math.random() * Math.PI
    this.rotationSpeed = randRange(rotationMin, rotationMax)

    const speed = randRange(speedMin, speedMax)

    this.vx = dirX * speed
    this.vy = dirY * speed
  }
}

class ShapeParticles {
  constructor({
    container,
    amount = 10,
    // bounds = 50,
    sizeMin = 6,
    sizeMax = 8,
    speedMin = 0.1,
    speedMax = 0.8,
    rotationMin = 0.01,
    rotationMax = 0.05,
  } = {}) {
    this.options = {
      container,
      amount,
      sizeMin,
      sizeMax,
      speedMin,
      speedMax,
      rotationMin,
      rotationMax,
    }

    this.createCanvas()

    this.handleResize()
    window.addEventListener("resize", () => this.handleResize())

    this.particles = Array(amount)
      .fill()
      .map(
        () =>
          new Particle(
            this.canvas.width,
            this.canvas.height,
            this.options.sizeMin,
            this.options.sizeMax,
            this.options.speedMin,
            this.options.speedMax,
            this.options.rotationMin,
            this.options.rotationMax,
            false,
          ),
      )

    this.renderCanvas()
  }

  handleResize() {
    this.width = this.canvas.offsetWidth
    this.height = this.canvas.offsetHeight

    this.canvas.width = this.width * this.pixelRatio
    this.canvas.height = this.height * this.pixelRatio
  }

  getElement(element) {
    if (element.nodeType) {
      return element
    }

    return typeof element === "string"
      ? document.querySelector(element)
      : element
  }
  createCanvas() {
    const container = this.getElement(this.options.container)

    if (container === null) {
      throw new Error(`container ${this.options.container} is null`)
    }

    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.display = "block"
    this.canvas.style.position = "absolute"
    this.ctx = this.canvas.getContext("2d")

    container.appendChild(this.canvas)

    this.pixelRatio = window.devicePixelRatio || 1

    this.width = this.canvas.offsetWidth * this.pixelRatio
    this.height = this.canvas.offsetHeight * this.pixelratio

    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  drawShape(shape, x, y, size, opacity, rotation) {
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = `rgba(54, 54, 54, ${opacity})`

    // Save transforms
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate(rotation)
    this.ctx.translate(-x, -y)

    switch (shape) {
      case "plus":
        this.ctx.beginPath()
        this.ctx.moveTo(x - size, y)
        this.ctx.lineTo(x + size, y)
        this.ctx.moveTo(x, y - size)
        this.ctx.lineTo(x, y + size)
        this.ctx.closePath()
        this.ctx.stroke()
        break
      case "square":
        this.ctx.strokeRect(x - size, y - size, size * 2, size * 2)
        break
      case "triangle":
        const centroid = size * (Math.sqrt(3) / 2)

        this.ctx.beginPath()
        this.ctx.moveTo(x, y - centroid)
        this.ctx.lineTo(x + size, y + centroid)
        this.ctx.lineTo(x - size, y + centroid)
        this.ctx.closePath()
        this.ctx.stroke()
        break
    }

    this.ctx.restore()
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      // Remove particles that have gone out of bounds
      if (particle.x > this.canvas.width) {
        this.particles.splice(i, 1)
        continue
      }

      // TODO: Clean up code below
      // Invert the velocity if the particle nears the top or bottom edge
      const bounds = 50

      if (particle.y < bounds) {
        // Value ranging from 0–1 that smooths the flipping of the particle velocity
        const smooth = (-particle.y + bounds) / bounds
        particle.vy += smooth * -particle.vy + 0.05
        particle.y += particle.vy
      } else if (particle.y > this.canvas.height - bounds) {
        const smooth = (-(this.canvas.height - particle.y) + bounds) / bounds
        particle.vy += smooth * -particle.vy - 0.05
        particle.y += particle.vy
      }

      particle.x += particle.vx
      particle.y += particle.vy

      // Fade particle in or out
      if (particle.x < 100) {
        particle.opacity = particle.x / 100
      } else if (particle.x > this.canvas.width - 100) {
        particle.opacity = (this.canvas.width - particle.x) / 100
      }

      particle.rotation += particle.rotationSpeed

      this.drawShape(
        particle.shape,
        particle.x,
        particle.y,
        particle.size,
        particle.opacity,
        particle.rotation,
      )
    }

    // If particles were deleted, add new ones
    while (this.particles.length < this.options.amount) {
      this.particles.push(
        new Particle(
          this.canvas.width,
          this.canvas.height,
          this.options.sizeMin,
          this.options.sizeMax,
          this.options.speedMin,
          this.options.speedMax,
          this.options.rotationMin,
          this.options.rotationMax,
        ),
      )
    }
  }

  renderCanvas() {
    requestAnimationFrame(() => this.renderCanvas())
    this.drawParticles()
  }
}

export default ShapeParticles
