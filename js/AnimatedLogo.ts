import gsap from "gsap";
import { Renderer, Camera, Transform, Polyline, Euler, Vec3, Color } from "ogl";

// Generate a line, i.e:
// +-----------+
function lineFactory(gl: any, lineColor?: string) {
  return polylineFactory(
    gl,
    // prettier-ignore
    [
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0, 1),
    ],
    lineColor
  );
}

// Generate a square, i.e:
//    +-----------+
//   /            /
//  /            /
// +------------+
function squareFactory(gl: any, lineColor?: string) {
  return polylineFactory(
    gl,
    // prettier-ignore
    [
      new Vec3(-1, 0, 1),
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0,-1),
      new Vec3( 1, 0, 1),
      new Vec3(-1, 0, 1),
    ],
    lineColor
  );
}

// Generate an open "square" with three sides, i.e:
//    +           +
//   /            /
//  /            /
// +------------+
function squareOpenFactory(gl: any, lineColor?: string) {
  return polylineFactory(
    gl,
    // prettier-ignore
    [
      new Vec3(-1, 0, 1),
      new Vec3(-1, 0,-1),
      new Vec3( 1, 0,-1),
      new Vec3( 1, 0, 1),
    ],
    lineColor
  );
}

function polylineFactory(gl: any, points: any[], color = "#ffffff") {
  return function ({
    position = new Vec3(),
    rotation = new Euler(0, 0, 0, "XYZ"),
    lineColor = color,
    lineWidth = 2.5,
    pivot = new Vec3(),
  } = {}) {
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

class AnimatedLogo {
  // Use "any", as there are no types (yet) for OGL
  // See: https://github.com/oframe/ogl/issues/24
  #scene: any;
  #camera: any;
  #gl: any;
  #renderer: any;

  #grid: any;
  #monogram: any;

  #C1: any;
  #C2: any;

  #L1: any;
  #L2: any;
  #L3: any;
  #L4: any;

  #R1: any;
  #R2: any;
  #R3: any;

  timeline: gsap.core.Timeline;

  constructor(container: HTMLElement) {
    if (!(container?.parentNode instanceof HTMLElement)) {
      throw new Error(
        "Argument for 'container' should be an instance of HTMLElement"
      );
    }

    this.#renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: 2,
      premultipliedAlpha: true,
    });

    this.#gl = this.#renderer.gl;

    this.#scene = new Transform();

    // Seperate elements to easily update the `uColor` uniform while traversing.
    this.#monogram = new Transform();
    this.#grid = new Transform();

    // Replace <svg> with gl canvas
    container.firstElementChild?.replaceWith(this.#gl.canvas);

    // Create an isometric camera
    const frustumSize = 7;
    const aspectRatio =
      container.parentNode.offsetWidth / container.parentNode.offsetHeight;

    // prettier-ignore
    this.#camera = new Camera(this.#gl, {
      near: 0.01,
      far: 100,
      left:   -(frustumSize / 2) * aspectRatio,
      right:   (frustumSize / 2) * aspectRatio,
      bottom: -(frustumSize / 2),
      top:      frustumSize / 2,
    });

    this.#camera.position.set(
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / 2
    );

    // Point camera at scene origin
    this.#camera.lookAt(this.#scene.position);

    // Handle updates of renderer using gsap's onUpdate
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: (): void =>
        this.#renderer.render({
          scene: this.#scene,
          camera: this.#camera,
        }),
    });

    // Grid and monogram colors as decimal `r`, `g`, `b` values
    const styles = getComputedStyle(document.documentElement);

    const gridHsl = styles.getPropertyValue("--logo-grid");
    const monogramHsl = styles.getPropertyValue("--logo-monogram");

    const gridColor = new Color(hslToRgb(gridHsl));
    const monogramColor = new Color(hslToRgb(monogramHsl));

    this.drawGrid(gridColor);
    this.drawMonogram(monogramColor);

    // Instantiate the gsap timeline that drives the animation
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: (): void =>
        this.#renderer.render({ scene: this.#scene, camera: this.#camera }),
    });

    this.timeline
      .to(this.#L4.mesh.rotation, { duration: 0.25, x: 0 })
      .to(this.#R3.mesh.rotation, { duration: 0.25, x: Math.PI }, "-=0.25")
      .to(this.#L3.mesh.rotation, { duration: 0.25, x: Math.PI })
      .to(this.#R2.mesh.rotation, { duration: 0.25, x: 0 }, "-=0.25")
      .to(this.#L2.mesh.rotation, { duration: 0.25, x: 0 })
      .to(this.#R1.mesh.rotation, { duration: 0.25, x: 0 }, "-=0.25")
      .to(this.#L1.mesh.rotation, { duration: 0.25, z: -Math.PI })
      .to(this.#C1.mesh.scale, { duration: 0.2, x: 0.0, z: 0.0 })
      .set(this.#C1.mesh, { visible: false })
      .to(
        this.#C2.mesh.rotation,
        {
          duration: 0.25,
          x: -Math.PI / 5,
          y: Math.PI / 4,
        },
        "-=0.2"
      )
      .set(this.#C2.mesh, { visible: false });

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("themechange", this.handleThemeChange);
  }

  drawMonogram(color: any) {
    // "C1" and "C2" make up the center stem of the "M"
    this.#C1 = lineFactory(this.#gl)({
      position: new Vec3(0, 1, 0),
      lineColor: color,
    });
    this.#C2 = squareFactory(this.#gl)({
      position: new Vec3(0, 1, 0),
      rotation: new Euler(0, 0, 0, "YZX"),
      lineColor: color,
    });

    // In order, "L1", "L2", "L3" and "L4" are connected to the left of "C1"
    this.#L1 = squareFactory(this.#gl)({
      position: new Vec3(-1, 0, 0),
      pivot: new Vec3(-1, 0, 0),
      lineColor: color,
    });

    this.#L2 = squareOpenFactory(this.#gl)({
      position: new Vec3(-2, 0, 0),
      rotation: new Euler(Math.PI / 2, Math.PI / 2, 0, "YZX"),
      pivot: new Vec3(0, 0, 1),
      lineColor: color,
    });

    this.#L3 = squareOpenFactory(this.#gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(0, Math.PI, 0, "YZX"),
      pivot: new Vec3(0, 0, -1),
      lineColor: color,
    });

    this.#L4 = squareOpenFactory(this.#gl)({
      position: new Vec3(0, 0, -2),
      rotation: new Euler(-Math.PI / 2, -Math.PI, 0, "YZX"),
      pivot: new Vec3(0, 0, -1),
      lineColor: color,
    });

    // In order, "R1", "R2", "R3" and "R4" are connected to the right of "C2"
    this.#R1 = squareFactory(this.#gl)({
      position: new Vec3(0, 0, -1),
      rotation: new Euler(-Math.PI, 0, 0, "XYZ"),
      pivot: new Vec3(0, 0, 1),
      lineColor: color,
    });

    this.#R2 = squareOpenFactory(this.#gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(Math.PI / 2, Math.PI, 0, "XYZ"),
      pivot: new Vec3(0, 0, 1),
      lineColor: color,
    });

    this.#R3 = squareOpenFactory(this.#gl)({
      position: new Vec3(0, 0, 2),
      rotation: new Euler(0, Math.PI, 0, "XYZ"),
      pivot: new Vec3(0, 0, -1),
      lineColor: color,
    });

    this.#monogram.addChild(this.#C1.mesh);
    this.#C2.mesh.addChild(this.#L1.mesh);
    this.#L1.mesh.addChild(this.#L2.mesh);
    this.#L2.mesh.addChild(this.#L3.mesh);
    this.#L3.mesh.addChild(this.#L4.mesh);

    this.#monogram.addChild(this.#C2.mesh);
    this.#C2.mesh.addChild(this.#R1.mesh);
    this.#R1.mesh.addChild(this.#R2.mesh);
    this.#R2.mesh.addChild(this.#R3.mesh);

    this.#scene.addChild(this.#monogram);
  }

  // Draw grid using `Polyline`, as creating a wireframe using `gl.LINE_STRIP`,
  // `gl.LINE_LOOP` and others does not allow for a variable width.
  drawGrid(color: any) {
    // Draw outer edge
    // prettier-ignore
    const edge = polylineFactory(this.#gl, [
      new Vec3(-4, 0, 4),
      new Vec3(-4, 0,-4),
      new Vec3( 4, 0,-4),
      new Vec3( 4, 0, 4),
      new Vec3(-4, 0, 4),
    ])({ lineColor: color });
    edge.mesh.position.set(-4, -4, -4);
    this.#grid.addChild(edge.mesh);

    // Draw gridlines
    for (const v of [2, 0, -2]) {
      let line: any;

      // Horizontal lines, top-left to bottom-right
      // prettier-ignore
      line = polylineFactory(this.#gl, [
        new Vec3(-4, 0, v),
        new Vec3( 4, 0, v),
      ])({ lineColor: color });
      line.mesh.position.set(-4, -4, -4);
      this.#grid.addChild(line.mesh);

      // Vertical lines, top-right to bottom-left
      // prettier-ignore
      line = polylineFactory(this.#gl, [
        new Vec3( v, 0,-4),
        new Vec3( v, 0, 4),
      ])({ lineColor: color });
      line.mesh.position.set(-4, -4, -4);
      this.#grid.addChild(line.mesh);

      // Left diagonals to create triangles
      // prettier-ignore
      line = polylineFactory(this.#gl, [
        new Vec3(-4, 0, v),
        new Vec3(-v, 0, 4),
      ])({ lineColor: color });
      line.mesh.position.set(-4, -4, -4);
      this.#grid.addChild(line.mesh);

      // Right diagonals to create triangles
      // prettier-ignore
      line = polylineFactory(this.#gl, [
        new Vec3( v, 0,-4),
        new Vec3( 4, 0,-v),
      ])({ lineColor: color });
      line.mesh.position.set(-4, -4, -4);
      this.#grid.addChild(line.mesh);
    }

    // Center diagonal line
    // prettier-ignore
    let line = polylineFactory(this.#gl, [
      new Vec3(-4, 0,-4),
      new Vec3( 4, 0, 4),
    ])({ lineColor: color });
    this.#grid.addChild(line.mesh);

    this.#scene.addChild(this.#grid);
  }

  handleResize = (): void => {
    const container = this.#gl.canvas.parentElement as HTMLElement;
    this.#renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.#renderer.render({ scene: this.#scene, camera: this.#camera });
  };

  // For both `AnimatedLogo.animateIn` and `AnimatedLogo.animateOut` we
  // prevent gsap's timeline.onUpdate from calling requestAnimationFrame
  // while idle by calling `timeline.pause()` on animation completion.
  animateIn = (): void => {
    this.timeline.play().then(() => this.timeline.pause());
  };

  animateOut = (): void => {
    this.timeline.reverse().then(() => this.timeline.pause());
  };

  handleThemeChange = (): void => {
    const styles = getComputedStyle(document.documentElement);

    const gridColor = styles.getPropertyValue("--logo-grid");
    const monogramColor = styles.getPropertyValue("--logo-monogram");

    this.#grid.traverse((child: any) => {
      child?.program?.uniforms?.uColor?.value?.set(hslToRgb(gridColor));
    });

    this.#monogram.traverse((child: any) => {
      child?.program?.uniforms?.uColor?.value?.set(hslToRgb(monogramColor));
    });

    // Trigger render to update colors
    this.#renderer.render({ scene: this.#scene, camera: this.#camera });
  };
}

/**
 * Converts a hue, saturation and luminance string to red, green and blue valus.
 * @param {string} hsl - A hsl string in the form of "hsl(hue, sat%, lum%)" and returns it as
 * @returns {array} An array of rgb decimal values
 */
function hslToRgb(hsl: string): [number, number, number] {
  const [_, sat, lum] = hsl
    .substring(4, hsl.length - 1)
    .split(",")
    .map(parseFloat);

  let r = 0;
  let g = 0;
  let b = 0;

  // Achromatic
  if (sat === 0) {
    r = lum;
    g = lum;
    b = lum;
  } else {
    throw new Error("not implemented");
  }

  return [r / 100, g / 100, b / 100];
}

export default AnimatedLogo;
