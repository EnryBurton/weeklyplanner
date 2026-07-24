import {
  brickTexture, terracottaRoofTexture, corrugatedTexture,
  timberDeckTexture, grassTexture, paversTexture, gravelTexture, hallwayFloorTexture,
} from './textures.js';

// ---------------------------------------------------------------------------
// 32 Ruskin Street, Elwood — stylised 3D massing model built from the real
// floor-plan room dimensions and street/interior photos supplied by the owner.
// Layout runs along +Z from the street (Z=0) back to the rear laneway.
// ---------------------------------------------------------------------------

export const LOT = {
  heritageWidth: 7.2,   // original villa + bedroom wing
  modernWidth: 8.6,     // kitchen/living pavilion (flares east to the lightcourt)
  totalDepth: 54.4,
};

// Depth zones (front -> back), each { name, from, to }
export const ZONES = [
  { name: 'garden', from: 0, to: 5 },
  { name: 'verandah', from: 5, to: 7 },
  { name: 'bedroom4', from: 7, to: 11 },      // front bedroom w/ fireplace, BIR+drawers
  { name: 'bedroom3', from: 11, to: 15.3 },   // bedroom w/ ensuite
  { name: 'bedroom2', from: 15.3, to: 19.8 }, // bedroom w/ BIR + side deck
  { name: 'bedroom1', from: 19.8, to: 24.4 }, // smallest, attic access
  { name: 'wetcore', from: 24.4, to: 27.0 },  // bath/laundry/powder/WIP + lightcourt start
  { name: 'kitchen', from: 27.0, to: 29.4 },
  { name: 'dining', from: 29.4, to: 32.4 },
  { name: 'living', from: 32.4, to: 39.4 },
  { name: 'undercover', from: 39.4, to: 42.4 },
  { name: 'alfresco', from: 42.4, to: 45.4 },
  { name: 'spa', from: 45.4, to: 46.9 },
  { name: 'pool', from: 46.9, to: 52.4 },
  { name: 'laneway', from: 52.4, to: 54.4 },
];

const HERITAGE_END = 27.0; // where the villa gives way to the modern pavilion
const X0 = -LOT.heritageWidth / 2; // west boundary (shared by both wings)
const modernEastX = X0 + LOT.modernWidth;
const heritageEastX = X0 + LOT.heritageWidth;

function zone(name) { return ZONES.find(z => z.name === name); }
function mid(z) { return (z.from + z.to) / 2; }

