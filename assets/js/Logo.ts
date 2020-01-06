// Manual imports due to three.js not yet working
// https://github.com/mrdoob/three.js/issues/16059#issuecomment-528102128
// import { Euler } from "three/src/math/Euler"
// import { Mesh } from "three/src/objects/Mesh"
// import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
// import { OrthographicCamera } from "three/src/cameras/OrthographicCamera"
// import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry"
// import { Scene } from "three/src/scenes/Scene"
// import { Vector3 } from "three/src/math/Vector3"
// import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import {
    Euler,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PlaneBufferGeometry,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three"

import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2"

import { TimelineLite } from "gsap"

const mat = new LineMaterial({ color: 0xfefefe, linewidth: 0.0125 })

const lineMesh = (points: Vector3[]) => ({
    position = new Vector3(),
    rotation = new Euler(),
    rotationOrder = "XYZ",
    pivot = new Vector3(),
} = {}): LineSegments2 => {
    const myPoints = points.flatMap(point =>
        new Vector3().addVectors(point, pivot).toArray(),
    )
    const geo = new LineGeometry().setPositions(myPoints)

    const mesh = new LineSegments2(geo, mat)
    mesh.position.copy(position)
    mesh.rotation.copy(rotation)
    mesh.rotation.order = rotationOrder

    return mesh
}
// prettier-ignore
const singleLineMesh = lineMesh([
    new Vector3(-1, 0,-1),
    new Vector3( 1, 0, 1)
])
// prettier-ignore
const threeLineMesh = lineMesh([
    new Vector3(-1, 0, 1),
    new Vector3(-1, 0,-1),
    new Vector3( 1, 0,-1),
    new Vector3( 1, 0, 1)
])
// prettier-ignore
const fourLineMesh = lineMesh([
    new Vector3(-1, 0, 1),
    new Vector3(-1, 0,-1),
    new Vector3( 1, 0,-1),
    new Vector3( 1, 0, 1),
    new Vector3(-1, 0, 1)
])

class Logo {
    scene: Scene
    camera: OrthographicCamera
    renderer: WebGLRenderer

    C1: LineSegments2
    C2: LineSegments2
    L1: LineSegments2
    L2: LineSegments2
    L3: LineSegments2
    L4: LineSegments2
    R1: LineSegments2
    R2: LineSegments2
    R3: LineSegments2

    timeline: TimelineLite

    constructor(container: HTMLCanvasElement) {
        this.scene = new Scene()

        if (!(container.parentNode instanceof HTMLElement)) {
            throw new Error("canvas should be wrapped in a node")
        }

        // Isometric camera
        const frustumSize = 7
        const aspectRatio =
            container.parentNode.offsetWidth / container.parentNode.offsetHeight

        // prettier-ignore
        this.camera = new OrthographicCamera(
        -(frustumSize / 2) * aspectRatio, // left
         (frustumSize / 2) * aspectRatio, // right
         (frustumSize / 2),               // top
        -(frustumSize / 2),               // bottom
         1,                               // near
         1000,                            // far
    )
        this.camera.position.set(
            frustumSize / 2,
            frustumSize / 2,
            frustumSize / 2,
        )
        this.camera.lookAt(this.scene.position)

        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: container,
        })
        this.renderer.setPixelRatio(2)

        this.drawGrid()

        // Center shapes
        this.C1 = singleLineMesh({ position: new Vector3(0, 1, 0) })
        this.C2 = fourLineMesh({
            position: new Vector3(0, 1, 0),
            rotationOrder: "YZX",
        })

        // Left shapes
        this.L1 = fourLineMesh({
            position: new Vector3(-1, 0, 0),
            pivot: new Vector3(-1, 0, 0),
        })

        this.L2 = threeLineMesh({
            position: new Vector3(-2, 0, 0),
            rotation: new Euler(Math.PI / 2, Math.PI / 2, 0),
            pivot: new Vector3(0, 0, 1),
            rotationOrder: "YZX",
        })

        this.L3 = threeLineMesh({
            position: new Vector3(0, 0, 2),
            rotation: new Euler(0, Math.PI, 0),
            pivot: new Vector3(0, 0, -1),
            rotationOrder: "YZX",
        })

        this.L4 = threeLineMesh({
            position: new Vector3(0, 0, -2),
            rotation: new Euler(-Math.PI / 2, -Math.PI, 0),
            pivot: new Vector3(0, 0, -1),
            rotationOrder: "YZX",
        })

        // Right shapes
        this.R1 = fourLineMesh({
            position: new Vector3(0, 0, -1),
            pivot: new Vector3(0, 0, 1),
            rotation: new Euler(-Math.PI, 0, 0),
        })

        this.R2 = threeLineMesh({
            position: new Vector3(0, 0, 2),
            pivot: new Vector3(0, 0, 1),
            rotation: new Euler(Math.PI / 2, Math.PI, 0),
        })

        this.R3 = threeLineMesh({
            position: new Vector3(0, 0, 2),
            pivot: new Vector3(0, 0, -1),
            rotation: new Euler(0, Math.PI, 0),
        })

        this.scene.add(this.C1)
        this.scene.add(this.C2)
        this.C2.add(this.L1)
        this.L1.add(this.L2)
        this.L2.add(this.L3)
        this.L3.add(this.L4)
        this.C2.add(this.R1)
        this.R1.add(this.R2)
        this.R2.add(this.R3)

        this.timeline = new TimelineLite({
            paused: true,
            onUpdate: (): void => this.renderer.render(this.scene, this.camera),
        })

        this.timeline
            .to(this.L4.rotation, 0.25, { x: 0 })
            .to(this.R3.rotation, 0.25, { x: Math.PI }, "-=0.25")
            .to(this.L3.rotation, 0.25, { x: Math.PI })
            .to(this.R2.rotation, 0.25, { x: 0 }, "-=0.25")
            .to(this.L2.rotation, 0.25, { x: 0 })
            .to(this.R1.rotation, 0.25, { x: 0 }, "-=0.25")
            .to(this.L1.rotation, 0.25, { z: -Math.PI })
            // Scale to 0.01 to prevent three.js matrix determinant warning
            .to(this.C1.scale, 0.2, { x: 0.01, z: 0.01 })
            .set(this.C1, { visible: false })
            // A position of -0.19 is used as -0.2 made the object disappear
            // sporadically while being played in reverse
            .to(
                this.C2.rotation,
                0.25,
                {
                    x: -Math.PI / 5,
                    y: Math.PI / 4,
                },
                "-=0.19",
            )
            .set(this.C2, { visible: false })

        this.handleResize()
        window.addEventListener("resize", this.handleResize)
    }

    handleResize = (): void => {
        const container = this.renderer.domElement.parentElement as HTMLElement

        this.renderer.setSize(container.offsetWidth, container.offsetHeight)
        this.renderer.render(this.scene, this.camera)
    }

    drawGrid(): void {
        const geo = new PlaneBufferGeometry(8, 8, 4, 4)
        const mat = new MeshBasicMaterial({ color: 0x252525, wireframe: true })

        const mesh = new Mesh(geo, mat)
        mesh.rotation.x = Math.PI / 2
        mesh.position.set(-4, -4, -4)

        this.scene.add(mesh)
        this.renderer.render(this.scene, this.camera)
    }

    animate = (isVisible = false): void => {
        if (isVisible) {
            this.timeline.reverse()
            return
        }

        this.timeline.play()
    }
}

export default Logo
