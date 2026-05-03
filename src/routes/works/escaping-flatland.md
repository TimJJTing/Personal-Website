---
layout: _
title: Escaping Flatland
description: Optimization techniques for plotting large datasets in a 3D space
  using Three.js + Svelte integration
year: 2024
categories:
  - big-data
  - octree
  - svelte
  - sveltekit
  - data visualization
  - lod
  - three.js
  - glsl-shaders
published: true
thumbnail: /uploads/escaping-flatland-demo-0.png
banner: /uploads/escaping-flatland-demo-3.png
images:
  - image: /uploads/escaping-flatland-demo-1.png
    caption: Fig. 1 - Do Not Go Gentle into That Good Night
  - image: /uploads/escaping-flatland-demo-2.png
    caption: Fig. 2 - Here's our sun
  - image: /uploads/escaping-flatland-demo-3.png
    caption: Fig. 3 - Look closely
additionalLinks:
  - url: https://escaping-flatland.netlify.app/
    title: Demo
  - url: https://github.com/TimJJTing/Escaping-Flatland
    title: Source
  - title: Slides
    url: https://timjjting.github.io/Escaping-Flatland-Slides/
---

## Abstract

This article is about "Escaping Flatland," a project that attempts to visualize n-dimensional datasets in 3D space for an immersive, sensory experience. Along the way, it tackles a set of genuinely hard engineering problems: how do you render a million data points smoothly in the browser? How do you add per-object visual effects without blowing the frame budget? And how do you wire all of this into a modern web framework cleanly?