export function buildHouse(THREE) {
  const group = new THREE.Group();

  const mkBox = (x, y, z, w, h, d, material) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // ---- materials -----------------------------------------------------
  const brickMat = new THREE.MeshStandardMaterial({ map: brickTexture(THREE), roughness: 0.9 });
  const renderMat = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.85 });
  const renderDarkMat = new THREE.MeshStandardMaterial({ color: 0xe7e2d3, roughness: 0.85 });
  const roofTileMat = new THREE.MeshStandardMaterial({ map: terracottaRoofTexture(THREE), roughness: 0.8 });
  const roofFlatMat = new THREE.MeshStandardMaterial({ map: corrugatedTexture(THREE, '#6b6f73'), roughness: 0.6, metalness: 0.3 });
  const verandahRoofMat = new THREE.MeshStandardMaterial({ map: corrugatedTexture(THREE, '#9a9d9f'), roughness: 0.5, metalness: 0.4 });
  const timberBattenMat = new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.7 });
  const timberDeckMat = new THREE.MeshStandardMaterial({ map: timberDeckTexture(THREE), roughness: 0.75 });
  const hallwayFloorMat = new THREE.MeshStandardMaterial({ map: hallwayFloorTexture(THREE), roughness: 0.5 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbcd7de, transparent: true, opacity: 0.28, roughness: 0.05,
    metalness: 0, transmission: 0.6, thickness: 0.05,
  });
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const chimneyCapMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.6 });
  const postMat = new THREE.MeshStandardMaterial({ color: 0xf7f4ec, roughness: 0.5 });
  const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture(THREE), roughness: 1 });
  const paversMat = new THREE.MeshStandardMaterial({ map: paversTexture(THREE), roughness: 0.9 });
  const gravelMat = new THREE.MeshStandardMaterial({ map: gravelTexture(THREE), roughness: 1 });
  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x2f5c2a, roughness: 1 });
  const poolWaterMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a9fc8, transparent: true, opacity: 0.85, roughness: 0.05, transmission: 0.3, metalness: 0,
  });
  const poolCopingMat = new THREE.MeshStandardMaterial({ color: 0xd8d3c4, roughness: 0.8 });
  const boundaryFenceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const laneAsphaltMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 1 });
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.9 });
  const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x3f7d3a, roughness: 0.8, side: THREE.DoubleSide });
  const skirtingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });

  const WALL_H = 3.2;      // heritage wall height (high Edwardian ceilings)
  const MODERN_WALL_H = 3.0;
  const FLOOR_Y = 0.45;    // floor slab / footings above ground

  // ---- ground plane ----------------------------------------------------
  const groundGeo = new THREE.PlaneGeometry(40, LOT.totalDepth + 10);
  const ground = new THREE.Mesh(groundGeo, grassMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, LOT.totalDepth / 2);
  ground.receiveShadow = true;
  group.add(ground);

  // Front garden path + car space (west side, matches "Car Space" on plan)
  const g = zone('garden');
  const path = new THREE.Mesh(new THREE.PlaneGeometry(1.4, g.to - g.from), paversMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(0.6, 0.01, mid(g));
  group.add(path);
  const carSpace = new THREE.Mesh(new THREE.PlaneGeometry(2.8, g.to - g.from - 1), gravelMat);
  carSpace.rotation.x = -Math.PI / 2;
  carSpace.position.set(X0 - 1.6, 0.01, mid(g) + 0.3);
  group.add(carSpace);

  // Front hedges along the street boundary
  function hedgeRow(x1, x2, z, h = 0.7) {
    const w = Math.abs(x2 - x1);
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.5), hedgeMat);
    hedge.position.set((x1 + x2) / 2, h / 2, z);
    hedge.castShadow = true; hedge.receiveShadow = true;
    group.add(hedge);
  }
  hedgeRow(X0 - 3.4, X0 - 2.2, 0.3);
  hedgeRow(X0 + 1.2, heritageEastX + 3.2, 0.3);
  hedgeRow(heritageEastX + 0.6, heritageEastX + 3.4, 2.2, 1.1);

  // A small ornamental tree near the porch (matches street photo)
  (function frontTree() {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.6, 8), palmTrunkMat);
    trunk.position.set(heritageEastX - 1.6, 0.8, 2.6);
    group.add(trunk);
    const foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), hedgeMat);
    foliage.position.set(heritageEastX - 1.6, 2.0, 2.6);
    foliage.castShadow = true;
    group.add(foliage);
  })();

  // =======================================================================
  // HERITAGE WING (verandah + 4 bedrooms + wet core) — brick, gable roof
  // =======================================================================
  const heritageFrom = zone('verandah').to; // 7 (front wall line)
  const heritageDepth = HERITAGE_END - heritageFrom;
  const heritageCenterZ = heritageFrom + heritageDepth / 2;
  const heritageCenterX = (X0 + heritageEastX) / 2;

  // Perimeter walls as a hollow box: build as 4 thin walls instead of solid box,
  // simpler + lets us punch the verandah opening at the front.
  const wallThk = 0.25;
  // Back wall (adjoins wet-core, at HERITAGE_END) - shared with modern wing, skip (open plan)
  // West wall (long)
  mkBox(X0 + wallThk / 2, FLOOR_Y + WALL_H / 2, heritageCenterZ, wallThk, WALL_H, heritageDepth, brickMat);
  // East wall (long)
  mkBox(heritageEastX - wallThk / 2, FLOOR_Y + WALL_H / 2, heritageCenterZ, wallThk, WALL_H, heritageDepth, brickMat);
  // Front wall (with door gap) — two piers either side of a central entry
  const frontWallZ = heritageFrom;
  mkBox(heritageCenterX - 2.0, FLOOR_Y + WALL_H / 2, frontWallZ + wallThk / 2, LOT.heritageWidth - 4.0, WALL_H, wallThk, brickMat);
  mkBox(heritageCenterX + 2.6, FLOOR_Y + WALL_H / 2, frontWallZ + wallThk / 2, 2.0, WALL_H, wallThk, brickMat);
  // door head above the entry gap, and a timber front door filling it
  mkBox(heritageCenterX + 0.9, FLOOR_Y + WALL_H - 0.35, frontWallZ + wallThk / 2, 1.6, 0.7, wallThk, brickMat);
  mkBox(heritageCenterX + 0.9, FLOOR_Y + 1.05, frontWallZ + wallThk / 2, 1.1, 2.1, 0.08, new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.6 }));

  // Bay window projecting from bedroom4 (left of entry, matches street photo)
  const bayZ = mid(zone('bedroom4'));
  const bayW = 2.6, bayD = 0.7;
  mkBox(heritageCenterX - 2.0, FLOOR_Y + 1.1, frontWallZ - bayD / 2, bayW, 2.2, bayD, brickMat);
  for (let i = -1; i <= 1; i++) {
    mkBox(heritageCenterX - 2.0 + i * (bayW / 3), FLOOR_Y + 1.5, frontWallZ - bayD + 0.02, bayW / 3 - 0.15, 1.1, 0.03, glassMat);
  }
  mkBox(heritageCenterX - 2.0, FLOOR_Y + 2.25, frontWallZ - bayD / 2, bayW + 0.2, 0.15, bayD + 0.2, roofTileMat);

  // Sash windows along the side walls (white trim + glass), one per bedroom
  function sideWindow(sideX, z, facingEast) {
    const frameX = sideX + (facingEast ? -0.02 : 0.02);
    mkBox(frameX, FLOOR_Y + 1.7, z, 0.06, 1.3, 1.1, windowFrameMat);
    mkBox(frameX + (facingEast ? -0.03 : 0.03), FLOOR_Y + 1.7, z, 0.03, 1.1, 0.9, glassMat);
  }
  sideWindow(X0, mid(zone('bedroom3')), false);
  sideWindow(X0, mid(zone('bedroom2')), false);
  sideWindow(X0, mid(zone('bedroom1')), false);
  sideWindow(heritageEastX, mid(zone('bedroom3')) - 0.6, true);
  sideWindow(heritageEastX, mid(zone('bedroom1')), true);

  // Internal partition walls between bedrooms (light, thin) for readability from above
  ['bedroom4', 'bedroom3', 'bedroom2', 'bedroom1'].forEach((name, idx, arr) => {
    if (idx === arr.length - 1) return;
    const z = zone(name).to;
    mkBox(heritageCenterX, FLOOR_Y + WALL_H / 2, z, LOT.heritageWidth - wallThk * 2, WALL_H - 0.4, 0.12, renderMat);
  });

  // Floor slabs (hallway timber floor peeking above ground line)
  mkBox(heritageCenterX, FLOOR_Y - 0.05, heritageCenterZ, LOT.heritageWidth, 0.1, heritageDepth, hallwayFloorMat);

  // Ceiling / roof structure -------------------------------------------------
  const eaveY = FLOOR_Y + WALL_H + 0.15;
  const ridgeH = 2.4;
  const roofDepth = heritageDepth + 0.6;
  const roofZ = heritageCenterZ;
  {
    const shape = new THREE.Shape();
    const halfW = LOT.heritageWidth / 2 + 0.5;
    shape.moveTo(-halfW, 0);
    shape.lineTo(0, ridgeH);
    shape.lineTo(halfW, 0);
    shape.lineTo(-halfW, 0);
    const extrude = new THREE.ExtrudeGeometry(shape, { depth: roofDepth, bevelEnabled: false });
    extrude.translate(heritageCenterX, eaveY, roofZ - roofDepth / 2);
    const roof = new THREE.Mesh(extrude, roofTileMat);
    roof.castShadow = true; roof.receiveShadow = true;
    group.add(roof);

    // Gable-end infill (closes the triangular eave opening so the front/rear
    // elevations read as solid walls rather than a hollow tent).
    const gableMat = new THREE.MeshStandardMaterial({ map: brickTexture(THREE), roughness: 0.9, side: THREE.DoubleSide });
    const gableGeo = new THREE.ShapeGeometry(shape);
    const gableFront = new THREE.Mesh(gableGeo, gableMat);
    gableFront.position.set(heritageCenterX, eaveY, frontWallZ + wallThk);
    gableFront.castShadow = true;
    group.add(gableFront);
    const gableBack = new THREE.Mesh(gableGeo, gableMat);
    gableBack.position.set(heritageCenterX, eaveY, HERITAGE_END - 0.2);
    group.add(gableBack);
  }

  // Verandah (return bullnose roof, posts, deck) over Z 5-7
  const vz = zone('verandah');
  const vDepth = vz.to - vz.from;
  const verandahDeckY = FLOOR_Y - 0.05;
  mkBox(heritageCenterX, verandahDeckY, mid(vz), LOT.heritageWidth - 1.0, 0.1, vDepth, timberDeckMat);
  const postXs = [heritageCenterX - (LOT.heritageWidth - 1.0) / 2 + 0.15, heritageCenterX + (LOT.heritageWidth - 1.0) / 2 - 0.15];
  postXs.forEach(px => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 12), postMat);
    post.position.set(px, FLOOR_Y + 1.3, vz.from + 0.1);
    post.castShadow = true;
    group.add(post);
  });
  // bullnose verandah roof (curved skillion, approximated with a bent plane)
  {
    const curve = new THREE.Shape();
    curve.moveTo(-LOT.heritageWidth / 2 - 0.3, 0);
    curve.quadraticCurveTo(0, 0.9, LOT.heritageWidth / 2 + 0.3, 0);
    const pts = curve.getPoints(12);
    const roofGeo = new THREE.BufferGeometry();
    const positions = [];
    const d0 = vz.from - 0.4, d1 = vz.to + 0.1;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      positions.push(
        heritageCenterX + a.x, eaveY - 1.0 + a.y, d0,
        heritageCenterX + b.x, eaveY - 1.0 + b.y, d0,
        heritageCenterX + a.x, eaveY - 1.0 + a.y, d1,
        heritageCenterX + b.x, eaveY - 1.0 + b.y, d0,
        heritageCenterX + b.x, eaveY - 1.0 + b.y, d1,
        heritageCenterX + a.x, eaveY - 1.0 + a.y, d1,
      );
    }
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    roofGeo.computeVertexNormals();
    const vRoof = new THREE.Mesh(roofGeo, verandahRoofMat);
    vRoof.castShadow = true; vRoof.receiveShadow = true;
    group.add(vRoof);
  }
  // steps down to the path
  mkBox(heritageCenterX + 0.9, FLOOR_Y - 0.2, vz.from - 0.15, 1.4, 0.15, 0.35, poolCopingMat);

  // Chimneys (two, poking through the gable roof)
  function chimney(z) {
    const cx = heritageCenterX + LOT.heritageWidth * 0.28;
    const stack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), brickMat);
    stack.position.set(cx, eaveY + 1.0, z);
    stack.castShadow = true;
    group.add(stack);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.62), chimneyCapMat);
    cap.position.set(cx, eaveY + 1.82, z);
    group.add(cap);
  }
  chimney(zone('bedroom4').to - 0.4);
  chimney(zone('bedroom2').from + 0.6);

  // Attic storage dormer hint (small box breaking the roofline near bedroom1)
  mkBox(heritageCenterX, eaveY + 0.5, zone('bedroom1').from + 1.2, 1.6, 1.0, 2.0, renderMat);

  // =======================================================================
  // WET CORE (bath/laundry/powder + lightcourt) — transition zone
  // =======================================================================
  const wc = zone('wetcore');
  const wcCenterZ = mid(wc);
  mkBox(heritageCenterX, FLOOR_Y + MODERN_WALL_H / 2, wc.to, LOT.heritageWidth, MODERN_WALL_H, wallThk, renderMat);
  mkBox(X0 + wallThk / 2, FLOOR_Y + MODERN_WALL_H / 2, wcCenterZ, wallThk, MODERN_WALL_H, wc.to - wc.from, brickMat);
  // flat roof over wet core
  mkBox(heritageCenterX, eaveY + 0.1, wcCenterZ, LOT.heritageWidth, 0.2, wc.to - wc.from, roofFlatMat);

  // Lightcourt: a narrow open slot on the east edge running from wet-core to living
  const lightcourtW = 1.0;
  const lightcourtX = heritageEastX - lightcourtW / 2;
  const lightcourtFrom = wc.from;
  const lightcourtTo = zone('living').to;
  {
    const wallH = MODERN_WALL_H;
    const lcWallMat = renderDarkMat;
    // low white walls either side of the lightcourt slot
    mkBox(heritageEastX - lightcourtW, FLOOR_Y + wallH / 2, (lightcourtFrom + lightcourtTo) / 2, 0.1, wallH, lightcourtTo - lightcourtFrom, lcWallMat);
    const paver = new THREE.Mesh(new THREE.PlaneGeometry(lightcourtW, lightcourtTo - lightcourtFrom), paversMat);
    paver.rotation.x = -Math.PI / 2;
    paver.position.set(lightcourtX, FLOOR_Y - 0.04, (lightcourtFrom + lightcourtTo) / 2);
    group.add(paver);
    // a slim potted tree in the lightcourt (from the breezeway photo)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.0, 8), palmTrunkMat);
    trunk.position.set(lightcourtX, FLOOR_Y + 1.0, wc.to + 0.8);
    group.add(trunk);
    const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 8), palmFrondMat);
    foliage.position.set(lightcourtX, FLOOR_Y + 2.2, wc.to + 0.8);
    group.add(foliage);
  }

  // =======================================================================
  // MODERN PAVILION — kitchen / dining / living, wider glass box
  // =======================================================================
  const modernFrom = wc.to;
  const modernTo = zone('living').to;
  const modernCenterZ = (modernFrom + modernTo) / 2;
  const modernCenterX = (X0 + modernEastX) / 2;
  const modernDepth = modernTo - modernFrom;

  // west wall (kitchen bench side, solid render)
  mkBox(X0 + wallThk / 2, FLOOR_Y + MODERN_WALL_H / 2, modernCenterZ, wallThk, MODERN_WALL_H, modernDepth, renderMat);
  // east wall stops at the lightcourt inner wall (already built above as the lightcourt divider)
  // floor slab
  mkBox(modernCenterX, FLOOR_Y - 0.05, modernCenterZ, LOT.modernWidth, 0.1, modernDepth, hallwayFloorMat);
  // flat roof
  mkBox(modernCenterX, eaveY + 0.1, modernCenterZ, LOT.modernWidth, 0.2, modernDepth, roofFlatMat);
  // skylight strip over kitchen (matches photo of the raking skylight above the island)
  mkBox(modernCenterX - 1.0, eaveY + 0.12, mid(zone('kitchen')), 2.0, 0.05, 1.4, glassMat);

  // Full-height glazing on the east edge (living/dining opening to lightcourt side is closed;
  // the real glazing opens south to the alfresco — modelled as a glass end-wall at modernTo)
  mkBox(modernCenterX, FLOOR_Y + MODERN_WALL_H / 2, modernTo - 0.03, LOT.modernWidth - 0.4, MODERN_WALL_H - 0.2, 0.05, glassMat);
  // slim mullions
  for (let i = -1; i <= 1; i++) {
    mkBox(modernCenterX + i * (LOT.modernWidth - 0.4) / 3, FLOOR_Y + MODERN_WALL_H / 2, modernTo - 0.02, 0.05, MODERN_WALL_H - 0.2, 0.06, windowFrameMat);
  }

  // Kitchen island block (interior hint, visible through glazing)
  mkBox(modernCenterX - 0.5, FLOOR_Y + 0.45, mid(zone('kitchen')), 2.6, 0.9, 1.1, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
  // Living/dining furniture hints
  mkBox(modernCenterX, FLOOR_Y + 0.25, mid(zone('dining')), 2.2, 0.5, 1.0, new THREE.MeshStandardMaterial({ color: 0x8a6a45 }));
  mkBox(modernCenterX - 1.2, FLOOR_Y + 0.25, mid(zone('living')) - 1.0, 2.4, 0.5, 1.1, new THREE.MeshStandardMaterial({ color: 0xb9ab95 }));

  // =======================================================================
  // REAR ALFRESCO — undercover timber-batten pergola + open paving
  // =======================================================================
  const uc = zone('undercover');
  const af = zone('alfresco');
  const alfrescoFrom = uc.from, alfrescoTo = af.to;
  const alfrescoCenterZ = (alfrescoFrom + alfrescoTo) / 2;

  const alfrescoPaving = new THREE.Mesh(new THREE.PlaneGeometry(LOT.modernWidth, alfrescoTo - alfrescoFrom), paversMat);
  alfrescoPaving.rotation.x = -Math.PI / 2;
  alfrescoPaving.position.set(modernCenterX, FLOOR_Y - 0.04, alfrescoCenterZ);
  group.add(alfrescoPaving);

  // side privacy walls (rendered, matches photo of tall white side walls)
  mkBox(X0 + wallThk / 2, FLOOR_Y + 1.6, alfrescoCenterZ, wallThk, 3.2, alfrescoTo - alfrescoFrom, renderMat);
  mkBox(modernEastX - wallThk / 2, FLOOR_Y + 1.6, alfrescoCenterZ, wallThk, 3.2, alfrescoTo - alfrescoFrom, renderMat);

  // cantilevered timber batten sunshade box over the undercover zone
  const battenGroup = new THREE.Group();
  const nBattens = 22;
  for (let i = 0; i < nBattens; i++) {
    const bx = X0 + 0.3 + (i / (nBattens - 1)) * (LOT.modernWidth - 0.6);
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, uc.to - uc.from + 0.4), timberBattenMat);
    slat.position.set(bx, eaveY + 0.9, mid(uc));
    slat.castShadow = true;
    battenGroup.add(slat);
  }
  group.add(battenGroup);
  mkBox(modernCenterX, eaveY + 1.6, mid(uc), LOT.modernWidth, 0.15, uc.to - uc.from + 0.4, roofFlatMat);

  // outdoor table + BBQ + pool pump enclosure
  mkBox(modernCenterX, FLOOR_Y + 0.4, mid(af), 2.0, 0.75, 0.9, new THREE.MeshStandardMaterial({ color: 0x6b5a3f }));
  mkBox(modernEastX - 0.7, FLOOR_Y + 0.45, af.from + 0.3, 0.8, 0.9, 0.6, new THREE.MeshStandardMaterial({ color: 0x555555 }));
  mkBox(modernEastX - 0.5, FLOOR_Y + 0.35, af.to - 0.3, 0.5, 0.7, 0.5, new THREE.MeshStandardMaterial({ color: 0x777777 }));

  // =======================================================================
  // POOL + SPA
  // =======================================================================
  const spa = zone('spa');
  const pool = zone('pool');
  const poolCenterZ = mid(pool);
  const poolWidth = LOT.modernWidth - 1.6;
  const basinFrom = spa.from, basinTo = pool.to;
  const DECK_Y = FLOOR_Y - 0.05;   // paved deck level, flush with the rest of the site
  const COPING_TOP = DECK_Y;       // coping sits flush with the surrounding paving
  const WATER_TOP = DECK_Y - 0.12; // water recessed slightly below the deck

  // paved surround either side of the pool/spa (left as two strips so the
  // basin itself stays open and visible, instead of one solid slab over it)
  const sideStripW = (LOT.modernWidth - poolWidth) / 2;
  [-1, 1].forEach(side => {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(sideStripW, basinTo - basinFrom + 1.0), paversMat);
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(modernCenterX + side * (poolWidth / 2 + sideStripW / 2), DECK_Y, (basinFrom + basinTo) / 2);
    group.add(strip);
  });

  // pool coping: a thin flush frame around the water (front/back edges only —
  // the side strips above already border the long edges)
  mkBox(modernCenterX, COPING_TOP - 0.03, pool.from - 0.1, poolWidth + 0.3, 0.06, 0.2, poolCopingMat);
  mkBox(modernCenterX, COPING_TOP - 0.03, pool.to + 0.1, poolWidth + 0.3, 0.06, 0.2, poolCopingMat);
  const poolWater = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, 0.06, pool.to - pool.from), poolWaterMat);
  poolWater.position.set(modernCenterX, WATER_TOP, poolCenterZ);
  group.add(poolWater);

  // spa (narrower, tucked against the pool, same recessed water treatment)
  const spaW = poolWidth * 0.5;
  mkBox(modernCenterX, COPING_TOP - 0.03, spa.from - 0.1, spaW + 0.2, 0.06, 0.2, poolCopingMat);
  // side infill either side of the narrower spa (fills the gap to the wide side strips)
  [-1, 1].forEach(side => {
    mkBox(modernCenterX + side * (spaW / 2 + (poolWidth - spaW) / 4), DECK_Y - 0.005, mid(spa), (poolWidth - spaW) / 2, 0.01, spa.to - spa.from, poolCopingMat);
  });
  const spaWater = new THREE.Mesh(new THREE.BoxGeometry(spaW, 0.06, spa.to - spa.from), poolWaterMat);
  spaWater.position.set(modernCenterX, WATER_TOP + 0.03, mid(spa));
  group.add(spaWater);

  // frameless glass pool fence
  function glassFencePanel(x, z, w, rotY = 0) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(w, 1.05, 0.04), glassMat);
    panel.position.set(x, FLOOR_Y + 0.55, z);
    panel.rotation.y = rotY;
    group.add(panel);
  }
  glassFencePanel(modernCenterX - poolWidth / 2 - 0.05, poolCenterZ, pool.to - pool.from, Math.PI / 2);
  glassFencePanel(modernCenterX + poolWidth / 2 + 0.05, poolCenterZ, pool.to - pool.from, Math.PI / 2);
  glassFencePanel(modernCenterX, pool.to + 0.05, poolWidth);

  // rendered rear boundary wall with uplights + palms (matches pool photo)
  mkBox(modernCenterX, FLOOR_Y + 1.2, pool.to + 0.3, LOT.modernWidth + 1, 2.4, 0.2, renderMat);
  [-1, 0, 1].forEach(i => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 3.4 + i, 8), palmTrunkMat);
    trunk.position.set(modernCenterX + i * (poolWidth / 2.2), FLOOR_Y + 1.7 + i * 0.4, pool.to + 0.6 - i * 0.3);
    trunk.rotation.z = i * 0.08;
    group.add(trunk);
    for (let f = 0; f < 6; f++) {
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.3, 4), palmFrondMat);
      frond.position.copy(trunk.position);
      frond.position.y += 1.6 + i * 0.4;
      frond.rotation.z = (f / 6) * Math.PI * 2;
      frond.rotation.x = Math.PI / 2.6;
      group.add(frond);
    }
  });

  // lawn strip beside the pool (west side, matches photo)
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(1.2, pool.to - pool.from), grassMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(X0 - 0.7, FLOOR_Y - 0.03, poolCenterZ);
  group.add(lawn);

  // =======================================================================
  // REAR LANEWAY
  // =======================================================================
  const lane = zone('laneway');
  const laneMesh = new THREE.Mesh(new THREE.PlaneGeometry(LOT.modernWidth + 4, lane.to - lane.from), laneAsphaltMat);
  laneMesh.rotation.x = -Math.PI / 2;
  laneMesh.position.set(modernCenterX, 0.01, mid(lane));
  group.add(laneMesh);
  mkBox(modernCenterX, FLOOR_Y + 0.9, lane.from, LOT.modernWidth + 1, 1.8, 0.15, boundaryFenceMat);

  return group;
}
