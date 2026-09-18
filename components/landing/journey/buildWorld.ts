import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const PURPLE = 0x514bff;
const LILAC = 0xa376fe;
const WHITE = 0xffffff;

function glowMat(color: number, opacity = 0.85) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function stampBaseOpacity(root: THREE.Object3D) {
  root.traverse((child) => {
    const apply = (mat: THREE.Material & { opacity?: number }) => {
      if (!("opacity" in mat)) return;
      mat.userData.baseOpacity = mat.opacity ?? 1;
      mat.transparent = true;
    };
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => apply(m as THREE.Material & { opacity?: number }));
    }
    const line = child as THREE.Line;
    if (line.isLine && line.material) apply(line.material as THREE.Material & { opacity?: number });
    const pts = child as THREE.Points;
    if (pts.isPoints && pts.material) apply(pts.material as THREE.Material & { opacity?: number });
  });
}

export function setStationPresence(root: THREE.Object3D, strength: number) {
  const s = Math.max(0, Math.min(1, strength));
  root.visible = s > 0.02;
  if (!root.visible) return;

  root.traverse((child) => {
    const apply = (mat: THREE.Material & { opacity?: number }) => {
      if (!("opacity" in mat)) return;
      const base = (mat.userData.baseOpacity as number) ?? 1;
      mat.opacity = base * s;
    };
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => apply(m as THREE.Material & { opacity?: number }));
    }
    const line = child as THREE.Line;
    if (line.isLine && line.material) apply(line.material as THREE.Material & { opacity?: number });
    const pts = child as THREE.Points;
    if (pts.isPoints && pts.material) apply(pts.material as THREE.Material & { opacity?: number });
  });
}

function fitModel(model: THREE.Object3D, targetSize = 2.4) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
}

async function loadFittedGlb(url: string, targetSize: number) {
  const gltf = await new GLTFLoader().loadAsync(url);
  const model = gltf.scene;
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if ("envMapIntensity" in mat) {
          mat.envMapIntensity = 1.2;
          mat.needsUpdate = true;
        }
      });
    }
  });
  fitModel(model, targetSize);
  return model;
}

function applyThemeMaterial(
  root: THREE.Object3D,
  color: number,
  emissive: number,
  intensity = 0.2
) {
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: intensity,
      metalness: 0.14,
      roughness: 0.16,
      transmission: 0.42,
      thickness: 0.5,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      iridescence: 0.25,
    });
  });
}

export function createStarfield(count = 350) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = -Math.random() * 120 + 5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: WHITE,
      size: 0.028,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
}

/** Ch1 — Brand logo */
export async function createLogoProp(): Promise<THREE.Group> {
  const group = new THREE.Group();
  group.position.set(0, 0.15, 0);
  group.name = "logo";

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.012, 12, 96), glowMat(LILAC, 0.35));
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  try {
    const model = await loadFittedGlb("/models/logomodel.glb", 2.3);
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.35,
          roughness: 0.05,
          transmission: 0.88,
          thickness: 0.55,
          transparent: true,
          opacity: 1,
          emissive: new THREE.Color(PURPLE),
          emissiveIntensity: 0.14,
          clearcoat: 1,
        });
      }
    });
    group.add(model);
  } catch {
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), glowMat(WHITE, 0.45)));
  }

  stampBaseOpacity(group);
  return group;
}

