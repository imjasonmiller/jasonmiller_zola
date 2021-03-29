import { Renderer, Camera, Transform, Polyline, Euler, Vec3, Color } from "ogl";

import { TimelineLite } from "gsap";

class Logo {
  // Use "any", as there are no types for OGL
  scene: any;
  camera: any;
  gl: any;
  renderer: any;
  reduceMotion = false;

  C1: any;
  C2: any;

  L1: any;
  L2: any;
  L3: any;
  L4: any;

  R1: any;
  R2: any;
  R3: any;

  timeline: TimelineLite;

  private static generatePolyline(gl: any, points: any[]) {
    return ({
      position = new Vec3(),
      rotation = new Euler(0, 0, 0, "XYZ"),
      lineColor = "#ffffff",
      lineWidth = 3,
      pivot = new Vec3(),
    } = {}) => {
      // Apply pivot to points
      for (const point of points) {
        point.add(pivot);
      }

      const line = new Polyline(gl, {
        points,
        uniforms: {
          uColor: { value: new Color(lineColor) },
          uThickness: { value: lineWidth },
        },
      });

      line.mesh.rotation.copy(rotation);
      line.mesh.rotation.reorder(rotation.order);
      line.mesh.position = position;

      return line;
    };
  }

  // Generate a line, i.e:
  // +-----------+
  static drawLine(gl: any) {
    // prettier-ignore
    return Logo.generatePolyline(gl, [
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0, 1),
    ]);
  }

  // Generate a square, i.e:
  //    +-----------+
  //   /            /
  //  /            /
  // +------------+
  static drawSquare(gl: any) {
    // prettier-ignore
    return Logo.generatePolyline(gl, [
      new Vec3(-1, 0, 1),
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0,-1),
      new Vec3( 1, 0, 1),
      new Vec3(-1, 0, 1),
    ]);
  }

  // Generate an open "square" with three sides, i.e:
  //    +           +
  //   /            /
  //  /            /
  // +------------+
  static drawSquareOpen(gl: any) {
    // prettier-ignore
    return Logo.generatePolyline(gl, [
      new Vec3(-1, 0, 1),
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0,-1),
      new Vec3( 1, 0, 1),
    ]);
  }

  constructor(container: HTMLCanvasElement) {
    if (!(container?.parentNode instanceof HTMLElement)) {
      throw new Error("canvas should be wrapped in node");
    }

    this.renderer = new Renderer({
      alpha: true,
      canvas: container,
      antialias: true,
      dpr: 2,
    });
    this.gl = this.renderer.gl;

    this.scene = new Transform();

    // Create an isometric camera
    const frustumSize = 7;
    const aspectRatio =
      container.parentNode.offsetWidth / container.parentNode.offsetHeight;

    this.camera = new Camera(this.gl, {
      near: 0.01,
      far: 1_000,
      left: -(frustumSize / 2) * aspectRatio,
      right: (frustumSize / 2) * aspectRatio,
      bottom: -(frustumSize / 2),
      top: frustumSize / 2,
    });

    this.camera.position.set(frustumSize / 2, frustumSize / 2, frustumSize / 2);

    // Point camera at scene origin
    this.camera.lookAt(this.scene.position);

    // Handle updates of renderer using TweenLite's onUpdate
    this.timeline = new TimelineLite({
      paused: true,
      onUpdate: (): void =>
        this.renderer.render({
          scene: this.scene,
          camera: this.camera,
        }),
    });

    this.drawGrid();

    // "C1" and "C2" make up the center stem of the "M"
    this.C1 = Logo.drawLine(this.gl)({ position: new Vec3(0, 1, 0) });
    this.C2 = Logo.drawSquare(this.gl)({
      position: new Vec3(0, 1, 0),
      rotation: new Euler(0, 0, 0, "YZX"),
    });

    // In order, "L1", "L2", "L3" and "L4" are connected to the left of "C1"
    this.L1 = Logo.drawSquare(this.gl)({
      position: new Vec3(-1, 0, 0),
      pivot: new Vec3(-1, 0, 0),
    });

    this.L2 = Logo.drawSquareOpen(this.gl)({
      position: new Vec3(-2, 0, 0),
      rotation: new Euler(Math.PI / 2, Math.PI / 2, 0, "YZX"),
      pivot: new Vec3(0, 0, 1),
    });

    this.L3 = Logo.drawSquareOpen(this.gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(0, Math.PI, 0, "YZX"),
      pivot: new Vec3(0, 0, -1),
    });

    this.L4 = Logo.drawSquareOpen(this.gl)({
      position: new Vec3(0, 0, -2),
      rotation: new Euler(-Math.PI / 2, -Math.PI, 0, "YZX"),
      pivot: new Vec3(0, 0, -1),
    });

    // In order, "R1", "R2", "R3" and "R4" are connected to the right of "C2"
    this.R1 = Logo.drawSquare(this.gl)({
      position: new Vec3(0, 0, -1),
      rotation: new Euler(-Math.PI, 0, 0, "XYZ"),
      pivot: new Vec3(0, 0, 1),
    });

    this.R2 = Logo.drawSquareOpen(this.gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(Math.PI / 2, Math.PI, 0, "XYZ"),
      pivot: new Vec3(0, 0, 1),
    });

    this.R3 = Logo.drawSquareOpen(this.gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(0, Math.PI, 0, "XYZ"),
      pivot: new Vec3(0, 0, -1),
    });

    this.scene.addChild(this.C1.mesh);
    this.C2.mesh.addChild(this.L1.mesh);
    this.L1.mesh.addChild(this.L2.mesh);
    this.L2.mesh.addChild(this.L3.mesh);
    this.L3.mesh.addChild(this.L4.mesh);
    this.scene.addChild(this.C2.mesh);
    this.C2.mesh.addChild(this.R1.mesh);
    this.R1.mesh.addChild(this.R2.mesh);
    this.R2.mesh.addChild(this.R3.mesh);

    this.timeline = new TimelineLite({
      paused: true,
      onUpdate: (): void =>
        this.renderer.render({ scene: this.scene, camera: this.camera }),
    });

    this.timeline
      .to(this.L4.mesh.rotation, 0.25, { x: 0 })
      .to(this.R3.mesh.rotation, 0.25, { x: Math.PI }, "-=0.25")
      .to(this.L3.mesh.rotation, 0.25, { x: Math.PI })
      .to(this.R2.mesh.rotation, 0.25, { x: 0 }, "-=0.25")
      .to(this.L2.mesh.rotation, 0.25, { x: 0 })
      .to(this.R1.mesh.rotation, 0.25, { x: 0 }, "-=0.25")
      .to(this.L1.mesh.rotation, 0.25, { z: -Math.PI })
      .to(this.C1.mesh.scale, 0.2, { x: 0.0, z: 0.0 })
      .set(this.C1.mesh, { visible: false })
      .to(
        this.C2.mesh.rotation,
        0.25,
        {
          x: -Math.PI / 5,
          y: Math.PI / 4,
        },
        "-=0.2",
      )
      .set(this.C2.mesh, { visible: false });

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  // Draw grid using Polyline, as creating a wireframe using gl.LINE_STRIP,
  // gl.LINE_LOOP and others does not allow for a variable width.
  drawGrid() {
    // Draw outer edge
    // prettier-ignore
    const edge = Logo.generatePolyline(this.gl, [
      new Vec3(-4, 0, 4),
      new Vec3(-4, 0,-4),
      new Vec3( 4, 0,-4),
      new Vec3( 4, 0, 4),
      new Vec3(-4, 0, 4),
    ])({ lineColor: "#252525" });
    edge.mesh.position.set(-4, -4, -4);
    this.scene.addChild(edge.mesh);

    // Draw gridlines
    for (const v of [2, 0, -2]) {
      let line;

      // Horizontal lines, top-left to bottom-right
      // prettier-ignore
      line = Logo.generatePolyline(this.gl, [
        new Vec3(-4, 0, v),
        new Vec3( 4, 0, v),
      ])({ lineColor: "#252525" });
      line.mesh.position.set(-4, -4, -4);
      this.scene.addChild(line.mesh);

      // Vertical lines, top-right to bottom-left
      // prettier-ignore
      line = Logo.generatePolyline(this.gl, [
        new Vec3( v, 0,-4),
        new Vec3( v, 0, 4),
      ])({ lineColor: "#252525" });
      line.mesh.position.set(-4, -4, -4);
      this.scene.addChild(line.mesh);

      // Left diagonals to create triangles
      // prettier-ignore
      line = Logo.generatePolyline(this.gl, [
        new Vec3(-4, 0, v),
        new Vec3(-v, 0, 4),
      ])({ lineColor: "#252525" });
      line.mesh.position.set(-4, -4, -4);
      this.scene.addChild(line.mesh);

      // Right diagonals to create triangles
      // prettier-ignore
      line = Logo.generatePolyline(this.gl, [
        new Vec3( v, 0,-4),
        new Vec3( 4, 0,-v),
      ])({ lineColor: "#252525" });
      line.mesh.position.set(-4, -4, -4);
      this.scene.addChild(line.mesh);
    }

    // Center diagonal line
    // prettier-ignore
    let line = Logo.generatePolyline(this.gl, [
      new Vec3(-4, 0,-4),
      new Vec3( 4, 0, 4),
    ])({ lineColor: "#252525" });
    this.scene.addChild(line.mesh);
  }

  handleResize = (): void => {
    const container = this.gl.canvas.parentElement as HTMLElement;
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.renderer.render({ scene: this.scene, camera: this.camera });
  };

  animate = (isVisible = false): void => {
    if (isVisible) {
      this.timeline.reverse();
      return;
    }

    this.timeline.play();
  };
}

export default Logo;
