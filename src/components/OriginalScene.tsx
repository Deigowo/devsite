"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RadioManager } from "@/lib/RadioManager";

function measureTextWidth(text: string) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = "400 128px Raleway, sans-serif";
  return ctx.measureText(text).width;
}

function makeMetallicSprite(
  text: string,
  height: number,
  dpr: number,
  color1: string,
  color2: string,
  highlight: string,
  speed: number,
  isNeon: boolean = false,
) {
  const fontSize = 128;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = `400 ${fontSize}px Raleway, sans-serif`;
  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const pad = isNeon ? fontSize * 0.7 : fontSize * 0.4;
  const cw = Math.ceil(tw + pad * 2);
  const ch = Math.ceil(isNeon ? fontSize * 1.8 : fontSize * 1.4);

  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, cw, ch);
  ctx.font = `400 ${fontSize}px Raleway, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = isNeon ? highlight : "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = isNeon ? fontSize * 0.35 : fontSize * 0.25;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, cw / 2, ch / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    sizeAttenuation: true,
  });

  material.onBeforeCompile = (shader) => {
    sprite.userData.shader = shader.uniforms.uTime = { value: 0 };

    shader.uniforms.uColor1 = { value: new THREE.Color(color1) };
    shader.uniforms.uColor2 = { value: new THREE.Color(color2) };
    shader.uniforms.uHighlight = { value: new THREE.Color(highlight) };
    shader.uniforms.uSpeed = { value: speed };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `
            #include <common>
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uHighlight;
            uniform float uSpeed;
            `,
      )
      .replace(
        "gl_FragColor = vec4( outgoingLight, diffusseColor.a );",
        `
                float grad = vUv.x;
                vec3 base = mix(uColor1, uColor2, grad);
                float shine = sin((vUv.x + vUv.y) * 6.0 + uTime * uSpeed) * 0.5 + 0.5;
                shine = pow(shine, 3.0);
                vec3 finalColor = mix(base, uHighlight, shine * 0.6);
                outgoingLight = finalColor;
                gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                `,
      );
  };

  const sprite = new THREE.Sprite(material);
  const aspect = cw / ch;
  const w = height * aspect;
  sprite.scale.set(w, height, 1);
  sprite.userData.visualLeftBias = 0.5 - pad / cw;
  return sprite;
}

function makeCanvasSprite(
  text: string,
  height: number,
  dpr: number,
  stops: Array<{ pos: number; color: string }>,
  isNeon: boolean = false,
) {
  const fontSize = 128;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = `400 ${fontSize}px Raleway, sans-serif`;
  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const pad = isNeon ? fontSize * 0.7 : fontSize * 0.4;
  const cw = Math.ceil(tw + pad * 2);
  const ch = Math.ceil(isNeon ? fontSize * 1.8 : fontSize * 1.4);

  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, cw, ch);
  ctx.font = `400 ${fontSize}px Raleway, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = isNeon
    ? stops[stops.length - 1].color
    : "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = isNeon ? fontSize * 0.35 : fontSize * 0.25;

  const grad = ctx.createLinearGradient(0, 0, cw * 0.8, 0);
  for (const stop of stops) {
    grad.addColorStop(stop.pos, stop.color);
  }
  ctx.fillStyle = grad;
  ctx.fillText(text, cw / 2, ch / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    sizeAttenuation: true,
  });

  const sprite = new THREE.Sprite(material);
  const aspect = cw / ch;
  const w = height * aspect;
  sprite.scale.set(w, height, 1);
  sprite.userData.visualLeftBias = 0.6 - pad / cw;
  return sprite;
}

function placeLeft(
  sprite: THREE.Sprite,
  anchorX: number,
  anchorY: number,
  z = 0,
) {
  const bias = sprite.userData.visualLeftBias as number;
  sprite.position.set(anchorX - sprite.scale.x * bias, anchorY, z);
}

function placeRight(
  sprite: THREE.Sprite,
  anchorX: number,
  anchorY: number,
  z = 0,
) {
  const bias = sprite.userData.visualLeftBias as number;
  sprite.position.set(anchorX - sprite.scale.x * bias, anchorY, z);
}

function clearSprites(sprites: THREE.Sprite[]) {
  for (const s of sprites) {
    if (s.parent) s.parent.remove(s);
    s.material.dispose();
    if (s.material.map) s.material.map.dispose();
  }
}

const platinum = { c1: "#999999", c2: "#e8e8e8", hl: "#ffffff", sp: 1.8 };
const brightGold = { c1: "#805500", c2: "#ffd700", hl: "#fff8d6", sp: 1.5 };
const silver = { c1: "#888899", c2: "#d0d0e0", hl: "#ffffff", sp: 1.6 };

