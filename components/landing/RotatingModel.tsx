"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RotatingModel = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const size = isMobile ? 300 : 500;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.2);

    while (mount.firstChild) mount.removeChild(mount.firstChild);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Soft gradient environment via scene fog-less lights
    scene.add(new THREE.AmbientLight(0xb8a8ff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 8);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xa376fe, 1.6);
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    const fill = new THREE.PointLight(0x514bff, 2.5, 12);
    fill.position.set(0, -1.5, 3);
    scene.add(fill);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Orbital particle ring around logo
    const ringCount = isMobile ? 80 : 160;
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2;
      const r = 1.55 + (Math.random() - 0.5) * 0.15;
      ringPos[i * 3] = Math.cos(a) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    modelGroup.add(ring);

    // Inner energy core glow (sprite-like sphere)
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xa376fe,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    modelGroup.add(core);

    const loader = new GLTFLoader();
    loader.load("/models/logomodel.glb", (gltf: GLTF) => {
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const dimensions = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1;
      const fittedScale = (isMobile ? 2.55 : 3.15) / maxDimension;

      model.scale.setScalar(fittedScale);
      model.position.copy(center).multiplyScalar(-fittedScale);
      model.position.y += 0.04;

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = new THREE.MeshPhysicalMaterial({
            color: 0xb8afff,
            metalness: 0.18,
            roughness: 0.14,
            transmission: 0.62,
            thickness: 0.72,
            ior: 1.35,
            transparent: true,
            opacity: 0.9,
            emissive: new THREE.Color(0x514bff),
            emissiveIntensity: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            iridescence: 0.42,
            iridescenceIOR: 1.3,
          });
          mesh.material = mat;
        }
      });

      modelGroup.add(model);

      gsap.from(model.scale, {
        x: 0.2,
        y: 0.2,
        z: 0.2,
        duration: 1.6,
        delay: 2.3,
        ease: "elastic.out(1, 0.55)",
      });
    });

    let targetRotationX = 0;
    let targetRotationY = 0;
    let floatingOffset = 0;
    let scrollSpin = 0;
    const springFactor = 0.07;

    const scrollTrigger = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollSpin = self.progress * Math.PI * 0.24;
      },
    });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      floatingOffset += 0.012;

      modelGroup.position.y = Math.sin(floatingOffset) * 0.07;
      modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * springFactor;
      modelGroup.rotation.y += (targetRotationY + scrollSpin - modelGroup.rotation.y) * springFactor;

      ring.rotation.y += 0.004;
      ring.rotation.x = Math.sin(floatingOffset * 0.5) * 0.15;
      core.scale.setScalar(1 + Math.sin(floatingOffset * 2) * 0.12);
      coreMat.opacity = 0.18 + Math.sin(floatingOffset * 2.5) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotationY = x * 0.16;
      targetRotationX = y * 0.11;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      scrollTrigger.kill();
      ringGeo.dispose();
      ringMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      mount.innerHTML = "";
      initializedRef.current = false;
    };
  }, []);

  return <div ref={mountRef} className="sm:w-[500px] sm:h-[500px] w-[300px] h-[300px]" />;
};

export default RotatingModel;