The implementation is built on Three.js and Octree, integrated into a SvelteKit application. This article walks through the motivation behind the project, the architectural decisions made along the way, and the specific techniques used to make it work at scale. It also reflects on how Three.js fits into a SvelteKit project, though [Threlte](https://threlte.xyz/) offers a more mature solution for this purpose.

## Motivation

> *Even though we navigate daily through a perceptual world of three dimensions… the world displayed on our information displays is caught up in the two dimensionality of the endless flatlands of paper and video screens… Escaping this flatland is the essential task of envisioning information — for all the interesting worlds that we seek to understand are inevitably and happily multivariate in nature. Not flatlands. (Tufte 1990)*

Tufte wrote this over thirty years ago, and it still describes the default mode of data visualization today: charts on flat screens, points on flat axes. The flatland metaphor is apt because it is not just about aesthetics. It is about the number of variables you can encode in a single view, and therefore the complexity of the story you can tell.

In the real world, data rarely has just two or three dimensions. A dataset of physical measurements might include spatial coordinates, time, temperature, pressure, and a dozen other variables. On a flat plot, each additional variable requires a new axis, a new color scale, or a new panel, and at some point the representation falls apart under its own weight.

A 3D space, rendered on screen, gives us one more spatial dimension to work with directly. But the more interesting gain is what comes with it: depth cues, perspective, rotation, and the ability to position the viewer inside the data itself. When you can zoom in until individual data points surround you like objects in a room, the relationship between variables becomes something you can sense and navigate rather than just read.

Add interactivity, and the possibilities expand further. Zooming lets you inspect the macro structure of an entire dataset and then dive into a single cluster without switching views. The information density you can achieve is genuinely different from anything a static chart can offer.

That potential is what "Escaping Flatland" is trying to realize.

## Goal

The goal is to provide an immersive data exploration experience that is qualitatively unlike conventional data visualization, where the viewer can feel embedded in the data rather than looking at it from a fixed distance.

To be concrete about what that requires, the spec:

- **Render 1M data points smoothly**: A million points is the threshold where the browser's default rendering approaches start to break down. Reaching it without sacrificing frame rate requires deliberate engineering.
- **Support zooming in and out for micro and macro views**: The experience should feel continuous. Zooming out should reveal the full shape of the dataset; zooming in should reveal individual points with enough detail to distinguish them.
- **Allow hopping from one point to another when zoomed in**: At close range, a user should be able to move their focus from one data point to a neighboring one, treating each point as a place to stand rather than just a mark on a chart.

## The Stack

For achieveing the goal, I built the project with [Three.js](https://threejs.org/), the most mature and widely adopted JavaScript 3D library for the browser. It sits at the right level of abstraction: low-level enough to expose the rendering pipeline directly when you need it, high-level enough that you are not writing raw WebGL for every object. For the application framework, [SvelteKit](https://kit.svelte.dev/) handles routing and component lifecycle, keeping the web layer clean while Three.js owns the rendering canvas.

### Fundamental Blocks

Before getting into what broke and how I fixed it, here is a quick map of the fundamental building blocks in any Three.js scene. Understanding these is useful context for the problems discussed later, since most of the performance challenges come down to how these pieces interact.

- **Scene**: the container that holds everything
- **Objects**: meshes, points, lines; the things you actually see
- **Camera**: the virtual viewpoint; where the user is standing and what direction they are looking
- **Lights**: light sources that illuminate the scene; not all rendering modes need them, but they matter for realism
- **Renderer**: the engine that takes all of the above and draws pixels to the screen each frame

The program lifecycle is straightforward: `init()` creates the scene, `animate()` runs in a loop calling `update()` then `render()`, and `destroy()` cleans up GPU memory when the component is torn down. Almost all of the interesting work happens inside `update()` and inside the shaders that run on the GPU.

```ts
// pseudo-code for the concept
let scene, camera, obj, light, renderer;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  obj = new THREE.Points();
  light = new THREE.HemisphereLight();
  renderer = new THREE.WebGLRenderer();
}

function render() {
  renderer.render(scene, camera);
}

function update() {
  obj.update();
  // update objects...
}

function animate() {
  requestAnimationFrame(animate); // loop
  update();
  render();
}

function destroy() {
  obj.dispose();
  // cleanup
}

init();
animate();
destroy();
```

### Interactivity via Raycasting

In a standard web page, click and hover events come for free. In a 3D scene, the situation is more complex. A mouse position is just a 2D coordinate on screen, which by itself says nothing about which 3D object the cursor is over. The same screen position could map to dozens of objects at different depths in the scene.

The solution is raycasting: cast a virtual ray from the camera through the cursor's screen position and collect all the scene objects it intersects, ordered by distance. The closest intersection is what the user is pointing at. Three.js provides a built-in [Raycaster](https://threejs.org/docs/#api/en/core/Raycaster) for this:

```ts
// pseudo-code for the concept
import * as THREE from 'three'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseMove(event: MouseEvent) {
  // Normalize mouse position to -1..1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // intersected is sorted by distance; [0] is the closest hit
    const first = intersects[0];
    console.log('You are hovering over', first.object.name);
  }
}
```

This gives you hover and click detection on any object in the scene, regardless of how deep it is, using the same intuition as pointing at a physical object.

### Dynamic Visual Effects with GPU Shaders

To encode additional dimensions of the dataset visually, we can apply dynamic effects to each data point. For instance, rotation speed might represent a variable's magnitude, while color encodes its category. The goal is to make multiple variables readable at a glance, without adding more axes.

The challenge is doing this for a million points at 60 frames per second. A standard CPU-driven loop iterates over each point sequentially, updates it, and uploads the result to the GPU once per frame. At this scale, the loop itself becomes the bottleneck. The CPU is well suited for serial execution of complex logic, but it processes one operation at a time, and a million sequential updates is simply too much to finish within a 16-millisecond frame budget.

The GPU is built on a different principle. It executes thousands of simple operations simultaneously, in parallel. If you can express your per-point logic as a short, stateless program, the GPU can apply it to every point in the scene at once. This is what shaders are for.

WebGL exposes two stages of the rendering pipeline that you can write custom code for:

- **Vertex shaders**: run once per vertex, control geometry and position
- **Fragment shaders**: run once per pixel, control color and appearance

These are written in GLSL, a C-like language that executes entirely on the GPU. A uniform like `u_time` that increments each frame lets you build animations that run at full GPU speed with no CPU involvement:

```glsl
// pseudo-code for the concept
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(st.x, st.y, abs(sin(u_time)), 1.0);
}
```

Sites like [Shadertoy](https://www.shadertoy.com/) are a good reference for what becomes possible when you fully embrace this model.

In my case, I implemented the [differential rotation](https://en.wikipedia.org/wiki/Differential_rotation) shader to create a Jupiter-like effect for each data point, where different latitudinal bands of the sphere rotate at different speeds, producing a swirling, organic visual.

```glsl
// pseudo-code for the concept
// uniforms from js
uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uDiffRotationCA;
uniform float uDiffRotationCB;
uniform float uDiffRotationCC;

// varyings from vertex shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

// Differential rotation
float diffRotationSpeed(vec3 point, float A, float B, float C) {
  vec3 equator = vec3(0.0, 1.0, 0.0);
  float cosFactor = dot(point, equator) / (length(point) * length(equator)); // use cosine to replace sine
  return radians(A) + radians(B) * (1.0 - pow(cosFactor, 2.0)) + radians(C) * pow((1.0 - pow(cosFactor, 2.0)), 2.0);
}

// sun-like
void main() {
  vec3 color = vec3(0.0);
  vec3 st = vPosition.xyz;

  float speed = uTime * uSpeed * diffRotationSpeed(st, uDiffRotationCA, uDiffRotationCB, uDiffRotationCC);

  // self-rotation
  st = rotate(st, vec3(0.,1.,0.), speed);

  // ... other effects

  gl_FragColor = vec4(customRGB, 1.0);
}
```

### Selective Bloom

The shader produces the right movement, but aesthetically something is still missing. In space photography and rendered 3D scenes, luminous objects bleed light into the space around them, producing a soft glow rather than a hard edge. A planet viewed through a telescope does not look like a crisp sphere; it radiates. Without that effect, even a well-crafted shader reads as flat and artificial. We need to add post-processing.

Three.js's post-processing system works by re-rendering the already-finished scene through a stack of effect passes, similar to applying filters to a photograph after it is taken. Bloom, the glowing effect around bright objects, is one of the most visually impactful. The problem is that post-processing passes are applied to the entire scene uniformly, with no built-in way to say "bloom this object but not that one." Applying bloom globally washes out everything and destroys the visual hierarchy.

The workaround is a two-pass render:

1. Render only the objects that should bloom, apply the `UnrealBloomPass`, write to a separate render target
2. Render only the objects that should not bloom, with no post-effect

The two render targets are then composited using a custom `ShaderPass` that blends them together:

```ts
// pseudo-code for the concept
// SETUP
const bloomLayer = new Layer(1)        // a flag to mark "should glow"
const darkMaterial = new SolidBlackMaterial()
const bloomPass = new UnrealBloomPass({ strength, radius, threshold })
const bloomComposer = new EffectComposer(renderer) // first composer
bloomComposer.renderToScreen = false   // outputs to texture, not screen
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

const mixPass = new ShaderPass({
  uniforms: {
    baseTexture:    { value: null },
    bloomTexture:   { value: bloomComposer.outputTexture },
    bloomIntensity: { value: 1.0 },
  },
  // fragment shader: output = base + bloom * intensity
})

const finalComposer = new EffectComposer(renderer)  // second composer
finalComposer.addPass(renderScene)
finalComposer.addPass(mixPass)

// TAGGING OBJECTS
add(object) {
  object.layers.enable(bloomLayer)   // mark it for bloom
}

remove(object) {
  object.layers.disable(bloomLayer)  // unmark it
}


// RENDER (called every frame)
render() {
  // Step 1: darken everything that should NOT glow
  const savedMaterials = {}
  scene.traverse((obj) => {
    if (!bloomLayer.test(obj.layers)) {
      savedMaterials[obj.id] = obj.material
      obj.material = darkMaterial    // or obj.visible = false
    }
  })

  // Step 2: render bloom-only pass into a texture
  bloomComposer.render()

  // Step 3: restore the scene
  scene.traverse((obj) => {
    if (savedMaterials[obj.id]) {
      obj.material = savedMaterials[obj.id]
    }
})

  // Step 4: final render — ShaderPass blends base + bloom texture
  finalComposer.render()
}
```

It requires maintaining two `EffectComposer` instances and manually managing which objects are visible in which pass. But the result is fine-grained, per-object bloom control: your glowing spheres glow, and nothing else does.

## Challenges & Optimization

While above techniques are conceptually simple, naively putting everything together and then rendering a large scale dataset (>1M samples) could be problematic: wasting memory, wasting computation power, low FPS, and hence a bad user experience.

Profiling revealed four distinct bottlenecks:

1. Too many objects in the scene graph
2. Too many draw calls to the GPU
3. Expensive frustum testing: figuring out which objects are inside the camera's view volume
4. Unnecessary geometry complexity: rendering detailed meshes for objects that are far away

Each required its own solution, and they compose together.

### 1. Reducing Objects: `Points`

The first move was replacing individual meshes with a single [`Points`](https://threejs.org/docs/#api/en/objects/Points) primitive. Rather than thousands of separate objects in the scene graph, `Points` renders all vertices as a single object with a single draw call. It's not sufficient on its own, though. When you zoom in close, flat sprites look wrong and you still need real 3D geometry. But for distant points, `Points` is sufficient as our eyes can't distinguish points anyway. It eliminates the per-object overhead for most of the points in the scene.

### 2. Reducing Draw Calls with Instancing

When the camera is close enough that the points need to render as 3D spheres, [`InstancedMesh`](https://threejs.org/docs/#api/en/objects/InstancedMesh) is the right tool. It lets you define a mesh once (geometry + material), then render any number of instances of it using a per-instance transformation matrix, all in a single draw call. Escaping Flatland maintains three separate InstancedMesh objects for HD, SD, and LD detail levels, each backed by an icosahedron at a different subdivision level:

```js
// High detail: IcosahedronGeometry(radius, 2)
// Standard detail: IcosahedronGeometry(radius, 1)
// Low detail: IcosahedronGeometry(radius, 0)
```

On every frame, only the matrices for currently visible points are written into the buffers; the rest aren't touched.


### 3. Reducing Frustum Testing: Octree

Even with InstancedMesh, deciding which points are visible on every frame was too slow. Testing each of 500,000 points against the camera frustum linearly is O(n) and it shows.

The solution is a spatial data structure: an Octree. 
An Octrees are hierarchical tree structures that recursively partition 3D space into eight octants. They're a natural fit for 3D point data, but they generalize cleanly to higher dimensions. The only difference is that in 2D you use quadtrees (four quadrants), and in 4D you'd use 16-trees, and so on — always 2^N partitions per level.

The structure is simple to implement:

```ts
// Recursive node structure
interface OctreeNode {
  bounds: BoundingBox;
  points: Point[];
  children?: OctreeNode[];
}

// Insert a point
function insert(node: OctreeNode, point: Point) {
  // If node is full and not a leaf, subdivide
  if (node.points.length > MAX_POINTS_PER_NODE && !node.children) {
    subdivide(node);
  }
  
  // If node is a leaf, add the point
  if (!node.children) {
    node.points.push(point);
    return;
  }
  
  // Otherwise, insert into the correct child
  const childIndex = getChildIndex(node, point);
  insert(node.children[childIndex], point);
}
```

So, instead of testing every point, you traverse the tree and prune entire subtrees that don't intersect the frustum. The visible points you need are at the leaves of the intersecting octants.

There's also a second trick worth noting: rather than using a single frustum that matches the camera exactly, I use a custom culling frustum with a shorter far plane. This limits how many points are ever considered visible at once, which keeps the HD/SD/LD mesh counts bounded regardless of how many total points exist in the scene.

```ts
// In FrustumCuller.cull():
const cullCamera = this.cullCamera.clone();
cullCamera.far = this.frustumFar; // shorter than actual camera.far
cullCamera.updateProjectionMatrix();
frustum.setFromProjectionMatrix(m.multiplyMatrices(
  cullCamera.projectionMatrix,
  cullCamera.matrixWorldInverse
));
const intersections = this.octree.cull(frustum);
```

### 4. Reducing Geometry Complexity: LOD

The distance from the camera determines which InstancedMesh a point gets assigned to. Points within 150 units get the HD mesh (and a label sprite); between 150–300 units get the SD mesh; beyond 300 get the LD mesh. This is the application of Level of Detail (LOD), which renders cheaper geometry for objects where the detail would be invisible anyway.

```ts
const octantContainsHDMesh = 
  x.distanceToSquared(camera.position) < maxHdDistanceSq; // 150^2
const octantContainsSDMesh = 
  x.distanceToSquared(camera.position) < maxSdDistanceSq; // 300^2
```

### Summary

The full optimization stack, stacked in layers:

| Problem | Solution |
| --- | --- |
| Too many scene objects | Points: all distant points as one object |
| Too many draw calls | InstancedMesh: one draw call per LOD tier |
| Expensive frustum testing | Octree: logarithmic spatial pruning |
| Unnecessary geometry | Three-tier LOD: detail budget scales with distance |

Together, these bring the frame rate above 20 FPS on an average machine with half a million points in the scene.

## What This Actually Looks Like

The demo renders a galaxy-like cloud of 500,000 random points, grouped by color into clusters. At the macro scale, you see the whole distribution at once. As you zoom in, the flat sprites resolve into proper 3D spheres with labels attached. The transition is smooth because the Octree culling and InstancedMesh swapping happen fast enough to stay within a frame budget.
It's deliberately mock data. The point was never the dataset; it was the rendering pipeline. The same architecture can be adapted to any large point cloud: geographic data, scientific simulations, network graphs in 3D space.

## Live Demo

Try [the live demo](https://escaping-flatland.netlify.app)!

## Closing Thoughts

The path from "I want a 3D chart" to "I have a 3D chart that runs at 20 FPS with half a million points" turns out to pass through shader programming, spatial data structures, and GPU memory management. None of that is especially exotic. Three.js, the sparse-octree library, and the WebGL post-processing pipeline are all well-documented. But it's a different class of problem than building a chart on top of D3.

Tufte was right that escaping flatland is the essential task. What's changed since 1990 is that the escape route is now a JavaScript file and a browser.
