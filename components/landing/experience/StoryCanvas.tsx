"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero-only ambient dust.
 * Kept sparse, small, low-contrast, and pushed to the sides so the
 * wireframe tree, logo, headline and chapter rail stay crisp.
 */
const StoryCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 280 : 620;
    const TWINKLE_COUNT = isMobile ? 160 : 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const isStar = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const seed = Math.random();
      const spread = Math.pow(seed, 0.75);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      let x = spread * Math.sin(phi) * Math.cos(theta);
      let y = spread * Math.cos(phi) * 0.6;
      let z = spread * Math.sin(phi) * Math.sin(theta) * 0.65;

      if (i < TWINKLE_COUNT) {
        const band = i / TWINKLE_COUNT;
        if (band < 0.62) {
          // Dense glowing field across the empty top sky.
          x = (Math.random() * 2 - 1) * 1.25;
          y = 0.52 + Math.random() * 0.78;
        } else if (band < 0.82) {
          // Mid-sky scatter around the header.
          x = (Math.random() * 2 - 1) * 1.15;
          y = 0.22 + Math.random() * 0.38;
        } else {
          // Soft canopy sparkle on the tree.
          x = 0.15 + Math.random() * 1.05;
          y = -0.05 + Math.random() * 0.7;
        }
        z = -0.2 + Math.random() * 0.4;
      } else {
        // Keep the central copy clear while ambient dust occupies the edges.
        if (Math.abs(x) < 0.35 && Math.abs(y) < 0.25) {
          x += x < 0 ? -0.55 : 0.55;
        }
        if (y > -0.1 && y < 0.35) {
          y += y < 0.12 ? -0.45 : 0.45;
        }
      }

      base[i3] = x * 3.6;
      base[i3 + 1] = y * 2.4;
      base[i3 + 2] = z * 2.6 - 0.6;

      positions[i3] = base[i3];
      positions[i3 + 1] = base[i3 + 1];
      positions[i3 + 2] = base[i3 + 2];
      sizes[i] =
        i < TWINKLE_COUNT
          ? 0.22 + Math.random() * 0.55
          : 0.1 + Math.random() * 0.42;
      seeds[i] = seed;
      isStar[i] = i < TWINKLE_COUNT ? 1 : 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aIsStar", new THREE.BufferAttribute(isStar, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aSeed;
        attribute float aIsStar;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vSeed;
        varying float vTwinkle;
        varying float vIsStar;
        void main() {
          vSeed = aSeed;
          vIsStar = aIsStar;
          vec3 pos = position;
          float breathe = sin(uTime * 0.35 + aSeed * 6.2831) * 0.025;
          pos += normalize(pos + 0.001) * breathe;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vTwinkle = pow(0.5 + 0.5 * sin(uTime * (1.4 + aSeed * 3.4) + aSeed * 31.0), 3.2);
          float maxPointSize = mix(9.0, 6.5, aIsStar);
          gl_PointSize = clamp(aSize * (120.0 / -mv.z) * uPixelRatio * (0.78 + vTwinkle * 0.35), 1.0, maxPointSize);
          gl_Position = projectionMatrix * mv;
          vAlpha = clamp(0.55 + mv.z * 0.06, 0.12, 0.45);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying float vSeed;
        varying float vTwinkle;
        varying float vIsStar;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.15, d);
          vec3 color = mix(uColorA, uColorB, vSeed);
          float core = smoothstep(0.18, 0.0, d);
          float ambientAlpha = 0.18 + vTwinkle * 0.18;
          float starAlpha = 0.16 + vTwinkle * 1.55;
          float alpha = mix(ambientAlpha, starAlpha, vIsStar);
          gl_FragColor = vec4(color + core * vIsStar * 0.75, soft * vAlpha * alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
        uColorA: { value: new THREE.Color("#BFB4FF") },
        uColorB: { value: new THREE.Color("#FFFFFF") },
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Soft bokeh bubbles rise from the connected ground plane.
    const ORB_COUNT = isMobile ? 9 : 18;
    const orbPositions = new Float32Array(ORB_COUNT * 3);
    const orbSpeeds = new Float32Array(ORB_COUNT);
    for (let i = 0; i < ORB_COUNT; i++) {
      orbPositions[i * 3] = (Math.random() - 0.5) * 7.8;
      orbPositions[i * 3 + 1] = -2.75 + Math.random() * 0.8;
      orbPositions[i * 3 + 2] = -0.8 + Math.random() * 1.7;
      orbSpeeds[i] = 0.0015 + Math.random() * 0.003;
    }
    const orbGeometry = new THREE.BufferGeometry();
    orbGeometry.setAttribute("position", new THREE.BufferAttribute(orbPositions, 3));

    const orbTextureCanvas = document.createElement("canvas");
    orbTextureCanvas.width = 64;
    orbTextureCanvas.height = 64;
    const orbContext = orbTextureCanvas.getContext("2d");
    const orbGradient = orbContext?.createRadialGradient(32, 32, 4, 32, 32, 31);
    if (orbContext && orbGradient) {
      orbGradient.addColorStop(0, "rgba(255,255,255,0.38)");
      orbGradient.addColorStop(0.22, "rgba(163,118,254,0.22)");
      orbGradient.addColorStop(0.72, "rgba(81,75,255,0.08)");
      orbGradient.addColorStop(1, "rgba(81,75,255,0)");
      orbContext.fillStyle = orbGradient;
      orbContext.fillRect(0, 0, 64, 64);
    }
    const orbTexture = new THREE.CanvasTexture(orbTextureCanvas);
    const orbMaterial = new THREE.PointsMaterial({
      color: 0xbec8ff,
      map: orbTexture,
      size: isMobile ? 0.38 : 0.58,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const orbs = new THREE.Points(orbGeometry, orbMaterial);
    scene.add(orbs);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let t = 0;
    let visible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      t += 0.016;
      material.uniforms.uTime.value = t;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const arr = geometry.getAttribute("position").array as Float32Array;
      const parallaxX = mouse.x * 0.18;
      const parallaxY = mouse.y * 0.12;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const seed = seeds[i];
        const driftX = Math.sin(t * 0.18 + seed * 8) * 0.015;
        const driftY = Math.cos(t * 0.22 + seed * 10) * 0.012;
        arr[i3] = base[i3] + parallaxX * (0.25 + seed * 0.35) + driftX;
        arr[i3 + 1] = base[i3 + 1] + parallaxY * (0.2 + seed * 0.3) + driftY;
        arr[i3 + 2] = base[i3 + 2] + Math.cos(t * 0.15 + seed * 7) * 0.015;
      }
      geometry.getAttribute("position").needsUpdate = true;

      const orbArray = orbGeometry.getAttribute("position").array as Float32Array;
      for (let i = 0; i < ORB_COUNT; i++) {
        orbArray[i * 3 + 1] += orbSpeeds[i];
        orbArray[i * 3] += Math.sin(t * 0.35 + i * 2.1) * 0.0007;
        if (orbArray[i * 3 + 1] > -1.65) orbArray[i * 3 + 1] = -2.85;
      }
      orbGeometry.getAttribute("position").needsUpdate = true;
      orbs.position.x = mouse.x * 0.28;
      orbs.position.y = mouse.y * 0.08;

      points.rotation.y = t * 0.012 + mouse.x * 0.04;
      points.rotation.x = mouse.y * 0.025;

      camera.position.x += (mouse.x * 0.15 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.1 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      orbTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="story-canvas pointer-events-none absolute inset-0 z-[2]"
      aria-hidden
    />
  );
};

export default StoryCanvas;
