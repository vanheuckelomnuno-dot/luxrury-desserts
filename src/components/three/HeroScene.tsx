'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

/* ── helpers ──────────────────────────────────────────────────── */
function m(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos?: [number, number, number],
  rot?: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, mat)
  if (pos) mesh.position.set(pos[0], pos[1], pos[2])
  if (rot) mesh.rotation.set(rot[0], rot[1], rot[2])
  return mesh
}

/* ── luxury materials ─────────────────────────────────────────── */
function makeMats() {
  // White velvet fondant — smooth clearcoat + soft sheen
  const fondant = new THREE.MeshPhysicalMaterial({
    color: 0xFFFEFB,
    roughness: 0.14,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    sheen: 0.5,
    sheenRoughness: 0.28,
    sheenColor: new THREE.Color(0xFFF4E0),
  })
  // Gold trim — 24-karat look
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xD4AF37,
    metalness: 1.0,
    roughness: 0.03,
    emissive: new THREE.Color(0xC49B28),
    emissiveIntensity: 0.1,
  })
  // Rose-gold accent
  const roseGold = new THREE.MeshPhysicalMaterial({
    color: 0xE8A090,
    metalness: 0.95,
    roughness: 0.05,
    emissive: new THREE.Color(0xD08070),
    emissiveIntensity: 0.08,
  })
  // Polished silver stand
  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xF5F5F0,
    metalness: 0.9,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  })
  // Translucent sugar flower petals (SSS)
  const petal = (hex: number) => new THREE.MeshPhysicalMaterial({
    color: hex,
    roughness: 0.32,
    metalness: 0.0,
    transmission: 0.22,
    thickness: 0.18,
    ior: 1.42,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    side: THREE.DoubleSide,
  })
  // Cream piping
  const cream = new THREE.MeshPhysicalMaterial({
    color: 0xFFF8F0,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  })
  // Pearl
  const pearl = new THREE.MeshPhysicalMaterial({
    color: 0xFFF5EC,
    roughness: 0.08,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xFFE4D0),
  })
  // Mirror-polished plate
  const mirror = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 0.7,
    roughness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
  })
  return { fondant, gold, roseGold, silver, petal, cream, pearl, mirror }
}

/* ── sugar rose ───────────────────────────────────────────────── */
function rose(petalMat: THREE.Material, leafMat: THREE.Material, scale = 1): THREE.Group {
  const g = new THREE.Group()
  // Bud
  g.add(m(new THREE.SphereGeometry(0.055 * scale, 10, 10), petalMat))
  // Inner ring (5 petals)
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 8, 8), petalMat)
    p.scale.set(0.35, 1.35, 0.35)
    const a = (i / 5) * Math.PI * 2
    p.position.set(Math.cos(a) * 0.07 * scale, 0.04 * scale, Math.sin(a) * 0.07 * scale)
    p.rotation.set(-Math.sin(a) * 0.4, 0, Math.cos(a) * 0.4)
    g.add(p)
  }
  // Middle ring (8 petals)
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.085 * scale, 8, 8), petalMat)
    p.scale.set(0.42, 1.55, 0.42)
    const a = (i / 8) * Math.PI * 2 + 0.35
    p.position.set(Math.cos(a) * 0.145 * scale, 0.01 * scale, Math.sin(a) * 0.145 * scale)
    p.rotation.set(-Math.sin(a) * 0.52, 0, Math.cos(a) * 0.52)
    g.add(p)
  }
  // Outer ring (13 petals)
  for (let i = 0; i < 13; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.095 * scale, 8, 8), petalMat)
    p.scale.set(0.48, 1.65, 0.48)
    const a = (i / 13) * Math.PI * 2 + 0.65
    p.position.set(Math.cos(a) * 0.23 * scale, -0.04 * scale, Math.sin(a) * 0.23 * scale)
    p.rotation.set(-Math.sin(a) * 0.62, 0, Math.cos(a) * 0.62)
    g.add(p)
  }
  // Leaves
  for (let i = 0; i < 4; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.065 * scale, 6, 6), leafMat)
    leaf.scale.set(0.28, 1.7, 0.28)
    const a = (i / 4) * Math.PI * 2
    leaf.position.set(Math.cos(a) * 0.29 * scale, -0.19 * scale, Math.sin(a) * 0.29 * scale)
    leaf.rotation.set(-Math.sin(a) * 0.66, 0, Math.cos(a) * 0.66)
    g.add(leaf)
  }
  return g
}

