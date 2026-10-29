"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildJourneyWorld, setStationPresence } from "./buildWorld";
import { CAMERA_PATH, JOURNEY_CHAPTERS, STATION_BEATS } from "./chapters";

gsap.registerPlugin(ScrollTrigger);

function buildCameraCurves(path: typeof CAMERA_PATH) {
  const posPts = path.map((k) => new THREE.Vector3(k.pos[0], k.pos[1], k.pos[2]));
  const lookPts = path.map((k) => new THREE.Vector3(k.look[0], k.look[1], k.look[2]));
  return {
    posCurve: new THREE.CatmullRomCurve3(posPts, false, "catmullrom", 0.35),
    lookCurve: new THREE.CatmullRomCurve3(lookPts, false, "catmullrom", 0.35),
  };
}

const CAMERA_STOPS = [0.075, 0.26, 0.445, 0.63, 0.815, 0.965] as const;

const TRANSIT_SIGNATURES = [
  { x: 1.25, y: 0.75, roll: -0.045, fov: 7 },
  { x: -0.85, y: -0.8, roll: 0.065, fov: 8 },
  { x: 1.5, y: 0.2, roll: -0.08, fov: 7 },
  { x: 0.35, y: 1.2, roll: 0.035, fov: 9 },
  { x: 0.12, y: 0.1, roll: -0.025, fov: 13 },
] as const;

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function getDirectorState(progress: number) {
  const lastIndex = STATION_BEATS.length - 1;
  if (progress >= STATION_BEATS[lastIndex].at) {
    const local = THREE.MathUtils.clamp(
      (progress - STATION_BEATS[lastIndex].at) /
        (1 - STATION_BEATS[lastIndex].at),
      0,
      1
    );
    const push = THREE.MathUtils.smoothstep(local, 0.38, 1);
    return {
      cameraT: THREE.MathUtils.lerp(CAMERA_STOPS[lastIndex], 0.999, push),
      segment: lastIndex - 1,
      local,
      transit: Math.sin(push * Math.PI) * 0.45,
      moodBlend: 1,
    };
  }

  let segment = 0;
  for (let index = 0; index < lastIndex; index++) {
    if (
      progress >= STATION_BEATS[index].at &&
      progress < STATION_BEATS[index + 1].at
    ) {
      segment = index;
      break;
    }
  }

  const start = STATION_BEATS[segment].at;
  const end = STATION_BEATS[segment + 1].at;
  const local = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  const currentStop = CAMERA_STOPS[segment];
  const nextStop = CAMERA_STOPS[segment + 1];

  if (local < 0.34) {
    const dwell = THREE.MathUtils.smoothstep(local, 0, 0.34);
    return {
      cameraT: THREE.MathUtils.lerp(currentStop, currentStop + 0.012, dwell),
      segment,
      local,
      transit: 0,
      moodBlend: 0,
    };
  }

  if (local < 0.8) {
    const travel = easeInOutCubic((local - 0.34) / 0.46);
    return {
      cameraT: THREE.MathUtils.lerp(currentStop + 0.012, nextStop - 0.018, travel),
      segment,
      local,
      transit: Math.sin(travel * Math.PI),
      moodBlend: travel,
    };
  }

  const reveal = THREE.MathUtils.smoothstep((local - 0.8) / 0.2, 0, 1);
  return {
    cameraT: THREE.MathUtils.lerp(nextStop - 0.018, nextStop, reveal),
    segment,
    local,
    transit: 0,
    moodBlend: 1,
  };
}