/** Ch2 — Tree of growth (CC0 Polygonal Mind MomusPark) */
export async function createTreeProp() {
  const group = new THREE.Group();
  group.position.set(0, -0.4, -22);
  group.name = "tree";

  try {
    const tree1 = await loadFittedGlb("/models/journey/tree-01.glb", 2.4);
    tree1.position.x = -0.8;
    group.add(tree1);

    const tree2 = await loadFittedGlb("/models/journey/tree-02.glb", 2.2);
    tree2.position.set(0.7, 0.1, 0.4);
    tree2.rotation.y = 0.6;
    group.add(tree2);

    const tree3 = await loadFittedGlb("/models/journey/tree-03.glb", 2.6);
    tree3.position.set(0.2, -0.2, -0.5);
    tree3.rotation.y = -0.35;
    group.add(tree3);
  } catch {
    group.add(new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.5, 16), glowMat(LILAC, 0.5)));
  }

  // Ground aura
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 48),
    new THREE.MeshBasicMaterial({ color: PURPLE, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.55;
  group.add(ground);

  stampBaseOpacity(group);
  group.visible = false;
  return group;
}

/** Ch3 — Three distinct forces: human, personalized, and immersive. */
export async function createTrinityProp() {
  const group = new THREE.Group();
  group.position.set(0, 0.1, -44);
  group.name = "trinity";

  const offsets = [-1.9, 0, 1.9] as const;
  let forces: THREE.Object3D[] = [];

  try {
    forces = await Promise.all(
      [0.95, 1.18, 0.95].map((size) =>
        loadFittedGlb("/models/journey/crystal-cluster.glb", size)
      )
    );
    const themes = [
      { color: WHITE, emissive: 0x8ca8ff, intensity: 0.12 },
      { color: 0xc9bfff, emissive: LILAC, intensity: 0.3 },
      { color: 0x7167ff, emissive: PURPLE, intensity: 0.48 },
    ];
    forces.forEach((force, index) => {
      const theme = themes[index];
      applyThemeMaterial(force, theme.color, theme.emissive, theme.intensity);
      force.rotation.set(index * 0.18 - 0.18, index * 0.7, index * -0.12);
      force.userData.forceIndex = index;
    });
  } catch {
    forces = [];
  }

  offsets.forEach((x, i) => {
    const force =
      forces[i] ??
      new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 2),
        glowMat(i === 1 ? WHITE : LILAC, 0.42)
      );
    force.position.set(x, Math.sin(i * 1.5) * 0.25, 0);
    group.add(force);

    const shell = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.BufferAttribute(
          (() => {
            const arr = new Float32Array(80 * 3);
            for (let k = 0; k < 80; k++) {
              const u = Math.random();
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * u - 1);
              const r = 0.7 + Math.random() * 0.25;
              arr[k * 3] = Math.sin(phi) * Math.cos(theta) * r + x;
              arr[k * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r + Math.sin(i * 1.5) * 0.25;
              arr[k * 3 + 2] = Math.cos(phi) * r;
            }
            return arr;
          })(),
          3
        )
      ),
      new THREE.PointsMaterial({
        color: i === 1 ? WHITE : PURPLE,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
    );
    group.add(shell);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.012, 12, 64),
      glowMat(PURPLE, 0.35)
    );
    ring.position.copy(force.position);
    ring.rotation.x = Math.PI / 2.5 + i * 0.3;
    group.add(ring);
  });

  // Linking arc
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.9, 0, 0),
    new THREE.Vector3(-0.9, 0.85, 0.15),
    new THREE.Vector3(0, 1.1, 0.3),
    new THREE.Vector3(0.9, 0.85, 0.15),
    new THREE.Vector3(1.9, 0, 0),
  ]);
  const linkMat = new THREE.LineBasicMaterial({
    color: WHITE,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), linkMat));
  group.userData.forces = forces;

  stampBaseOpacity(group);
  group.visible = false;
  return group;
}

/** Ch4 — Infinity. A crystal arc + floating cluster = gateway feel. */
export async function createInfinityProp() {
  const group = new THREE.Group();
  group.position.set(0, -0.1, -66);
  group.name = "infinity";

  try {
    const arc = await loadFittedGlb("/models/journey/crystal-arc.glb", 3.6);
    applyThemeMaterial(arc, 0xb5a9ff, LILAC, 0.24);
    arc.rotation.y = Math.PI / 2;
    group.add(arc);

    const cluster = await loadFittedGlb("/models/journey/crystal-cluster.glb", 1.1);
    applyThemeMaterial(cluster, WHITE, PURPLE, 0.26);
    cluster.position.set(0, 1.0, 0.2);
    group.add(cluster);

    const cluster2 = await loadFittedGlb("/models/journey/crystal-cluster.glb", 0.7);
    applyThemeMaterial(cluster2, 0x9287ff, PURPLE, 0.42);
    cluster2.position.set(1.2, 0.2, -0.4);
    cluster2.rotation.y = 1.2;
    group.add(cluster2);
  } catch {
    group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.3, 120, 16), glowMat(LILAC, 0.5)));
  }

  // Infinity ribbon overlay to reinforce the symbol
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 200; i++) {
    const u = (i / 200) * Math.PI * 2;
    const s = 1.9 / (1 + Math.sin(u) * Math.sin(u));
    pts.push(new THREE.Vector3(s * Math.cos(u), s * Math.sin(u) * Math.cos(u) * 0.85, Math.sin(u * 2) * 0.3));
  }
  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.025, 8, true),
      glowMat(LILAC, 0.5)
    )
  );

  const beads = new THREE.Group();
  for (let i = 0; i < 28; i++) {
    const point = pts[Math.floor((i / 28) * (pts.length - 1))];
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(i % 7 === 0 ? 0.055 : 0.028, 8, 8),
      glowMat(i % 3 === 0 ? WHITE : LILAC, 0.72)
    );
    bead.position.copy(point);
    bead.userData.baseY = point.y;
    beads.add(bead);
  }
  group.add(beads);
  group.userData.beads = beads;

  stampBaseOpacity(group);
  group.visible = false;
  return group;
}