/* ── gold drip ────────────────────────────────────────────────── */
function drip(cx: number, cz: number, len: number, mat: THREE.Material): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cx, 0, cz),
    new THREE.Vector3(cx * 1.012, -len * 0.45, cz * 1.012),
    new THREE.Vector3(cx * 1.02, -len * 0.82, cz * 1.02),
    new THREE.Vector3(cx * 1.015, -len, cz * 1.015),
  ])
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.02, 6), mat)
}

/* ── cream piping ring ────────────────────────────────────────── */
function pipingRing(radius: number, y: number, mat: THREE.Material, count = 32): THREE.Group {
  const g = new THREE.Group()
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), mat)
    ball.scale.set(0.9, 1.1, 0.9)
    ball.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius)
    g.add(ball)
  }
  return g
}

/* ── quilted diamond dots ─────────────────────────────────────── */
function quiltDots(tierRadius: number, startY: number, endY: number, mat: THREE.Material): THREE.Group {
  const g = new THREE.Group()
  const rows = 5, cols = 28
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1)
    const y = startY + t * (endY - startY)
    for (let col = 0; col < cols; col++) {
      const a = (col / cols) * Math.PI * 2 + (row % 2) * (Math.PI / cols)
      const dot = new THREE.Mesh(new THREE.OctahedronGeometry(0.022, 0), mat)
      dot.position.set(Math.cos(a) * (tierRadius + 0.01), y, Math.sin(a) * (tierRadius + 0.01))
      dot.rotation.y = a
      g.add(dot)
    }
  }
  return g
}