const JourneyExperience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const chapterRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const host = canvasHostRef.current;
    if (!section || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let st: ScrollTrigger | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let journeyVisible = false;
    let worldRoot: THREE.Object3D | null = null;
    let started = false;

    const boot = async () => {
      const scene = new THREE.Scene();
      const fog = new THREE.FogExp2(0x070412, 0.042);
      scene.fog = fog;

      const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        160
      );

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.2 : 1.5)
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x070412, 1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xc8b8ff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(5, 10, 8);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xa376fe, 1.1);
      fill.position.set(-6, 3, -4);
      scene.add(fill);
      const rim = new THREE.PointLight(0x514bff, 4, 50);
      rim.position.set(0, 4, -50);
      scene.add(rim);
      // Moving light that follows camera slightly for model sheen
      const camLight = new THREE.PointLight(0xffffff, 1.6, 18);
      scene.add(camLight);

      const world = await buildJourneyWorld();
      if (disposed) return;
      worldRoot = world.root;
      scene.add(world.root);

      const { posCurve, lookCurve } = buildCameraCurves(CAMERA_PATH);
      const camPos = new THREE.Vector3();
      const camLook = new THREE.Vector3();
      const lookSmooth = new THREE.Vector3();
      const desiredPos = new THREE.Vector3();
      const clearColor = new THREE.Color();
      const chapterColors = [
        new THREE.Color(0x070412),
        new THREE.Color(0x06150f),
        new THREE.Color(0x070d22),
        new THREE.Color(0x030b19),
        new THREE.Color(0x120620),
        new THREE.Color(0x03030a),
      ];
      const fogColors = [
        new THREE.Color(0x110928),
        new THREE.Color(0x08241a),
        new THREE.Color(0x101b39),
        new THREE.Color(0x061a2d),
        new THREE.Color(0x210b35),
        new THREE.Color(0x080711),
      ];
      const keyColors = [
        new THREE.Color(0xffe6cf),
        new THREE.Color(0xbfffd8),
        new THREE.Color(0xc7dcff),
        new THREE.Color(0x99dfff),
        new THREE.Color(0xe3bdff),
        new THREE.Color(0xffffff),
      ];

      posCurve.getPoint(0, camPos);
      lookCurve.getPoint(0, camLook);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      lookSmooth.copy(camLook);

      setReady(true);
      ScrollTrigger.refresh();

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: host,
        scrub: 0.3,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          let idx = 0;
          let closestDistance = Number.POSITIVE_INFINITY;
          STATION_BEATS.forEach((beat, index) => {
            const distance = Math.abs(self.progress - beat.at);
            if (distance < closestDistance) {
              closestDistance = distance;
              idx = index;
            }
          });
          if (idx !== chapterRef.current) {
            chapterRef.current = idx;
            setChapter(idx);
          }

          const copyPresence =
            1 - THREE.MathUtils.smoothstep(closestDistance, 0.055, 0.105);
          host.style.setProperty(
            "--journey-copy-presence",
            copyPresence.toFixed(3)
          );
          host.style.setProperty(
            "--journey-copy-offset",
            `${((1 - copyPresence) * 22).toFixed(2)}px`
          );
          host.style.setProperty(
            "--journey-copy-blur",
            `${((1 - copyPresence) * 7).toFixed(2)}px`
          );
          if (scrollHintRef.current) {
            scrollHintRef.current.style.opacity = self.progress < 0.025 ? "1" : "0";
          }
        },
      });

      const clock = new THREE.Clock();
      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!journeyVisible) return;
        const t = clock.getElapsedTime();
        const p = progressRef.current;
        const director = getDirectorState(p);
        const transit = director.transit;
        const signature =
          TRANSIT_SIGNATURES[
            Math.min(TRANSIT_SIGNATURES.length - 1, director.segment)
          ];

        posCurve.getPoint(director.cameraT, desiredPos);
        lookCurve.getPoint(director.cameraT, camLook);

        const travelArc = Math.sin(director.moodBlend * Math.PI);
        desiredPos.x += signature.x * travelArc;
        desiredPos.y += signature.y * travelArc;
        const follow = transit > 0.05 ? 0.18 : 0.32;
        camera.position.lerp(desiredPos, follow);
        lookSmooth.lerp(camLook, follow * 0.9);
        camera.fov += (40 + transit * signature.fov - camera.fov) * follow;
        camera.updateProjectionMatrix();
        camera.lookAt(lookSmooth);
        camera.rotateZ(signature.roll * travelArc);
        camLight.position.copy(camera.position);
        camLight.intensity = 1.6 + transit * 2.2;

        const colorIndex = Math.min(chapterColors.length - 2, director.segment);
        clearColor
          .copy(chapterColors[colorIndex])
          .lerp(chapterColors[colorIndex + 1], director.moodBlend);
        renderer!.setClearColor(clearColor, 1);
        fog.color
          .copy(fogColors[colorIndex])
          .lerp(fogColors[colorIndex + 1], director.moodBlend);
        fog.density = THREE.MathUtils.lerp(
          [0.048, 0.034, 0.038, 0.028, 0.025, 0.02][colorIndex],
          [0.048, 0.034, 0.038, 0.028, 0.025, 0.02][colorIndex + 1],
          director.moodBlend
        );
        key.color
          .copy(keyColors[colorIndex])
          .lerp(keyColors[colorIndex + 1], director.moodBlend);
        renderer!.toneMappingExposure = 1.25 + director.segment * 0.045 + transit * 0.12;
        host.style.setProperty("--journey-transit", transit.toFixed(3));
        host.style.setProperty("--journey-progress", p.toFixed(3));

        // Prop life — only animate what is visible
        if (world.logo.visible) {
          world.logo.lookAt(camera.position);
          world.logo.rotateY(Math.PI);
          const logoRing = world.logo.children[0];
          if (logoRing) logoRing.rotation.z = t * 0.35;
        }
        if (world.tree.visible) world.tree.rotation.y = Math.sin(t * 0.2) * 0.06;
        if (world.trinity.visible) {
          world.trinity.rotation.y = Math.sin(t * 0.22) * 0.12;
          const forces = (world.trinity.userData as { forces?: THREE.Object3D[] }).forces;
          forces?.forEach((force, index) => {
            force.rotation.y += (index % 2 === 0 ? 1 : -1) * 0.003;
            force.position.y =
              Math.sin(index * 1.5) * 0.25 + Math.sin(t * 0.8 + index * 1.8) * 0.09;
          });
        }
        if (world.infinity.visible) {
          world.infinity.rotation.y = t * 0.15;
          world.infinity.rotation.x = Math.sin(t * 0.25) * 0.06;
          const beads = (world.infinity.userData as { beads?: THREE.Group }).beads;
          if (beads) {
            beads.children.forEach((bead, i) => {
              const baseY = (bead.userData.baseY as number) ?? bead.position.y;
              bead.position.y = baseY + Math.sin(t * 1.8 + i * 0.7) * 0.055;
              bead.scale.setScalar(0.7 + (Math.sin(t * 2.4 + i) * 0.5 + 0.5) * 0.65);
            });
            beads.rotation.y = t * -0.08;
          }
        }
        if (world.helix.visible) {
          world.helix.rotation.y = t * 0.08;
          world.helix.children.forEach((child) => {
            if (child.userData.spin) child.rotation.z += child.userData.spin;
          });
        }
        if (world.portal.visible) {
          world.portal.children.forEach((child) => {
            if (child.userData.spin) child.rotation.z += child.userData.spin;
          });
        }

        const stationMap = {
          logo: world.logo,
          tree: world.tree,
          trinity: world.trinity,
          infinity: world.infinity,
          helix: world.helix,
          portal: world.portal,
        } as const;

        STATION_BEATS.forEach(({ name, at, radius }) => {
          const d = Math.abs(p - at);
          let presence = 0;
          if (d < radius) {
            const tNorm = 1 - d / radius;
            presence = tNorm * tNorm * (3 - 2 * tNorm);
          }
          const obj = stationMap[name];
          setStationPresence(obj, presence);
          if (presence > 0) {
            obj.scale.setScalar(0.72 + presence * 0.3);
          }
        });

        world.stars.rotation.y = t * 0.008 + p * 0.16;
        world.stars.scale.z = 1 + transit * 2.5;

        renderer!.render(scene, camera);
      };
      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer!.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // cleanup resize on dispose via closure
      (host as HTMLDivElement & { __onResize?: () => void }).__onResize = onResize;
    };

    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        journeyVisible = entry.isIntersecting;
        if (entry.isIntersecting && !started) {
          started = true;
          void boot();
        }
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(section);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      st?.kill();
      visibilityObserver?.disconnect();
      const onResize = (host as HTMLDivElement & { __onResize?: () => void }).__onResize;
      if (onResize) window.removeEventListener("resize", onResize);
      if (renderer) {
        worldRoot?.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
      }
    };
  }, []);

  const active = JOURNEY_CHAPTERS[chapter];

  return (
    <section
      ref={sectionRef}
      className="journey-section relative"
      style={{ height: "650vh" }}
      aria-label="CoachChain cinematic journey"
    >
      <div
        ref={canvasHostRef}
        className="journey-pin relative w-full h-screen overflow-hidden bg-[#070412]"
      >
        <div className="journey-warp pointer-events-none absolute inset-0 z-[5]" />
        {/* Vignette + grain */}
        <div className="journey-vignette pointer-events-none absolute inset-0 z-10" />
        <div className="journey-grain pointer-events-none absolute inset-0 z-10 opacity-[0.12]" />

        {/* Chapter copy */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center pointer-events-none px-6 md:px-16 lg:px-24 pb-28 md:pb-0">
          <div
            key={active.id}
            className="journey-copy max-w-[520px] md:ml-0 text-white font-montserrat"
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/55 mb-4">
              {active.eyebrow}
            </p>
            <h2 className="text-[32px] md:text-[48px] font-semibold leading-[1.1] mb-4">
              {active.title}
            </h2>
            <p className="text-[15px] md:text-[17px] font-medium text-white/75 leading-relaxed max-w-[420px]">
              {active.body}
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/50 transition-opacity duration-500"
        >
          <span className="font-montserrat text-[10px] tracking-[0.3em] uppercase">
            Scroll the path
          </span>
          <span className="journey-scroll-arrow w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>

        {!ready && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#514BFF] to-[#A376FE] text-white font-montserrat text-base tracking-widest uppercase">
            Preparing journey…
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneyExperience;
