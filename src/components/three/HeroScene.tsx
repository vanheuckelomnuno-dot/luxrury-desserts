'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function mesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos?: [number, number, number],
  rot?: [number, number, number]
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat)
  if (pos) m.position.set(pos[0], pos[1], pos[2])
  if (rot) m.rotation.set(rot[0], rot[1], rot[2])
  return m
}

function createRose(color: number, size = 1): THREE.Group {
  const g = new THREE.Group()
  const pMat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.45,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
  })
  const leafMat = new THREE.MeshPhysicalMaterial({ color: 0x4a7c59, roughness: 0.7, side: THREE.DoubleSide })

  // Bud center
  g.add(mesh(new THREE.SphereGeometry(0.055 * size, 10, 10), pMat))

  // Inner petals (5)
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.065 * size, 8, 8), pMat)
    p.scale.set(0.38, 1.3, 0.38)
    const a = (i / 5) * Math.PI * 2
    p.position.set(Math.cos(a) * 0.07 * size, 0.04 * size, Math.sin(a) * 0.07 * size)
    p.rotation.z = Math.cos(a) * 0.45
    p.rotation.x = -Math.sin(a) * 0.45
    g.add(p)
  }
  // Middle petals (8)
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.09 * size, 8, 8), pMat)
    p.scale.set(0.45, 1.5, 0.45)
    const a = (i / 8) * Math.PI * 2 + 0.3
    p.position.set(Math.cos(a) * 0.15 * size, 0.01 * size, Math.sin(a) * 0.15 * size)
    p.rotation.z = Math.cos(a) * 0.55
    p.rotation.x = -Math.sin(a) * 0.55
    g.add(p)
  }
  // Outer petals (13)
  for (let i = 0; i < 13; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.1 * size, 8, 8), pMat)
    p.scale.set(0.5, 1.6, 0.5)
    const a = (i / 13) * Math.PI * 2 + 0.6
    p.position.set(Math.cos(a) * 0.24 * size, -0.04 * size, Math.sin(a) * 0.24 * size)
    p.rotation.z = Math.cos(a) * 0.65
    p.rotation.x = -Math.sin(a) * 0.65
    g.add(p)
  }
  // Leaves
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.07 * size, 6, 6), leafMat)
    leaf.scale.set(0.28, 1.6, 0.28)
    const a = (i / 3) * Math.PI * 2
    leaf.position.set(Math.cos(a) * 0.28 * size, -0.18 * size, Math.sin(a) * 0.28 * size)
    leaf.rotation.z = Math.cos(a) * 0.65
    leaf.rotation.x = -Math.sin(a) * 0.65
    g.add(leaf)
  }
  return g
}