const goldGradient = [
  { pos: 0, color: "#805500" },
  { pos: 0.3, color: "#cc9900" },
  { pos: 0.6, color: "#ffd700" },
  { pos: 1, color: "#fff8d6" },
];

let globalHasEntered = false;

export function OriginalScene({
  peeking = false,
  onEdgesReady,
  onLoaded,
}: {
  peeking?: boolean;
  onEdgesReady?: (edges: { leftEdgePx: number; rightEdgePx: number }) => void;
  onLoaded?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mode = useRef("desktop");
  const peekingRef = useRef(peeking);

  useEffect(() => {
    peekingRef.current = peeking;
  }, [peeking]);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      console.warn("OriginalScene: Container ref not available");
      return;
    }

    console.log(
      "OriginalScene: Mounting, container size:",
      container.offsetWidth,
      container.offsetHeight,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    let running = true;
    let timer: THREE.Timer | null = null;

    const mql = window.matchMedia("(max-width: 1023px)");
    mode.current = "desktop";
    console.log("OriginalScene: Mode set to", mode.current);

    const width = container.clientWidth
    const height = container.clientHeight
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    console.log("OriginalScene: Renderer created, appending to DOM");

    if(container.clientHeight === 0) {
      console.warn("Container height is 0, delaying init...")

      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"))
      })
    }
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03050a);

    // Interactive lighting
    const pointerLight = new THREE.PointLight(0xffaa00, 0, 40); // Golden tint
    scene.add(pointerLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1)); // Subtle ambient to balance

    const contentGroup = new THREE.Group();

    // Dramatic Entrance Initial State (only runs on first mount, persists across fast remounts)
    if (globalHasEntered) {
      contentGroup.scale.set(1.0, 1.0, 1.0);
      contentGroup.position.z = 0;
      contentGroup.rotation.y = 0;
    } else {
      contentGroup.scale.set(0.001, 0.001, 0.001);
      contentGroup.position.z = -50;
      contentGroup.rotation.y = Math.PI; // Will spin in
      globalHasEntered = true;
    }
    scene.add(contentGroup);

    // Interactivity State Variables
    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    let modelSpinSpeed = 0.5;
    let bloomTarget = mode.current ? 0.1 : 0.15;
    let currentBloom = bloomTarget;
    let scrollY = window.scrollY || 0;
    let isHovering = false;

    const raycaster = new THREE.Raycaster();

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );

    let bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomTarget,
      0.4,
      0.85,
    );

    function applyCameraMode() {
      camera.fov = 30;
      camera.position.set(0, 0.5, 12);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      currentBloom = bloomTarget;
    }

    applyCameraMode()

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    const siz = new Float32Array(starCount);
    const col = new Float32Array(starCount * 3);
    const pha = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      siz[i] = 0.3 + Math.random() * 1.2;
      const t = Math.random();
      if (t < 0.6) {
        col[i * 3] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 2] = 1.0;
      } else if (t < 0.8) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.85 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.1;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.6 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.4 + Math.random() * 0.15;
      }
      pha[i] = Math.random() * Math.PI * 2;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(siz, 1));
    starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute("phase", new THREE.BufferAttribute(pha, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size; attribute vec3 color; attribute float phase;
        varying vec3 vColor; varying float vPhase;
        void main() {
          vColor = color; vPhase = phase;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (250.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float time; varying vec3 vColor; varying float vPhase;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float a = 1.0 - smoothstep(0.0, 0.5, d);
          float tw = 0.5 + 0.5 * sin(time * (1.2 + vPhase * 3.0) + vPhase * 6.283);
          tw = 0.6 + 0.4 * tw;
          gl_FragColor = vec4(vColor * tw, a * tw);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const dpr = Math.min(window.devicePixelRatio, 2);
    let model: any = null;
    let allSprites: THREE.Sprite[] = [];
    let loaded = false;

    function computeEdges() {
      const deigo = allSprites.find(
        (s) =>
          (s.material as THREE.SpriteMaterial).map?.name === "" ||
          s.userData.shaderTime,
      );
      const owo = allSprites.find((s) => s !== deigo && s.userData.shaderTime);

      if (!deigo || !owo) return;

      const deigoLeft =
        deigo.position.x -
        deigo.scale.x * (deigo.userData.visualLeftBias as number);
      const owoRight =
        owo.position.x + owo.scale.x * (owo.userData.visualLeftBias as number);

      const leftVec = new THREE.Vector3(deigoLeft, 0, 0).project(camera);
      const rightVec = new THREE.Vector3(owoRight, 0, 0).project(camera);

      const leftPx = ((leftVec.x + 1) / 2) * window.innerWidth;
      const rightPx = ((rightVec.x + 1) / 2) * window.innerWidth;

      onEdgesReady?.({ leftEdgePx: leftPx, rightEdgePx: rightPx });
    }

    function fireLoaded() {
      if (loaded) return;
      loaded = true;
      setTimeout(() => onLoaded?.(), 300);
    }

    function renderDesktop(glb: any): THREE.Sprite[] {
      const model = glb.scene || glb;
      model.traverse((c: THREE.Object3D) => {
        const mesh = c as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xd4a000,
            metalness: 1.0,
            roughness: 0.2,
            envMap: scene.environment,
            envMapIntensity: 3.0,
            emissive: 0x553300,
            emissiveIntensity: 0.1,
          });
        }
      });
      model.scale.set(1.33, 1.33, 1.33);
      const shiftX = 0.45;
      model.position.set(shiftX, 0, 0);

      // Update matrices and compute bounding box while unparented
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);

      contentGroup.add(model);
      model.updateWorldMatrix(true, true);

      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      model.position.set(
        model.position.x - center.x,
        model.position.y - center.y,
        model.position.z - center.z,
      )

      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 4000 / maxDim
      model.scale.setScalar(scale)

      const hw = size.x / 2;
      const my = center.y;
      const textH = size.y * 0.55;

      // False passed for isNeon on Desktop
      const deigo = makeMetallicSprite(
        "DEIGO",
        textH,
        dpr,
        platinum.c1,
        platinum.c2,
        platinum.hl,
        platinum.sp,
        false,
      );
      const owo = makeMetallicSprite(
        "OWO",
        textH,
        dpr,
        brightGold.c1,
        brightGold.c2,
        brightGold.hl,
        brightGold.sp,
        false,
      );

      const deigoW = deigo.scale.x;
      const deigoH = deigo.scale.y;
      const owoW = owo.scale.x;
      deigo.position.set(shiftX - hw - deigoW / 2, my, 0);
      owo.position.set(shiftX + hw + owoW / 2, my, 0);
      contentGroup.add(deigo);
      contentGroup.add(owo);

      const sprites: THREE.Sprite[] = [deigo, owo];

      const deigoLeftEdge =
        deigo.position.x - deigoW * deigo.userData.visualLeftBias + deigoW * 0.02;
      const deigoTopEdge = my + deigoH / 2;
      const owoBottom = my - deigoH / 2;
      const owoRightEdge =
        owo.position.x + owoW * owo.userData.visualLeftBias;
      const padY = -deigoH * 0.01;
      const ch = 128 * 1.4;

      const twName = measureTextWidth("DIEGO NICOLÁS RIVERA SÁNCHEZ");
      const maxNameH = (deigoW * 0.7 * ch) / twName;
      const nameH = Math.min(textH * 0.20, maxNameH);

      const twTitle = measureTextWidth("JUNIOR-LEVEL FULL STACK LEARNER");
      const maxTitleH = (deigoW * 0.8 * ch) / twTitle;
      const titleH = Math.min(textH * 0.35, maxTitleH);

      const name = makeMetallicSprite(
        "DIEGO NICOLÁS RIVERA SÁNCHEZ",
        nameH,
        dpr,
        silver.c1,
        silver.c2,
        silver.hl,
        silver.sp,
        false,
      );
      const title = makeMetallicSprite(
        "JUNIOR-LEVEL FULL STACK LEARNER",
        titleH,
        dpr,
        brightGold.c1,
        brightGold.c2,
        brightGold.hl,
        brightGold.sp,
        false,
      );

      placeLeft(name, deigoLeftEdge, deigoTopEdge + nameH / 2 + padY);
      placeRight(title, owoRightEdge, owoBottom - titleH / 2 - padY);
      contentGroup.add(name);
      contentGroup.add(title);
      sprites.push(name, title);

      return sprites;
    }

    function buildSprites(gltf: any) {
      allSprites = renderDesktop(gltf);
      computeEdges();
      fireLoaded();
    }

    const loader = new GLTFLoader();
    loader.load("/crt-tv.glb", (glb) => {
        model = glb.scene;
        document.fonts.ready
          .then(() => buildSprites(glb))
          .catch(() => buildSprites(glb));
      },
      undefined,
      (error) => {
        console.error(
          "Failed to load /model.gltf, falling back to basic display.",
          error,
        );
        fireLoaded();
      },
    );

    function onResize() {
      // Update camera and renderer dimensions FIRST
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);

        if (model) {
          clearSprites(allSprites);
          contentGroup.clear();
          buildSprites(model);
        }
        composer.passes.length = 0;
        composer.addPass(new RenderPass(scene, camera));
        bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          bloomTarget,
          0.4,
          0.85,
        );
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());
    }

    mql.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);

    // Interactive Listeners
    function onPointerMove(e: MouseEvent | TouchEvent) {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      targetMouse.x = (clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(clientY / window.innerHeight) * 2 + 1;

      // Update cursor on hover over the 3D model
      if (model && !("touches" in e)) {
        raycaster.setFromCamera(targetMouse, camera);
        const intersects = raycaster.intersectObject(model, true);
        if (intersects.length > 0) {
          if (!isHovering) {
            isHovering = true;
            document.body.style.cursor = "pointer";
          }
        } else {
          if (isHovering) {
            isHovering = false;
            document.body.style.cursor = "default";
          }
        }
      }
    }
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    function onInteractClick(e: MouseEvent | TouchEvent) {
      if (!model) return;
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const m = new THREE.Vector2(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
      );
      raycaster.setFromCamera(m, camera);
      const intersects = raycaster.intersectObject(model, true);
      if (intersects.length > 0) {
        modelSpinSpeed = 15.0; // Intense spin!
        currentBloom = bloomTarget * 8.0; // Huge neon flash
      }
    }
    window.addEventListener("mousedown", onInteractClick);
    window.addEventListener("touchstart", onInteractClick, { passive: true });

    function onScroll() {
      scrollY = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    timer = new THREE.Timer();

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera)
      if (!timer) return;
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      // const freq = RadioManager.getInstance().getFrequencies()

      // 1. Mouse Lerping for smooth follow
      currentMouse.lerp(targetMouse, 0.05);

      // 2. Parallax Camera (Scroll Dive Disabled to keep native depth static)
      const baseZ = 12;

      camera.position.x +=
        (currentMouse.x * 2.0 - camera.position.x) * delta * 5;
      camera.position.y +=
        (0.5 + currentMouse.y * 2.0 - camera.position.y) * delta * 5;
      camera.position.z += (baseZ - camera.position.z) * delta * 5;
      camera.lookAt(0, 0, 0);

      // 3. Dynamic Interactive Lighting
      pointerLight.position.set(currentMouse.x * 15, currentMouse.y * 15, 8);
      pointerLight.intensity = THREE.MathUtils.lerp(
        pointerLight.intensity,
        3.5,
        0.02,
      ); // Fade in light

      // 4. Dramatic Entrance Animation & Audio Reactivity (Pulse)

      // const bassHit = Math.pow(freq.bass, 3); // Exponential scaling for bloom

      // Calibrated audio reactivity for scaling: separate grave/medio/agudo levels
      // Scaled and tuned to prevent the model and text sprites from overflowing the screen.
      // const bassReact = Math.pow(freq.bass, 3) * 0.08    // Subtle pulse on heavy bass kicks
      // const midReact = Math.pow(freq.mid, 2.5) * 0.04    // Smooth response to melody and vocals
      // const highReact = Math.pow(freq.high, 2) * 0.02    // Snappy micro-vibration on treble transients
      // const targetScale = 1.0 + (bassReact + midReact + highReact)

      // contentGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
      contentGroup.position.z = THREE.MathUtils.lerp(
        contentGroup.position.z,
        0,
        0.03,
      );
      contentGroup.rotation.y = THREE.MathUtils.lerp(
        contentGroup.rotation.y,
        0,
        0.03,
      );

      // 5. Reactive Stars
      stars.rotation.x += (-currentMouse.y * 0.1 - stars.rotation.x) * 0.05;
      stars.rotation.z += (-currentMouse.x * 0.1 - stars.rotation.z) * 0.05;

      // const musicSpeed = Math.pow(freq.mid + freq.high, 2) * 0.01;
      // stars.rotation.y += 0.0008 + (scrollY * 0.000005) + musicSpeed // Spin faster on scroll + music

      // 6. Interactive Model (Spin decay)
      modelSpinSpeed = THREE.MathUtils.lerp(modelSpinSpeed, 0.5, 0.03);
      if (model) {
        model.rotation.y += delta * modelSpinSpeed;
        model.position.y = Math.sin(elapsed * 0.8) * 0.15 + 0.3;
      }

      // 7. Interactive Bloom (Flash decay + Bass boost)
      // const bassBloom = bassHit * 1.5;
      // currentBloom = THREE.MathUtils.lerp(currentBloom, bloomTarget + bassBloom, 0.15)
      bloomPass.strength = currentBloom;

      for (const s of allSprites) {
        const st = s.userData.shaderTime;
        if (st) st.value = elapsed;
      }
      starMat.uniforms.time.value = elapsed;

      // Peeking animation disabled for objects to keep them static as requested
      const targetY = 0;
      contentGroup.position.y +=
        (targetY - contentGroup.position.y) * delta * 6.0;

      composer.render();
    }
    animate();

    function onVisibilityChange() {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        timer?.getDelta();
        animate();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onInteractClick);
      window.removeEventListener("touchstart", onInteractClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.body.style.cursor = "default";
      if (renderer) {
        renderer.dispose();
      }
      if (composer) {
        composer.dispose();
      }
      container.innerHTML = "";
    };
  }, []);

  return <div ref={ref} className="w-full h-screen z-0" />;
}
