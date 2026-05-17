'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

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
    RectAreaLightUniformsLib.init()

    const el = containerRef.current
    if (!el) return

    const W = el.clientWidth || window.innerWidth
    const H = el.clientHeight || window.innerHeight

    // ─── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.6
    renderer.shadowMap.enabled = false
    renderer.domElement.style.background = 'transparent'
    el.appendChild(renderer.domElement)

    // ─── Scene / Camera ────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
    camera.position.set(0, 0.4, 10.5)
    camera.lookAt(0, 0, 0)

    // ─── Environment (RoomEnvironment = studio HDRI reflections) ───
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture
    pmrem.dispose()

    // ─── Post-processing ────────────────────────────────────────────
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.38, 0.55, 0.82)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // ─── Lights ────────────────────────────────────────────────────
    const keyRect = new THREE.RectAreaLight(0xFFF8EE, 9, 6, 5)
    keyRect.position.set(2, 6, 6)
    keyRect.lookAt(0, 0, 0)
    scene.add(keyRect)

    const fillRect = new THREE.RectAreaLight(0xE8F0FF, 4, 4, 4)
    fillRect.position.set(-6, 3, 2)
    fillRect.lookAt(0, 0, 0)
    scene.add(fillRect)

    const rimSpot = new THREE.SpotLight(0xFFD090, 5, 30, Math.PI / 5, 0.6)
    rimSpot.position.set(-3, 4, -7)
    scene.add(rimSpot)

    scene.add(new THREE.AmbientLight(0xFFF5E0, 0.35))

    const orbitLight = new THREE.PointLight(0xFFE8A0, 4.5, 14)
    scene.add(orbitLight)

    const bounceLight = new THREE.PointLight(0xFFD6E0, 1.5, 12)
    bounceLight.position.set(0, -5, 3)
    scene.add(bounceLight)

    // ─── Materials ─────────────────────────────────────────────────
    const fondant = new THREE.MeshPhysicalMaterial({
      color: 0xFFFAF4,
      roughness: 0.11,
      metalness: 0.0,
      clearcoat: 0.98,
      clearcoatRoughness: 0.07,
      sheen: 0.45,
      sheenColor: new THREE.Color(0xFFEEDD),
      sheenRoughness: 0.28,
      envMapIntensity: 0.6,
    })
    const gold = new THREE.MeshPhysicalMaterial({
      color: 0xD4AF37,
      metalness: 1.0,
      roughness: 0.055,
      envMapIntensity: 2.2,
    })
    const roseGold = new THREE.MeshPhysicalMaterial({
      color: 0xD4956A,
      metalness: 0.90,
      roughness: 0.10,
      envMapIntensity: 1.9,
    })
    const silver = new THREE.MeshPhysicalMaterial({
      color: 0xDCDCE8,
      metalness: 0.96,
      roughness: 0.04,
      envMapIntensity: 2.0,
    })
    const mirror = new THREE.MeshPhysicalMaterial({
      color: 0xF0EEF5,
      metalness: 0.99,
      roughness: 0.01,
      envMapIntensity: 3.0,
    })
    const pearl = new THREE.MeshPhysicalMaterial({
      color: 0xF9F5F1,
      roughness: 0.035,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 1.0,
      iridescenceIOR: 1.38,
      iridescenceThicknessRange: [80, 380] as [number, number],
      envMapIntensity: 1.0,
    })
    const cream = new THREE.MeshPhysicalMaterial({
      color: 0xFFFBF0,
      roughness: 0.38,
      metalness: 0.0,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
    })

    // ─── Helpers ───────────────────────────────────────────────────
    const m = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos?: [number, number, number]
    ) => {
      const mesh = new THREE.Mesh(geo, mat)
      if (pos) mesh.position.set(...pos)
      return mesh
    }

    const petalMat = (color = 0xFFBBC8, transmission = 0.32) =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.055,
        metalness: 0.0,
        transmission,
        thickness: 0.28,
        ior: 1.46,
        clearcoat: 0.75,
        clearcoatRoughness: 0.07,
        side: THREE.DoubleSide,
        envMapIntensity: 0.5,
      })

    // ─── Rose builder ──────────────────────────────────────────────
    const makeRose = (
      parent: THREE.Object3D,
      pos: THREE.Vector3,
      scale = 1,
      petalColor = 0xFFB8C8
    ) => {
      const g = new THREE.Group()
      g.position.copy(pos)
      g.scale.setScalar(scale)

      const pm = petalMat(petalColor)
      const layers = [
        { count: 4,  r: 0.045, ps: [0.30, 1.25, 0.48] as [number,number,number], tx: -0.30, yOff: 0.07 },
        { count: 6,  r: 0.10,  ps: [0.37, 1.05, 0.58] as [number,number,number], tx: -0.55, yOff: 0.02 },
        { count: 9,  r: 0.17,  ps: [0.43, 0.90, 0.68] as [number,number,number], tx: -0.72, yOff: -0.04 },
        { count: 12, r: 0.27,  ps: [0.50, 0.75, 0.78] as [number,number,number], tx: -0.88, yOff: -0.10 },
      ]
      layers.forEach((lay, li) => {
        const offset = li * 0.22
        for (let i = 0; i < lay.count; i++) {
          const angle = (i / lay.count) * Math.PI * 2 + offset
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 5), pm)
          p.scale.set(...lay.ps)
          p.position.set(Math.cos(angle) * lay.r, lay.yOff, Math.sin(angle) * lay.r)
          p.rotation.set(lay.tx, angle, 0)
          g.add(p)
        }
      })

      const sepalM = new THREE.MeshPhysicalMaterial({ color: 0x3D5C34, roughness: 0.35, clearcoat: 0.3 })
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 4), sepalM)
        s.scale.set(0.28, 0.58, 0.45)
        s.position.set(Math.cos(angle) * 0.31, -0.13, Math.sin(angle) * 0.31)
        s.rotation.set(-1.0, angle, 0)
        g.add(s)
      }

      parent.add(g)
      return g
    }

    // ─── Baby's breath ─────────────────────────────────────────────
    const makeBreath = (parent: THREE.Object3D, center: THREE.Vector3) => {
      const wm = new THREE.MeshPhysicalMaterial({ color: 0xFFFDF8, roughness: 0.2, clearcoat: 0.6 })
      const sm = new THREE.MeshStandardMaterial({ color: 0x6A8C5A, roughness: 0.5 })
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = 0.1 + Math.random() * 0.55
        const h = 0.05 + Math.random() * 0.55
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.003, h, 4), sm)
        stem.position.set(center.x + Math.cos(angle) * r, center.y + h * 0.5, center.z + Math.sin(angle) * r)
        parent.add(stem)
        const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.022 + Math.random() * 0.01, 6, 4), wm)
        blossom.position.set(center.x + Math.cos(angle) * r, center.y + h, center.z + Math.sin(angle) * r)
        parent.add(blossom)
      }
    }

    // ─── Gold drip ─────────────────────────────────────────────────
    const makeDrip = (parent: THREE.Object3D, angle: number, radius: number, topY: number, len: number) => {
      const sway = (Math.random() - 0.5) * 0.06
      const ox = Math.cos(angle) * (radius + 0.03)
      const oz = Math.sin(angle) * (radius + 0.03)
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ox, topY, oz),
        new THREE.Vector3(ox + sway * 0.3, topY - len * 0.35, oz),
        new THREE.Vector3(ox + sway, topY - len * 0.75, oz),
        new THREE.Vector3(ox + sway * 0.8, topY - len, oz),
      ])
      parent.add(m(new THREE.TubeGeometry(curve, 10, 0.013, 5), gold))
      const drop = m(new THREE.SphereGeometry(0.025, 8, 6), gold)
      drop.position.copy(curve.getPoint(1))
      parent.add(drop)
    }

    // ─── Pearl ring ────────────────────────────────────────────────
    const pearlRing = (parent: THREE.Object3D, y: number, radius: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        parent.add(m(new THREE.SphereGeometry(0.042, 10, 8), pearl, [Math.cos(a) * radius, y, Math.sin(a) * radius]))
      }
    }

    // ─── Piping cluster ring ────────────────────────────────────────
    const pipingRing = (parent: THREE.Object3D, y: number, radius: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        for (let j = 0; j < 3; j++) {
          const r2 = radius + (j - 1) * 0.07
          const b = m(new THREE.SphereGeometry(0.065 - j * 0.01, 8, 6), cream)
          b.position.set(Math.cos(a) * r2, y + j * 0.045, Math.sin(a) * r2)
          parent.add(b)
        }
      }
    }

    // ─── Macaron ────────────────────────────────────────────────────
    const makeMacaron = (color: number) => {
      const g = new THREE.Group()
      const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.16, clearcoat: 0.85, clearcoatRoughness: 0.04, envMapIntensity: 0.8 })
      const fillMat = new THREE.MeshPhysicalMaterial({ color: 0xFFF4F8, roughness: 0.35 })
      const top = m(new THREE.SphereGeometry(0.20, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), mat)
      top.scale.y = 0.52; top.position.y = 0.055
      const bot = m(new THREE.SphereGeometry(0.20, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), mat)
      bot.scale.y = 0.52; bot.rotation.x = Math.PI; bot.position.y = -0.055
      const fill = m(new THREE.CylinderGeometry(0.192, 0.192, 0.072, 18), fillMat)
      g.add(top, bot, fill)
      return g
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE CONSTRUCTION
    // ═══════════════════════════════════════════════════════════════

    const cakeGroup = new THREE.Group()
    scene.add(cakeGroup)

    // ─── Pedestal ──────────────────────────────────────────────────
    const ped = new THREE.Group()
    ped.add(m(new THREE.CylinderGeometry(1.55, 1.80, 0.14, 8), silver, [0, -3.60, 0]))
    ped.add(m(new THREE.CylinderGeometry(0.46, 0.56, 0.90, 8), silver, [0, -3.12, 0]))
    ped.add(m(new THREE.CylinderGeometry(1.35, 1.35, 0.10, 32), mirror, [0, -2.62, 0]))
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      ped.add(m(new THREE.SphereGeometry(0.06, 8, 6), silver, [Math.cos(a) * 1.35, -2.62, Math.sin(a) * 1.35]))
    }
    cakeGroup.add(ped)

    // ─── Tier 1 (bottom) ───────────────────────────────────────────
    const t1 = new THREE.Group()
    t1.add(m(new THREE.CylinderGeometry(1.72, 1.76, 1.02, 52), fondant, [0, -2.07, 0]))
    t1.add(m(new THREE.CylinderGeometry(1.78, 1.78, 0.055, 48), gold, [0, -1.535, 0]))
    t1.add(m(new THREE.CylinderGeometry(1.78, 1.78, 0.055, 48), gold, [0, -2.595, 0]))
    for (let i = 0; i < 38; i++) {
      const a = (i / 38) * Math.PI * 2
      const r = m(new THREE.SphereGeometry(0.11, 8, 6), cream)
      r.scale.set(0.6, 0.85, 0.6)
      r.position.set(Math.cos(a) * 1.75, -2.52, Math.sin(a) * 1.75)
      t1.add(r)
    }
    for (let i = 0; i < 16; i++) {
      makeDrip(t1, (i / 16) * Math.PI * 2, 1.72, -1.535, 0.35 + Math.random() * 0.22)
    }
    pearlRing(t1, -1.56, 1.68, 36)
    pearlRing(t1, -2.58, 1.68, 36)
    for (let row = 0; row < 4; row++) {
      const y = -2.45 + row * 0.25
      const count = 28
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + (row % 2) * (Math.PI / count)
        const dot = m(new THREE.OctahedronGeometry(0.022, 0), gold)
        dot.position.set(Math.cos(a) * 1.73, y, Math.sin(a) * 1.73)
        dot.rotation.y = a
        t1.add(dot)
      }
    }
    cakeGroup.add(t1)

    // ─── Pillars tier 1 → 2 ────────────────────────────────────────
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      const px = Math.cos(a) * 1.0, pz = Math.sin(a) * 1.0
      cakeGroup.add(m(new THREE.CylinderGeometry(0.045, 0.045, 0.58, 10), gold, [px, -1.26, pz]))
      cakeGroup.add(m(new THREE.SphereGeometry(0.055, 8, 6), gold, [px, -0.97, pz]))
      cakeGroup.add(m(new THREE.SphereGeometry(0.055, 8, 6), gold, [px, -1.54, pz]))
    }

    // ─── Tier 2 (middle) ───────────────────────────────────────────
    const t2 = new THREE.Group()
    t2.add(m(new THREE.CylinderGeometry(1.12, 1.15, 0.85, 48), fondant, [0, -1.11, 0]))
    t2.add(m(new THREE.CylinderGeometry(1.18, 1.18, 0.048, 40), gold, [0, -0.675, 0]))
    t2.add(m(new THREE.CylinderGeometry(1.18, 1.18, 0.048, 40), gold, [0, -1.535, 0]))
    t2.add(m(new THREE.TorusGeometry(1.13, 0.018, 8, 60), roseGold, [0, -0.92, 0]))
    t2.add(m(new THREE.TorusGeometry(1.13, 0.018, 8, 60), roseGold, [0, -1.30, 0]))
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2
      const d = m(new THREE.OctahedronGeometry(0.028, 0), roseGold)
      d.position.set(Math.cos(a) * 1.14, -1.10, Math.sin(a) * 1.14)
      d.rotation.y = a
      t2.add(d)
    }
    for (let i = 0; i < 12; i++) {
      makeDrip(t2, (i / 12) * Math.PI * 2, 1.12, -0.675, 0.28 + Math.random() * 0.16)
    }
    pearlRing(t2, -0.69, 1.09, 26)
    pearlRing(t2, -1.55, 1.09, 26)
    cakeGroup.add(t2)

    // ─── Pillars tier 2 → 3 ────────────────────────────────────────
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2
      const px = Math.cos(a) * 0.64, pz = Math.sin(a) * 0.64
      cakeGroup.add(m(new THREE.CylinderGeometry(0.038, 0.038, 0.48, 8), gold, [px, -0.43, pz]))
      cakeGroup.add(m(new THREE.SphereGeometry(0.048, 8, 6), gold, [px, -0.19, pz]))
      cakeGroup.add(m(new THREE.SphereGeometry(0.048, 8, 6), gold, [px, -0.67, pz]))
    }

    // ─── Tier 3 (top) ──────────────────────────────────────────────
    const t3 = new THREE.Group()
    t3.add(m(new THREE.CylinderGeometry(0.66, 0.68, 0.72, 40), fondant, [0, 0.28, 0]))
    t3.add(m(new THREE.CylinderGeometry(0.70, 0.70, 0.04, 36), gold, [0, 0.66, 0]))
    t3.add(m(new THREE.CylinderGeometry(0.70, 0.70, 0.04, 36), gold, [0, -0.08, 0]))
    pearlRing(t3, 0.68, 0.64, 18)
    pearlRing(t3, -0.10, 0.64, 18)
    pipingRing(t3, 0.70, 0.50, 10)
    pipingRing(t3, 0.70, 0.28, 7)
    pipingRing(t3, 0.70, 0.10, 4)
    const domeMat = new THREE.MeshPhysicalMaterial({ color: 0xFFFCF5, roughness: 0.28, clearcoat: 0.55 })
    t3.add(m(new THREE.SphereGeometry(0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), domeMat, [0, 0.78, 0]))
    cakeGroup.add(t3)

    // ─── Flower arrangement ────────────────────────────────────────
    const flowers = new THREE.Group()
    makeRose(flowers, new THREE.Vector3(0, 1.05, 0), 1.0, 0xFFB0C0)
    const rosePositions = [
      { pos: new THREE.Vector3(0.42, 0.92, 0.18),  scale: 0.72, color: 0xFFD0DC },
      { pos: new THREE.Vector3(-0.38, 0.94, 0.22), scale: 0.68, color: 0xFF9AB0 },
      { pos: new THREE.Vector3(0.12, 0.88, -0.40), scale: 0.65, color: 0xFFCCD8 },
      { pos: new THREE.Vector3(-0.25, 0.86, -0.32),scale: 0.62, color: 0xFFE0E8 },
      { pos: new THREE.Vector3(0.30, 0.82, 0.44),  scale: 0.55, color: 0xFFB8C8 },
    ]
    rosePositions.forEach(r => makeRose(flowers, r.pos, r.scale, r.color))
    const leafMat = new THREE.MeshPhysicalMaterial({ color: 0x3E6B35, roughness: 0.3, clearcoat: 0.55, side: THREE.DoubleSide })
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const leaf = m(new THREE.SphereGeometry(0.12, 6, 4), leafMat)
      leaf.scale.set(0.30, 0.55, 0.80)
      leaf.position.set(Math.cos(a) * 0.62, 0.82, Math.sin(a) * 0.62)
      leaf.rotation.set(-0.5, a, 0)
      flowers.add(leaf)
    }
    makeBreath(flowers, new THREE.Vector3(0, 0.90, 0))
    cakeGroup.add(flowers)

    // ─── Crown topper ──────────────────────────────────────────────
    const crown = new THREE.Group()
    crown.add(m(new THREE.SphereGeometry(0.055, 12, 8), pearl, [0, 1.78, 0]))
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2
      const ray = m(new THREE.CylinderGeometry(0.008, 0.002, 0.28, 6), gold)
      ray.position.set(Math.cos(a) * 0.15, 1.78, Math.sin(a) * 0.15)
      ray.rotation.z = a + Math.PI / 2
      ray.rotation.y = a
      crown.add(ray, m(new THREE.SphereGeometry(0.018, 8, 6), pearl, [Math.cos(a) * 0.30, 1.78, Math.sin(a) * 0.30]))
    }
    crown.add(m(new THREE.CylinderGeometry(0.01, 0.005, 0.38, 6), gold, [0, 1.97, 0]))
    crown.add(m(new THREE.SphereGeometry(0.022, 8, 6), pearl, [0, 2.17, 0]))
    const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0xEEF5FF, roughness: 0.0, transmission: 0.95, thickness: 0.12, ior: 1.52, clearcoat: 1.0 })
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      crown.add(m(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 4), gold, [Math.cos(a) * 0.22, 1.71, Math.sin(a) * 0.22]))
      crown.add(m(new THREE.SphereGeometry(0.028, 8, 6), crystalMat, [Math.cos(a) * 0.22, 1.62, Math.sin(a) * 0.22]))
    }
    cakeGroup.add(crown)

    // ─── Orbiting gold flakes ───────────────────────────────────────
    const flakeMat = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 0.98, roughness: 0.03, side: THREE.DoubleSide, envMapIntensity: 2.5 })
    interface Flake { mesh: THREE.Mesh; radius: number; baseY: number; speed: number; ph: number }
    const flakes: Flake[] = []
    for (let i = 0; i < 8; i++) {
      const flake = m(new THREE.PlaneGeometry(0.10 + Math.random() * 0.08, 0.07 + Math.random() * 0.05), flakeMat)
      flakes.push({ mesh: flake, radius: 2.2 + Math.random() * 1.0, baseY: -1.5 + Math.random() * 3.0, speed: 0.06 + Math.random() * 0.04, ph: Math.random() * Math.PI * 2 })
      scene.add(flake)
    }

    // ─── Orbiting macarons ─────────────────────────────────────────
    const macaronColors = [0xE8A0B0, 0xA8C5A0, 0xC4B0D8, 0xE8D5B0, 0xF0EAD6, 0xD4A070, 0xB0C4A8, 0xE8C0D0]
    interface MacData { grp: THREE.Group; radius: number; baseY: number; speed: number; ph: number }
    const macarons: MacData[] = macaronColors.map((c, i) => {
      const grp = makeMacaron(c)
      scene.add(grp)
      return { grp, radius: 3.4 + (i % 2) * 0.5, baseY: -2.0 + i * 0.5, speed: 0.10 + i * 0.004, ph: (i / 8) * Math.PI * 2 }
    })

    // ─── Orbiting mini roses ───────────────────────────────────────
    interface MiniRoseData { grp: THREE.Group; radius: number; baseY: number; ph: number }
    const miniRoses: MiniRoseData[] = [0xFFD0DC, 0xFF9AB0, 0xFFE4EC, 0xFFB8C8].map((c, i) => {
      const grp = new THREE.Group()
      makeRose(grp, new THREE.Vector3(0, 0, 0), 0.40, c)
      scene.add(grp)
      return { grp, radius: 4.2, baseY: -1.0 + i * 0.7, ph: (i / 4) * Math.PI * 2 }
    })

    // ─── Particles ─────────────────────────────────────────────────
    const mkPts = (n: number, spread: [number,number,number], sz: number, col: number, op: number) => {
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) { pos[i*3] = (Math.random()-0.5)*spread[0]; pos[i*3+1] = (Math.random()-0.5)*spread[1]; pos[i*3+2] = (Math.random()-0.5)*spread[2] }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(geo, new THREE.PointsMaterial({ size: sz, color: col, transparent: true, opacity: op, sizeAttenuation: true }))
    }
    const dustPts  = mkPts(150, [22, 18, 12], 0.030, 0xD4AF37, 0.40)
    const sparkPts = mkPts(60,  [18, 18, 18], 0.055, 0xFFEECC, 0.28)
    scene.add(dustPts, sparkPts)

    // ═══════════════════════════════════════════════════════════════
    // ANIMATION
    // ═══════════════════════════════════════════════════════════════

    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      cakeGroup.rotation.y = t * 0.07
      cakeGroup.position.y = Math.sin(t * 0.35) * 0.10

      orbitLight.position.set(Math.cos(t * 0.18) * 7, 2.5, Math.sin(t * 0.18) * 7)

      macarons.forEach(mac => {
        const a = t * mac.speed + mac.ph
        mac.grp.position.set(Math.cos(a) * mac.radius, mac.baseY + Math.sin(t * 0.55 + mac.ph) * 0.18, Math.sin(a) * mac.radius)
        mac.grp.rotation.y = a + Math.PI / 2
        mac.grp.rotation.x = Math.sin(t * 0.3 + mac.ph) * 0.15
      })

      miniRoses.forEach(mr => {
        const a = -t * 0.09 + mr.ph
        mr.grp.position.set(Math.cos(a) * mr.radius, mr.baseY + Math.sin(t * 0.45 + mr.ph) * 0.22, Math.sin(a) * mr.radius)
        mr.grp.rotation.y = a
      })

      flakes.forEach(f => {
        const a = t * f.speed + f.ph
        f.mesh.position.set(Math.cos(a) * f.radius, f.baseY + Math.sin(t * 0.65 + f.ph) * 0.30, Math.sin(a) * f.radius)
        f.mesh.rotation.x += 0.018
        f.mesh.rotation.y += 0.012
        f.mesh.rotation.z = Math.sin(t * 0.8 + f.ph) * 0.4
      })

      dustPts.rotation.y  =  t * 0.010
      dustPts.rotation.x  =  Math.sin(t * 0.005) * 0.08
      sparkPts.rotation.y = -t * 0.007

      camera.position.x += (mouseRef.current.x * 1.8 - camera.position.x) * 0.028
      camera.position.y += (-mouseRef.current.y * 1.2 + 0.4 - camera.position.y) * 0.028
      camera.lookAt(0, 0, 0)

      composer.render()
    }
    animate()

    const onResize = () => {
      if (!el) return
      const nw = el.clientWidth, nh = el.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      composer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      composer.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