function createDrip(
  cx: number, cz: number, len: number,
  mat: THREE.Material
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(cx, 0, cz),
    new THREE.Vector3(cx * 1.015, -len * 0.55, cz * 1.015),
    new THREE.Vector3(cx * 1.02, -len * 0.88, cz * 1.02),
    new THREE.Vector3(cx * 1.01, -len, cz * 1.01),
  ])
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.022, 6, false), mat)
}

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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100)
    camera.position.set(0, 1.5, 9)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.background = 'transparent'
    el.appendChild(renderer.domElement)

    // ── MATERIALS ──────────────────────────────────────────────────
    const fondantMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFEFA,
      roughness: 0.06,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      sheen: 0.4,
      sheenRoughness: 0.15,
      sheenColor: new THREE.Color(0xFFF5E6),
    })
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xD4AF37,
      metalness: 1.0,
      roughness: 0.04,
      emissive: new THREE.Color(0xD4AF37),
      emissiveIntensity: 0.12,
    })
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0.55,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
    const frostingMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.04,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })

    // ── WEDDING CAKE ───────────────────────────────────────────────
    const cake = new THREE.Group()
    scene.add(cake)

    // Serving plate
    cake.add(mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.07, 64), plateMat, [0, -2.06, 0]))
    cake.add(mesh(new THREE.TorusGeometry(2.2, 0.045, 8, 64), goldMat, [0, -2.025, 0]))

    // ── TIER 1 (bottom) ─────────────────────────────────────────
    const t1 = new THREE.Group()
    t1.add(mesh(new THREE.CylinderGeometry(1.75, 1.75, 1.3, 64), fondantMat, [0, -1.25, 0]))
    // Top frosting cap
    t1.add(mesh(new THREE.CylinderGeometry(1.77, 1.77, 0.07, 64), frostingMat, [0, -0.575, 0]))
    // Ruffled skirt — 10 torus rings tapering outward
    for (let i = 0; i < 10; i++) {
      const t = i / 9
      const r = 1.77 + t * 0.12
      const y = -1.9 + i * 0.115
      const thick = 0.055 + t * 0.02
      t1.add(mesh(new THREE.TorusGeometry(r, thick, 8, 64), new THREE.MeshPhysicalMaterial({ color: 0xFFFCF6, roughness: 0.12, clearcoat: 0.7, clearcoatRoughness: 0.1 }), [0, y, 0]))
    }
    // Gold ribbon band
    t1.add(mesh(new THREE.TorusGeometry(1.78, 0.04, 8, 64), goldMat, [0, -0.62, 0]))
    // Gold drips from top of tier 1
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      const len = 0.12 + Math.sin(i * 1.3 + 0.7) * 0.07
      const d = createDrip(Math.cos(a) * 1.74, Math.sin(a) * 1.74, len, goldMat)
      d.position.y = -0.575
      t1.add(d)
    }
    // Lace dots on tier 1
    for (let row = 0; row < 2; row++) {
      const count = 24
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + row * 0.13
        const y = -0.95 + row * 0.3
        t1.add(mesh(new THREE.SphereGeometry(0.018, 6, 6), goldMat, [Math.cos(a) * 1.77, y, Math.sin(a) * 1.77]))
      }
    }
    cake.add(t1)

    // ── PILLARS between tier 1 and 2 ─────────────────────────────
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2
      const pBase = new THREE.Group()
      pBase.position.set(Math.cos(a) * 0.9, -0.38, Math.sin(a) * 0.9)
      pBase.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12), goldMat))
      pBase.add(mesh(new THREE.SphereGeometry(0.09, 10, 10), goldMat, [0, 0.25, 0]))
      pBase.add(mesh(new THREE.SphereGeometry(0.09, 10, 10), goldMat, [0, -0.25, 0]))
      cake.add(pBase)
    }

    // ── TIER 2 (middle) ───────────────────────────────────────────
    const t2 = new THREE.Group()
    t2.add(mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.0, 64), fondantMat, [0, 0.52, 0]))
    t2.add(mesh(new THREE.CylinderGeometry(1.17, 1.17, 0.065, 64), frostingMat, [0, 1.055, 0]))
    // Gold ribbon
    t2.add(mesh(new THREE.TorusGeometry(1.17, 0.035, 8, 64), goldMat, [0, 1.015, 0]))
    // Gold drips
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const len = 0.1 + Math.sin(i * 1.9) * 0.055
      const d = createDrip(Math.cos(a) * 1.13, Math.sin(a) * 1.13, len, goldMat)
      d.position.y = 1.055
      t2.add(d)
    }
    // Floral emboss dots in 2 rows
    for (let row = 0; row < 3; row++) {
      const count = 18
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + row * 0.17
        const y = 0.15 + row * 0.24
        t2.add(mesh(new THREE.SphereGeometry(0.016, 6, 6), goldMat, [Math.cos(a) * 1.16, y, Math.sin(a) * 1.16]))
      }
    }
    // Small gold bows / diamonds
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 0), goldMat)
      diamond.position.set(Math.cos(a) * 1.17, 0.52, Math.sin(a) * 1.17)
      diamond.rotation.y = a
      t2.add(diamond)
    }
    cake.add(t2)

    // ── PILLARS between tier 2 and 3 ─────────────────────────────
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2
      const pBase = new THREE.Group()
      pBase.position.set(Math.cos(a) * 0.55, 1.22, Math.sin(a) * 0.55)
      pBase.add(mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.3, 10), goldMat))
      pBase.add(mesh(new THREE.SphereGeometry(0.07, 8, 8), goldMat, [0, 0.18, 0]))
      pBase.add(mesh(new THREE.SphereGeometry(0.07, 8, 8), goldMat, [0, -0.18, 0]))
      cake.add(pBase)
    }

    // ── TIER 3 (top) ─────────────────────────────────────────────
    const t3 = new THREE.Group()
    t3.add(mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.85, 64), fondantMat, [0, 1.83, 0]))
    t3.add(mesh(new THREE.CylinderGeometry(0.67, 0.67, 0.055, 64), frostingMat, [0, 2.28, 0]))
    t3.add(mesh(new THREE.TorusGeometry(0.67, 0.03, 8, 64), goldMat, [0, 2.245, 0]))
    // Drips on top tier
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const len = 0.08 + Math.sin(i * 2.1) * 0.04
      const d = createDrip(Math.cos(a) * 0.64, Math.sin(a) * 0.64, len, goldMat)
      d.position.y = 2.28
      t3.add(d)
    }
    // Pearl chain
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      t3.add(mesh(new THREE.SphereGeometry(0.022, 8, 8), new THREE.MeshPhysicalMaterial({ color: 0xFFF8F0, roughness: 0.1, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.05 }), [Math.cos(a) * 0.67, 1.6, Math.sin(a) * 0.67]))
    }
    cake.add(t3)

    // ── SUGAR FLOWERS on top ──────────────────────────────────────
    const flowerColors = [0xFFD6E0, 0xFFB6C1, 0xFFC8D5, 0xFF9BAA, 0xFFE4EE]
    // Main large rose
    const mainRose = createRose(0xFFD6E0, 1.1)
    mainRose.position.set(0, 2.35, 0)
    cake.add(mainRose)
    // Ring of roses
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const r = createRose(flowerColors[i % flowerColors.length], 0.62)
      r.position.set(Math.cos(a) * 0.42, 2.29, Math.sin(a) * 0.42)
      r.rotation.y = a + 0.5
      cake.add(r)
    }
    // Tiny accent roses
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const r = createRose(flowerColors[i % flowerColors.length], 0.32)
      r.position.set(Math.cos(a) * 0.65, 2.24, Math.sin(a) * 0.65)
      r.rotation.y = a
      cake.add(r)
    }

    // ── GOLD TOPPER ───────────────────────────────────────────────
    const topper = new THREE.Group()
    topper.position.set(0, 2.62, 0)
    topper.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.55, 8), goldMat))
    topper.add(mesh(new THREE.SphereGeometry(0.075, 14, 14), goldMat, [0, 0.32, 0]))
    // Star rays
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const ray = mesh(new THREE.CylinderGeometry(0.007, 0.001, 0.14, 6), goldMat)
      ray.position.set(Math.cos(a) * 0.09, 0.32, Math.sin(a) * 0.09)
      ray.rotation.z = Math.cos(a + Math.PI / 2) * 0.7
      ray.rotation.x = Math.sin(a + Math.PI / 2) * 0.7
      topper.add(ray)
    }
    // Hanging gold drops
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const drop = mesh(new THREE.SphereGeometry(0.018, 8, 8), goldMat, [Math.cos(a) * 0.12, 0.1, Math.sin(a) * 0.12])
      topper.add(drop)
    }
    cake.add(topper)

    // ── MACARONS ─────────────────────────────────────────────────
    const macaronData = [
      { p: [-3.2, 0.8, -1.0] as [number,number,number], c: 0xFFD6E0, s: 0.6, ph: 0 },
      { p: [3.0, 1.2, -0.5]  as [number,number,number], c: 0xF6EEE3, s: 0.4, ph: 1.2 },
      { p: [-2.8, -0.5, 0.5] as [number,number,number], c: 0xD4AF37, s: 0.7, ph: 2.4 },
      { p: [2.6, -0.8, 1.0]  as [number,number,number], c: 0xFFD6E0, s: 0.5, ph: 0.8 },
      { p: [-1.8, 1.8, 1.2]  as [number,number,number], c: 0xFFFDF8, s: 0.45, ph: 3.1 },
      { p: [2.0, 2.0, -1.5]  as [number,number,number], c: 0xFFD6E0, s: 0.55, ph: 1.8 },
      { p: [-3.5, -1.5, -0.8] as [number,number,number], c: 0xD4AF37, s: 0.65, ph: 4.2 },
      { p: [3.4, 0.2, 1.5]   as [number,number,number], c: 0xF6EEE3, s: 0.38, ph: 5.1 },
    ]
    const macarons = macaronData.map(d => {
      const mat = new THREE.MeshPhysicalMaterial({ color: d.c, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 })
      const g = new THREE.Group()
      g.add(mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.14, 24), mat, [0, 0.14, 0]))
      g.add(mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 32), mat, [0, 0.07, 0]))
      g.add(mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.6 })))
      g.add(mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 32), mat, [0, -0.07, 0]))
      g.add(mesh(new THREE.CylinderGeometry(0.34, 0.32, 0.14, 24), mat, [0, -0.14, 0]))
      g.position.set(...d.p)
      scene.add(g)
      return { g, iy: d.p[1], s: d.s, ph: d.ph }
    })

    // ── PARTICLES ─────────────────────────────────────────────────
    const mkParticles = (count: number, spread: [number,number,number], size: number, opacity: number) => {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random() - 0.5) * spread[0]
        pos[i*3+1] = (Math.random() - 0.5) * spread[1]
        pos[i*3+2] = (Math.random() - 0.5) * spread[2]
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(geo, new THREE.PointsMaterial({ size, color: 0xD4AF37, transparent: true, opacity, sizeAttenuation: true }))
    }
    const dust    = mkParticles(100, [16, 12, 10], 0.035, 0.5)
    const sparkle = mkParticles(50,  [14, 14, 14], 0.075, 0.4)
    scene.add(dust)
    scene.add(sparkle)

    // ── CINEMATIC 3-POINT LIGHTING ────────────────────────────────
    scene.add(new THREE.AmbientLight(0xFFF0E6, 0.55))

    // Key light — strong warm from upper-left front
    const keyLight = new THREE.SpotLight(0xFFEDD0, 5, 35, Math.PI / 5.5, 0.25, 1.5)
    keyLight.position.set(-5, 11, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far = 35
    scene.add(keyLight)
    scene.add(keyLight.target)

    // Fill light — cool blush from right
    const fillLight = new THREE.DirectionalLight(0xFFD6E0, 1.1)
    fillLight.position.set(7, 5, -2)
    scene.add(fillLight)

    // Rim light — golden from behind, creates luxury halo
    const rimLight = new THREE.SpotLight(0xD4AF37, 3, 22, Math.PI / 3.5, 0.6, 1)
    rimLight.position.set(2, 4, -9)
    rimLight.target.position.set(0, 0, 0)
    scene.add(rimLight)
    scene.add(rimLight.target)

    // Bounce light from below plate
    const bounce = new THREE.PointLight(0xFFE8C4, 1.2, 8)
    bounce.position.set(0, -3.5, 3)
    scene.add(bounce)

    // Top accent — highlights the flowers and topper
    const topAccent = new THREE.SpotLight(0xFFFFE0, 2, 12, Math.PI / 8, 0.4, 2)
    topAccent.position.set(0, 9, 1)
    topAccent.target.position.set(0, 2, 0)
    scene.add(topAccent)
    scene.add(topAccent.target)

    // ── ANIMATE ───────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      // Slow elegant rotation + gentle float
      cake.rotation.y = t * 0.08
      cake.position.y = Math.sin(t * 0.35) * 0.06

      // Topper counter-rotate slightly for dynamic look
      topper.rotation.y = -t * 0.15

      macarons.forEach(m => {
        m.g.rotation.y += m.s * 0.007
        m.g.rotation.z = Math.sin(t * 0.5 + m.ph) * 0.1
        m.g.position.y = m.iy + Math.sin(t * 0.85 + m.ph) * 0.16
      })

      dust.rotation.y = t * 0.012
      dust.rotation.x = Math.sin(t * 0.005) * 0.08
      sparkle.rotation.y = -t * 0.009
      sparkle.rotation.z = Math.cos(t * 0.004) * 0.05

      // Camera follows mouse smoothly
      camera.position.x += (mouseRef.current.x * 0.9 - camera.position.x) * 0.035
      camera.position.y += (-mouseRef.current.y * 0.6 + 1.5 - camera.position.y) * 0.035
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
