import * as THREE from "three"
import { MeshLine, MeshLineMaterial } from "three.meshline"
import { easing, everyFrame, timeline } from "popmotion"

class Logo {
  constructor(container) {
    this.scene = new THREE.Scene()
    const ratio = container.offsetWidth / container.offsetHeight
    const d = 3.5

    // prettier-ignore
    this.camera = new THREE.OrthographicCamera(-d * ratio, d * ratio, d, -d,  1, 1000)
    this.camera.position.set(d, d, d)
    this.camera.lookAt(this.scene.position)

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })

    this.renderer.setPixelRatio(2)

    container.appendChild(this.renderer.domElement)

    this.lineMat = new MeshLineMaterial({
      color: new THREE.Color(0xf1f1f1),
      lineWidth: 0.025,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(
        container.offsetWidth,
        container.offsetHeight,
      ),
    })

    // prettier-ignore
    this.rect = this.lineMesh([
      -1.0,  0.0,  1.0,
       1.0,  0.0,  1.0,
       1.0,  0.0, -1.0,
      -1.0,  0.0, -1.0,
      -1.0,  0.0,  1.0,
    ])

    // prettier-ignore
    this.rectOpen = this.lineMesh([
      -1.0,  0.0,  1.0,
       1.0,  0.0,  1.0,
       1.0,  0.0, -1.0,
      -1.0,  0.0, -1.0,
    ])

    // prettier-ignore
    this.line = this.lineMesh([
       0.0, -1.0, 0.0,
       0.0,  1.0, 0.0,
    ])

    // Animation loop
    this.loop = undefined
    this.playback = undefined

    this.drawGrid()

    this.line0 = this.line.clone()
    // Offset the center line by 1
    this.line0.position.set(0, 1, 0)

    this.group1 = new THREE.Group()
    this.group1.position.set(-1, 0, 0)

    this.rect0 = this.rect.clone()
    this.rect0.rotation.order = "YXZ"

    // Offset the rectangle and children by 1
    this.rect0.position.set(0, 1, 0)

    this.rect1 = this.rect.clone()
    this.rect1.position.set(-1, 0, 0)

    this.rect2 = this.rectOpen.clone()
    this.rect2.position.set(1, 0, 0)
    this.rect2.rotation.set(0, Math.PI, 0)

    this.group2 = new THREE.Group()
    this.group2.add(this.rect2)
    this.group2.position.set(-2, 0, 0)
    this.group2.rotation.set(0, 0, -Math.PI / 2)

    this.rect5 = this.rect.clone()
    this.rect5.position.set(0, 0, -1)

    this.group5 = new THREE.Group()
    this.group5.position.set(0, 0, -1)
    this.group5.add(this.rect5)

    this.group3 = new THREE.Group()
    this.group3.position.set(-1, 0, 0)

    this.rect3 = this.rectOpen.clone()
    this.rect3.position.set(1, 0, 0)
    this.rect3.rotation.set(Math.PI, 0, 0)

    this.group3.add(this.rect3)
    this.rect2.add(this.group3)

    this.group3.rotation.z = Math.PI

    this.rect6 = this.rectOpen.clone()
    this.rect6.position.set(0, 0, 1)
    this.rect6.rotation.set(0, Math.PI / 2, 0)

    this.group6 = new THREE.Group()
    this.group6.position.set(0, 0, -2)
    this.group6.rotation.set(Math.PI / 2, 0, 0)

    this.group6.add(this.rect6)
    this.group5.add(this.group6)

    this.rect4 = this.rect.clone()
    this.rect4.position.set(-1, 0, 0)

    this.group4 = new THREE.Group()
    this.group4.position.set(2, 0, 0)

    this.group4.add(this.rect4)
    this.group3.add(this.group4)

    this.group4.rotation.z = -Math.PI / 2

    this.rect7 = this.rectOpen.clone()
    this.rect7.position.set(0, 0, 1)
    this.rect7.rotation.set(0, -Math.PI / 2, 0)

    this.group7 = new THREE.Group()
    this.group7.position.set(0, 0, 2)

    this.group7.add(this.rect7)
    this.group6.add(this.group7)

    this.group1.add(this.group2)
    this.group1.add(this.rect1)

    this.rect0.add(this.group1)
    this.rect0.add(this.group5)

    this.scene.add(this.line0)
    this.scene.add(this.rect0)

    this.setValues = this.setValues.bind(this)

    this.handleResize()

    window.addEventListener("resize", () => this.handleResize())
  }

  handleResize() {
    const elem = document.querySelector(".logo__link")
    const width = elem.offsetWidth
    const height = elem.offsetHeight

    this.renderer.setSize(width, height)
    this.lineMat.uniforms.resolution.value.set(width, height)
    this.lineMat.uniformsNeedUpdate = true

    this.renderer.render(this.scene, this.camera)
  }

  drawGrid() {
    const gridGeo = new THREE.PlaneBufferGeometry(8, 8, 4, 4)
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x323232,
      wireframe: true,
    })

    const grid = new THREE.Mesh(gridGeo, gridMat)
    grid.rotation.x = Math.PI / 2
    grid.position.set(-4, -4, -4)

    this.scene.add(grid)
    this.renderer.render(this.scene, this.camera)
  }

  lineMesh(vertices) {
    const line = new MeshLine()
    line.setGeometry(vertices)

    const mesh = new THREE.Mesh(line.geometry, this.lineMat)
    mesh.rotation.order = "YXZ"

    return mesh
  }

  setValues(v) {
    // Visibility
    this.rect0.visible = v.rect0Visible === 1 ? true : false

    // Rotations
    if (v.rect0 !== undefined) {
      this.rect0.rotation.x = v.rect0.x
      this.rect0.rotation.y = v.rect0.y
    }
    if (v.group1 !== undefined) this.group1.rotation.z = v.group1.z
    if (v.group2 !== undefined) this.group2.rotation.z = v.group2.z
    if (v.group3 !== undefined) this.group3.rotation.z = v.group3.z
    if (v.group4 !== undefined) this.group4.rotation.z = v.group4.z
    if (v.group5 !== undefined) this.group5.rotation.x = v.group5.x
    if (v.group6 !== undefined) this.group6.rotation.x = v.group6.x
    if (v.group7 !== undefined) this.group7.rotation.x = v.group7.x

    // Scale
    if (v.line0 !== undefined) this.line0.scale.set(1, v.line0.y, 1)
  }

  getTracks(forward) {
    const tracks = [
      {
        track: "rect0Visible",
        from: 0,
        to: 1,
        duration: 500,
      },
      [
        {
          track: "rect0",
          from: { x: -Math.PI / 5, y: Math.PI / 4 },
          to: { x: 0, y: 0 },
        },
        {
          track: "line0",
          from: { y: 0.0001 },
          to: { y: 1 },
        },
      ],
      {
        track: "group1Visible",
        from: 0,
        to: 1,
        duration: 10,
      },
      // "-10",
      { track: "group1", from: { z: -Math.PI }, to: { z: 0 } },
      [
        { track: "group2", from: { z: 0 }, to: { z: -Math.PI / 2 } },
        { track: "group5", from: { x: Math.PI }, to: { x: 0 } },
      ],
      [
        { track: "group3", from: { z: 0 }, to: { z: Math.PI } },
        { track: "group6", from: { x: 0 }, to: { x: Math.PI / 2 } },
      ],
      {
        track: "group4Visible",
        from: 0,
        to: 1,
        duration: 10,
      },
      // "-10",
      [
        { track: "group4", from: { z: 0 }, to: { z: -Math.PI / 2 } },
        { track: "group7", from: { x: -Math.PI }, to: { x: 0 } },
      ],
    ]

    // Recursively reverses tracks and swaps their from and to values
    const reverse = tracks =>
      tracks.reverse().map(track => {
        if (Array.isArray(track)) {
          return reverse(track)
        }

        if (typeof track === "string") {
          return track.includes("+")
            ? track.replace("+", "-")
            : track.replace("-", "+")
        }

        return { ...track, from: track.to, to: track.from }
      })

    if (forward) {
      return tracks
    }

    return reverse(tracks)
  }

  start(forward) {
    this.loop = everyFrame().start(() => {
      this.renderer.render(this.scene, this.camera)
    })

    if (this.playback) {
      this.playback.reverse()
    } else {
      this.playback = timeline(this.getTracks(forward), {
        ease: easing.linear,
        duration: 2000,
      }).start({
        update: this.setValues,
        complete: () => {
          this.loop.stop()
          this.loop = undefined
          this.playback = undefined
        },
      })
    }
  }
}

export default Logo