/* ── main component ───────────────────────────────────────────── */
export default function HeroScene({
  mousePosition,
  paused = false,
}: {
  mousePosition: { x: number; y: number }
  paused?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef(mousePosition)
  const pausedRef = useRef(paused)

  useEffect(() => { mouseRef.current = mousePosition }, [mousePosition])
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth || window.innerWidth
    const h = el.clientHeight || window.innerHeight

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.45
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.background = 'transparent'
    el.appendChild(renderer.domElement)

    /* scene + camera */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100)
    camera.position.set(0, 1.2, 9.5)

    const { fondant, gold, roseGold, silver, petal, cream, pearl, mirror } = makeMats()
    const leafMat = new THREE.MeshPhysicalMaterial({ color: 0x3D6B45, roughness: 0.65, side: THREE.DoubleSide })

    /* ── CAKE STAND / PEDESTAL ─────────────────────────────────── */
    const stand = new THREE.Group()
    // Octagonal base
    stand.add(m(new THREE.CylinderGeometry(1.65, 1.8, 0.12, 8), silver, [0, -2.42, 0]))
    stand.add(m(new THREE.TorusGeometry(1.72, 0.038, 8, 8), gold, [0, -2.37, 0]))
    // Column
    stand.add(m(new THREE.CylinderGeometry(0.22, 0.28, 0.55, 16), silver, [0, -2.13, 0]))
    stand.add(m(new THREE.SphereGeometry(0.28, 14, 14), silver, [0, -1.88, 0]))
    // Top serving plate
    stand.add(m(new THREE.CylinderGeometry(1.95, 1.85, 0.09, 64), mirror, [0, -1.68, 0]))
    stand.add(m(new THREE.TorusGeometry(1.9, 0.048, 8, 64), gold, [0, -1.64, 0]))
    scene.add(stand)

    /* ── CAKE ────────────────────────────────────────────────────── */
    const cake = new THREE.Group()
    scene.add(cake)

    // ── TIER 1 (bottom, Ø1.72) ─────────────────────────────────
    const t1 = new THREE.Group()
    t1.add(m(new THREE.CylinderGeometry(1.72, 1.72, 1.35, 64), fondant, [0, -1.285, 0]))
    // Quilted gold dots
    t1.add(quiltDots(1.72, -1.9, -0.55, gold))
    // Ruffle skirt
    for (let i = 0; i < 11; i++) {
      const t = i / 10
      t1.add(m(new THREE.TorusGeometry(1.74 + t * 0.14, 0.055 + t * 0.02, 8, 64),
        new THREE.MeshPhysicalMaterial({ color: 0xFFFCF6, roughness: 0.14, clearcoat: 0.8 }),
        [0, -1.92 + i * 0.12, 0]))
    }
    // Piping ring at top of tier
    t1.add(pipingRing(1.74, -0.6, cream, 36))
    // Gold ribbon
    t1.add(m(new THREE.TorusGeometry(1.74, 0.042, 8, 64), gold, [0, -0.66, 0]))
    // Gold drips
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2
      const len = 0.1 + Math.abs(Math.sin(i * 1.31)) * 0.1
      const d = drip(Math.cos(a) * 1.71, Math.sin(a) * 1.71, len, gold)
      d.position.y = -0.61
      t1.add(d)
    }
    // Pearl border at base of drips
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2
      t1.add(m(new THREE.SphereGeometry(0.024, 7, 7), pearl, [Math.cos(a) * 1.74, -0.56, Math.sin(a) * 1.74]))
    }
    cake.add(t1)

    // ── PILLARS tier 1→2 (4 pillars) ──────────────────────────
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2
      const pg = new THREE.Group()
      pg.position.set(Math.cos(a) * 0.88, -0.3, Math.sin(a) * 0.88)
      pg.add(m(new THREE.CylinderGeometry(0.065, 0.065, 0.5, 12), gold))
      pg.add(m(new THREE.SphereGeometry(0.088, 10, 10), gold, [0, 0.29, 0]))
      pg.add(m(new THREE.SphereGeometry(0.088, 10, 10), gold, [0, -0.29, 0]))
      cake.add(pg)
    }

    // ── TIER 2 (middle, Ø1.12) ────────────────────────────────
    const t2 = new THREE.Group()
    t2.add(m(new THREE.CylinderGeometry(1.12, 1.12, 1.05, 64), fondant, [0, 0.525, 0]))
    // Vertical lace columns (elongated pearls)
    for (let col = 0; col < 22; col++) {
      const a = (col / 22) * Math.PI * 2
      for (let row = 0; row < 4; row++) {
        const y = 0.05 + row * 0.24
        t2.add(m(new THREE.SphereGeometry(0.019, 7, 7), pearl, [Math.cos(a) * 1.13, y, Math.sin(a) * 1.13]))
      }
    }
    // Gold diamond accents
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.048, 0), roseGold)
      d.position.set(Math.cos(a) * 1.13, 0.52, Math.sin(a) * 1.13)
      d.rotation.y = a
      t2.add(d)
    }
    // Piping ring
    t2.add(pipingRing(1.13, 1.06, cream, 28))
    // Gold ribbon + drips
    t2.add(m(new THREE.TorusGeometry(1.13, 0.036, 8, 64), gold, [0, 1.01, 0]))
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      const len = 0.08 + Math.abs(Math.sin(i * 1.7)) * 0.08
      const d = drip(Math.cos(a) * 1.11, Math.sin(a) * 1.11, len, gold)
      d.position.y = 1.06
      t2.add(d)
    }
    cake.add(t2)

    // ── PILLARS tier 2→3 (3 pillars) ──────────────────────────
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2
      const pg = new THREE.Group()
      pg.position.set(Math.cos(a) * 0.52, 1.22, Math.sin(a) * 0.52)
      pg.add(m(new THREE.CylinderGeometry(0.052, 0.052, 0.32, 10), gold))
      pg.add(m(new THREE.SphereGeometry(0.072, 8, 8), gold, [0, 0.2, 0]))
      pg.add(m(new THREE.SphereGeometry(0.072, 8, 8), gold, [0, -0.2, 0]))
      cake.add(pg)
    }

    // ── TIER 3 (top, Ø0.65) ───────────────────────────────────
    const t3 = new THREE.Group()
    t3.add(m(new THREE.CylinderGeometry(0.65, 0.65, 0.9, 64), fondant, [0, 1.87, 0]))
    // Pearl chain
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2
      t3.add(m(new THREE.SphereGeometry(0.022, 8, 8), pearl, [Math.cos(a) * 0.66, 1.6, Math.sin(a) * 0.66]))
    }
    // Piping ring
    t3.add(pipingRing(0.66, 2.34, cream, 18))
    // Ribbon + drips
    t3.add(m(new THREE.TorusGeometry(0.66, 0.03, 8, 64), gold, [0, 2.29, 0]))
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const len = 0.07 + Math.abs(Math.sin(i * 2.1)) * 0.05
      const d = drip(Math.cos(a) * 0.64, Math.sin(a) * 0.64, len, gold)
      d.position.y = 2.34
      t3.add(d)
    }
    cake.add(t3)

    // ── SUGAR FLOWERS (top arrangement) ──────────────────────
    const pinkPetal  = petal(0xFFD6E0)
    const blushPetal = petal(0xFFB8C4)
    const creamPetal = petal(0xFFF5E8)
    const softPetal  = petal(0xFFCDD5)
    const palePetal  = petal(0xFFE8EE)

    // Main large rose
    const mainRose = rose(pinkPetal, leafMat, 1.15)
    mainRose.position.set(0, 2.44, 0)
    cake.add(mainRose)
    // Inner ring (5 medium)
    const innerPetals = [blushPetal, creamPetal, softPetal, pinkPetal, palePetal]
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const r = rose(innerPetals[i], leafMat, 0.68)
      r.position.set(Math.cos(a) * 0.42, 2.38, Math.sin(a) * 0.42)
      r.rotation.y = a + 0.6
      cake.add(r)
    }
    // Outer ring (8 small)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const r = rose(innerPetals[i % 5], leafMat, 0.36)
      r.position.set(Math.cos(a) * 0.66, 2.32, Math.sin(a) * 0.66)
      r.rotation.y = a
      cake.add(r)
    }
    // Baby's breath — tiny white clusters
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2
      const r = 0.45 + Math.random() * 0.25
      cake.add(m(new THREE.SphereGeometry(0.018, 6, 6),
        new THREE.MeshPhysicalMaterial({ color: 0xFFFDF8, roughness: 0.5 }),
        [Math.cos(a) * r, 2.34 + Math.random() * 0.12, Math.sin(a) * r]))
    }

    // ── GOLD CROWN TOPPER ─────────────────────────────────────
    const topper = new THREE.Group()
    topper.position.set(0, 2.66, 0)
    topper.add(m(new THREE.CylinderGeometry(0.016, 0.016, 0.52, 8), gold))
    topper.add(m(new THREE.SphereGeometry(0.072, 14, 14), gold, [0, 0.32, 0]))
    // Star rays
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const ray = m(new THREE.CylinderGeometry(0.006, 0.001, 0.16, 5), gold)
      ray.position.set(Math.cos(a) * 0.1, 0.32, Math.sin(a) * 0.1)
      ray.rotation.z = Math.cos(a + Math.PI / 2) * 0.72
      ray.rotation.x = Math.sin(a + Math.PI / 2) * 0.72
      topper.add(ray)
    }
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      topper.add(m(new THREE.SphereGeometry(0.016, 8, 8), gold,
        [Math.cos(a) * 0.13, 0.12 + Math.sin(i) * 0.04, Math.sin(a) * 0.13]))
    }
    cake.add(topper)

    // ── ORBITING ELEMENTS ─────────────────────────────────────
    const macaronData = [
      { p: [-3.3, 0.9, -1.0] as [number,number,number], c: 0xFFD6E0, s: 0.55, ph: 0 },
      { p: [3.1, 1.3, -0.6]  as [number,number,number], c: 0xF6EEE3, s: 0.38, ph: 1.2 },
      { p: [-2.9, -0.4, 0.6] as [number,number,number], c: 0xD4AF37, s: 0.65, ph: 2.4 },
      { p: [2.7, -0.7, 1.1]  as [number,number,number], c: 0xFFD6E0, s: 0.48, ph: 0.8 },
      { p: [-1.9, 1.9, 1.3]  as [number,number,number], c: 0xFFFDF8, s: 0.42, ph: 3.1 },
      { p: [2.1, 2.1, -1.6]  as [number,number,number], c: 0xFFD6E0, s: 0.52, ph: 1.8 },
      { p: [-3.6, -1.4, -0.9] as [number,number,number], c: 0xD4AF37, s: 0.6, ph: 4.2 },
      { p: [3.5, 0.3, 1.6]   as [number,number,number], c: 0xF6EEE3, s: 0.36, ph: 5.1 },
    ]
    const macarons = macaronData.map(d => {
      const mat = new THREE.MeshPhysicalMaterial({ color: d.c, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.18 })
      const g = new THREE.Group()
      g.add(m(new THREE.CylinderGeometry(0.31, 0.33, 0.13, 24), mat, [0, 0.13, 0]))
      g.add(m(new THREE.TorusGeometry(0.33, 0.028, 8, 32), mat, [0, 0.065, 0]))
      g.add(m(new THREE.CylinderGeometry(0.3, 0.3, 0.09, 24), new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.55 })))
      g.add(m(new THREE.TorusGeometry(0.33, 0.028, 8, 32), mat, [0, -0.065, 0]))
      g.add(m(new THREE.CylinderGeometry(0.33, 0.31, 0.13, 24), mat, [0, -0.13, 0]))
      g.position.set(...d.p)
      scene.add(g)
      return { g, iy: d.p[1], s: d.s, ph: d.ph }
    })

    // Orbiting mini roses
    const orbitRoses: { g: THREE.Group; angle: number; radius: number; speed: number; iy: number }[] = []
    const orbitColors = [0xFFD6E0, 0xFFB8C4, 0xFFF0E8, 0xFFCDD5]
    for (let i = 0; i < 4; i++) {
      const r = rose(petal(orbitColors[i]), leafMat, 0.22)
      const angle = (i / 4) * Math.PI * 2
      const radius = 3.8 + i * 0.4
      const iy = -0.5 + i * 0.6
      r.position.set(Math.cos(angle) * radius, iy, Math.sin(angle) * radius)
      scene.add(r)
      orbitRoses.push({ g: r, angle, radius, speed: 0.18 + i * 0.04, iy })
    }

    // Floating gold flakes (thin discs)
    const flakePositions = [[-4, 1.5, 0.5], [4, -0.5, -1], [-2, 3, -2], [3, 2.5, 2], [-3.5, -2, 1.5]] as [number,number,number][]
    const flakes = flakePositions.map(pos => {
      const f = m(new THREE.CylinderGeometry(0.12, 0.12, 0.008, 6),
        new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1.0, roughness: 0.03 }),
        pos)
      scene.add(f)
      return { f, iy: pos[1], ph: Math.random() * Math.PI * 2 }
    })

    // ── PARTICLES ─────────────────────────────────────────────
    const mkPts = (n: number, spread: [number,number,number], size: number, opacity: number) => {
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        pos[i*3] = (Math.random()-0.5)*spread[0]
        pos[i*3+1] = (Math.random()-0.5)*spread[1]
        pos[i*3+2] = (Math.random()-0.5)*spread[2]
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(geo, new THREE.PointsMaterial({ size, color: 0xD4AF37, transparent: true, opacity, sizeAttenuation: true }))
    }
    const dust = mkPts(120, [18,14,12], 0.032, 0.48)
    const sparkles = mkPts(55, [15,15,15], 0.072, 0.38)
    scene.add(dust)
    scene.add(sparkles)

    // ── CINEMATIC 5-POINT LIGHTING ────────────────────────────
    scene.add(new THREE.AmbientLight(0xFFF0E6, 0.52))

    // Key: strong warm from upper-left front
    const keyLight = new THREE.SpotLight(0xFFEDD0, 5.5, 38, Math.PI / 5.5, 0.22, 1.4)
    keyLight.position.set(-6, 12, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.near = 2
    keyLight.shadow.camera.far = 38
    scene.add(keyLight)
    scene.add(keyLight.target)

    // Fill: soft blush from right
    const fill = new THREE.DirectionalLight(0xFFD8E0, 1.05)
    fill.position.set(8, 5, -2)
    scene.add(fill)

    // Rim: golden halo from behind
    const rim = new THREE.SpotLight(0xD4AF37, 3.2, 24, Math.PI / 3.2, 0.55, 1.1)
    rim.position.set(2, 5, -10)
    rim.target.position.set(0, 0, 0)
    scene.add(rim)
    scene.add(rim.target)

    // Bounce: warm from below plate
    const bounce = new THREE.PointLight(0xFFE8C8, 1.3, 9)
    bounce.position.set(0, -3.8, 3.5)
    scene.add(bounce)

    // Top: highlights flowers + topper
    const topSpot = new THREE.SpotLight(0xFFFFF0, 2.2, 14, Math.PI / 7.5, 0.38, 2)
    topSpot.position.set(0, 10, 1.5)
    topSpot.target.position.set(0, 2, 0)
    scene.add(topSpot)
    scene.add(topSpot.target)

    // ── ANIMATE ───────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      // Slow elegant cake rotation + subtle float
      cake.rotation.y = t * 0.07
      cake.position.y = Math.sin(t * 0.32) * 0.055

      // Stand subtle sway
      stand.position.y = Math.sin(t * 0.32) * 0.055

      // Topper counter-spin
      topper.rotation.y = -t * 0.18

      // Macarons float
      macarons.forEach(mac => {
        mac.g.rotation.y += mac.s * 0.007
        mac.g.rotation.z = Math.sin(t * 0.48 + mac.ph) * 0.1
        mac.g.position.y = mac.iy + Math.sin(t * 0.82 + mac.ph) * 0.15
      })

      // Orbiting roses
      orbitRoses.forEach(r => {
        r.angle += r.speed * 0.01
        r.g.position.x = Math.cos(r.angle) * r.radius
        r.g.position.z = Math.sin(r.angle) * r.radius
        r.g.position.y = r.iy + Math.sin(t * 0.4 + r.angle) * 0.2
        r.g.rotation.y = r.angle + Math.PI / 2
      })

      // Floating gold flakes
      flakes.forEach((f, i) => {
        f.f.position.y = f.iy + Math.sin(t * 0.5 + f.ph) * 0.3
        f.f.rotation.x = t * 0.3 + f.ph
        f.f.rotation.z = Math.sin(t * 0.2 + f.ph) * 0.5
      })

      // Particles drift
      dust.rotation.y = t * 0.011
      dust.rotation.x = Math.sin(t * 0.005) * 0.07
      sparkles.rotation.y = -t * 0.008
      sparkles.rotation.z = Math.cos(t * 0.004) * 0.04

      // Smooth mouse camera
      camera.position.x += (mouseRef.current.x * 1.0 - camera.position.x) * 0.033
      camera.position.y += (-mouseRef.current.y * 0.65 + 1.2 - camera.position.y) * 0.033
      camera.lookAt(0, 0.5, 0)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!el) return
      const nw = el.clientWidth, nh = el.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