/** Ch5 — Ascending method helix (aero rings + procedural helix). */
export async function createHelixProp() {
  const group = new THREE.Group();
  group.position.set(0, -0.2, -88);
  group.name = "helix";

  try {
    const ring1 = await loadFittedGlb("/models/journey/aero-ring.glb", 2.4);
    applyThemeMaterial(ring1, 0x7167ff, PURPLE, 0.38);
    ring1.position.y = 0;
    ring1.userData.spin = 0.002;
    group.add(ring1);

    const ring2 = await loadFittedGlb("/models/journey/aero-ring.glb", 1.6);
    applyThemeMaterial(ring2, 0xa89cff, LILAC, 0.32);
    ring2.position.y = 1.6;
    ring2.rotation.x = Math.PI / 3;
    ring2.userData.spin = -0.003;
    group.add(ring2);

    const ring3 = await loadFittedGlb("/models/journey/aero-ring.glb", 0.9);
    applyThemeMaterial(ring3, WHITE, LILAC, 0.2);
    ring3.position.y = 2.9;
    ring3.rotation.x = Math.PI / 2.5;
    ring3.userData.spin = 0.004;
    group.add(ring3);
  } catch {
    // fall through to helix
  }

  // Procedural energy helix
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const a = t * Math.PI * 7;
    const r = 1.0 - t * 0.3;
    pts.push(new THREE.Vector3(Math.cos(a) * r, t * 6.5 - 0.6, Math.sin(a) * r));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.04, 8, false), glowMat(PURPLE, 0.65)));

  for (let i = 0; i < 16; i++) {
    const p = curve.getPoint(i / 16);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), glowMat(WHITE, 0.8));
    node.position.copy(p);
    group.add(node);
  }

  stampBaseOpacity(group);
  group.visible = false;
  return group;
}

/** Ch6 — A unique procedural threshold, distinct from the crystal infinity station. */
export async function createPortalProp() {
  const group = new THREE.Group();
  group.position.set(0, 0.4, -110);
  group.name = "portal";

  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.05 + i * 0.28, 0.018, 12, 80),
      glowMat(i % 2 ? LILAC : PURPLE, 0.5 - i * 0.07)
    );
    ring.userData.spin = (i % 2 === 0 ? 1 : -1) * (0.004 + i * 0.001);
    group.add(ring);
  }
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), glowMat(WHITE, 0.28)));

  const streaks = new THREE.Group();
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const inner = 1.7 + (i % 3) * 0.12;
    const outer = 4.1 + (i % 5) * 0.28;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle) * inner, -0.2),
      new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle) * outer, -1.6),
    ]);
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: i % 2 ? LILAC : PURPLE,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    streaks.add(line);
  }
  streaks.userData.spin = -0.0015;
  group.add(streaks);

  stampBaseOpacity(group);
  group.visible = false;
  return group;
}

export type JourneyWorld = {
  root: THREE.Group;
  logo: THREE.Group;
  tree: THREE.Group;
  trinity: THREE.Group;
  infinity: THREE.Group;
  helix: THREE.Group;
  portal: THREE.Group;
  stars: THREE.Points;
};

export async function buildJourneyWorld(): Promise<JourneyWorld> {
  const root = new THREE.Group();
  const stars = createStarfield();

  const [logo, tree, trinity, infinity, helix, portal] = await Promise.all([
    createLogoProp(),
    createTreeProp(),
    createTrinityProp(),
    createInfinityProp(),
    createHelixProp(),
    createPortalProp(),
  ]);

  setStationPresence(logo, 1);
  setStationPresence(tree, 0);
  setStationPresence(trinity, 0);
  setStationPresence(infinity, 0);
  setStationPresence(helix, 0);
  setStationPresence(portal, 0);

  root.add(stars, logo, tree, trinity, infinity, helix, portal);
  return { root, logo, tree, trinity, infinity, helix, portal, stars };
}
