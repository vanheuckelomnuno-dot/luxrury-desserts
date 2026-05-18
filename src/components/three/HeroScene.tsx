'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { EffectComposer }          from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass }              from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass }         from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass }              from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RectAreaLightUniformsLib }from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RoomEnvironment }         from 'three/examples/jsm/environments/RoomEnvironment.js'

export default function HeroScene({
  mousePosition,
  paused = false,
}: {
  mousePosition: { x: number; y: number }
  paused?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef     = useRef(mousePosition)
  const pausedRef    = useRef(paused)

  useEffect(() => { mouseRef.current  = mousePosition }, [mousePosition])
  useEffect(() => { pausedRef.current = paused        }, [paused])

  useEffect(() => {
    RectAreaLightUniformsLib.init()
    const el = containerRef.current
    if (!el) return
    const W = el.clientWidth  || window.innerWidth
    const H = el.clientHeight || window.innerHeight

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(W, H)
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.82
    renderer.shadowMap.enabled   = false
    el.appendChild(renderer.domElement)

    // ── Scene: deep black-burgundy luxury background ──────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x07020A)          // near-black, faint violet-burgundy
    scene.fog        = new THREE.FogExp2(0x07020A, 0.020) // soft depth fade

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.set(0.6, 0.5, 10.8)          // very slightly off-axis: macro product feel
    camera.lookAt(-0.15, 0.0, 0)

    // ── Studio HDRI reflections (dimmed) ─────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment          = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.28
    pmrem.dispose()

    // ── Post-processing: minimal bloom, output correction ─────────────
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.08, 0.28, 0.96))
    composer.addPass(new OutputPass())

    // ── Lights ────────────────────────────────────────────────────────
    // Warm key box – upper front-right
    const key = new THREE.RectAreaLight(0xFFF3E0, 3.2, 6, 5)
    key.position.set(4, 5.5, 5); key.lookAt(0, 0, 0)
    scene.add(key)
    // Cool fill – left
    const fill = new THREE.RectAreaLight(0xECEFFF, 1.3, 4, 4)
    fill.position.set(-5, 2, 3); fill.lookAt(0, 0, 0)
    scene.add(fill)
    // Warm rim – behind, separates from dark bg
    const rim = new THREE.SpotLight(0xFFB860, 1.6, 28, Math.PI / 6, 0.7)
    rim.position.set(-1.5, 3.5, -8); scene.add(rim)
    // Flower accent
    const flowerAccent = new THREE.SpotLight(0xFFEED0, 1.1, 10, Math.PI / 8, 0.5)
    flowerAccent.position.set(0.5, 6, 3); scene.add(flowerAccent)
    // Very low ambient
    scene.add(new THREE.AmbientLight(0xFFECDD, 0.18))
    // Orbiting catch-light
    const orbitLight = new THREE.PointLight(0xFFDC90, 1.8, 12)
    scene.add(orbitLight)
    // Deep burgundy back-light (background color warmth)
    const bgGlow = new THREE.PointLight(0x6B0A1A, 0.7, 25)
    bgGlow.position.set(0, -1, -9); scene.add(bgGlow)
    // Bounce from below
    const bounce = new THREE.PointLight(0xFFD0A0, 0.45, 10)
    bounce.position.set(0, -4.5, 2); scene.add(bounce)

    // ── Materials ─────────────────────────────────────────────────────
    // FONDANT: matte velvet, subtle sheen — NOT glossy
    const fondant = new THREE.MeshPhysicalMaterial({
      color:              0xF7F2EB,    // warm ivory, not pure white
      roughness:          0.58,
      metalness:          0.0,
      clearcoat:          0.22,
      clearcoatRoughness: 0.50,
      sheen:              0.35,
      sheenColor:         new THREE.Color(0xFFECDD),
      sheenRoughness:     0.60,
      envMapIntensity:    0.18,
    })

    // GOLD: anisotropic satin — micro-scratched, not chrome
    const gold = new THREE.MeshPhysicalMaterial({
      color:           0xC8A020,
      metalness:       1.0,
      roughness:       0.28,
      anisotropy:      0.6,            // brushed-scratch direction
      envMapIntensity: 1.4,
    })

    // GOLD LEAF: crinkled, thin, partially transparent
    const goldLeafMat = new THREE.MeshPhysicalMaterial({
      color:           0xD4AF37,
      metalness:       0.95,
      roughness:       0.15,
      side:            THREE.DoubleSide,
      transparent:     true,
      opacity:         0.82,
      envMapIntensity: 1.8,
    })

    const roseGold = new THREE.MeshPhysicalMaterial({
      color:           0xC07858,
      metalness:       0.90,
      roughness:       0.30,
      envMapIntensity: 1.3,
    })
    const silver = new THREE.MeshPhysicalMaterial({
      color: 0xCCCCD8, metalness: 0.93, roughness: 0.20, envMapIntensity: 1.2,
    })
    const mirror = new THREE.MeshPhysicalMaterial({
      color: 0xE5E2EE, metalness: 0.97, roughness: 0.05, envMapIntensity: 1.7,
    })
    // PEARLS: iridescent nacre
    const pearl = new THREE.MeshPhysicalMaterial({
      color:                     0xF3EEEA,
      roughness:                 0.10,
      metalness:                 0.05,
      clearcoat:                 0.88,
      clearcoatRoughness:        0.10,
      iridescence:               0.88,
      iridescenceIOR:            1.38,
      iridescenceThicknessRange: [80, 380] as [number, number],
      envMapIntensity:           0.65,
    })
    // CREAM: soft uneven frosting
    const cream = new THREE.MeshPhysicalMaterial({
      color:              0xFFF5E8,
      roughness:          0.50,
      metalness:          0.0,
      clearcoat:          0.20,
      clearcoatRoughness: 0.40,
    })

    // ── Geometry helpers ──────────────────────────────────────────────
    const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, pos?: [number,number,number]) => {
      const mesh = new THREE.Mesh(geo, mat)
      if (pos) mesh.position.set(...pos)
      return mesh
    }

    // Imperfect cylinder: vertex-displaced fondant surface
    const imperfectCyl = (rTop: number, rBot: number, h: number, seg: number, amp = 0.011) => {
      const geo = new THREE.CylinderGeometry(rTop, rBot, h, seg, 6)
      const pos = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        const r = Math.sqrt(x * x + z * z)
        if (r > 0.08) {
          const n = (Math.random() - 0.5) * amp
          pos.setX(i, x + (x / r) * n)
          pos.setY(i, y + (Math.random() - 0.5) * 0.004)
          pos.setZ(i, z + (z / r) * n)
        }
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
      return geo
    }

    // Crinkled gold leaf patch on tier surface
    const goldLeafPatch = (parent: THREE.Object3D, angle: number, radius: number, y: number) => {
      const geo = new THREE.PlaneGeometry(0.14 + Math.random() * 0.10, 0.08 + Math.random() * 0.07, 4, 3)
      const pos = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        pos.setZ(i, (Math.random() - 0.5) * 0.007) // crinkle
      }
      pos.needsUpdate = true; geo.computeVertexNormals()
      const patch = mk(geo, goldLeafMat)
      patch.position.set(Math.cos(angle) * (radius + 0.01), y + (Math.random()-0.5)*0.12, Math.sin(angle) * (radius + 0.01))
      patch.rotation.y = -angle + (Math.random()-0.5) * 0.2
      patch.rotation.z = (Math.random() - 0.5) * 0.25
      parent.add(patch)
    }

    // Crumb scatter
    const scatterCrumbs = (parent: THREE.Object3D, baseY: number, radius: number, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const r = radius * (0.15 + Math.random() * 0.85)
        const crumb = mk(new THREE.DodecahedronGeometry(0.010 + Math.random() * 0.018, 0), fondant)
        crumb.position.set(Math.cos(a) * r, baseY + Math.random() * 0.01, Math.sin(a) * r)
        crumb.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)
        parent.add(crumb)
      }
    }

    // Pearl ring with slight natural spacing variation
    const pearlRing = (parent: THREE.Object3D, y: number, radius: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a   = (i / n) * Math.PI * 2 + (Math.random()-0.5) * 0.08
        const r   = radius + (Math.random()-0.5) * 0.012
        const sz  = 0.036 + Math.random() * 0.012
        parent.add(mk(new THREE.SphereGeometry(sz, 9, 7), pearl, [Math.cos(a)*r, y+(Math.random()-0.5)*0.008, Math.sin(a)*r]))
      }
    }

    // Irregular piping: uneven sphere sizes, slight position variation
    const irregPiping = (parent: THREE.Object3D, y: number, radius: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (Math.random()-0.5) * 0.06
        for (let j = 0; j < 3; j++) {
          const sv = 0.80 + Math.random() * 0.42   // 80–120% size variation
          const r2 = radius + (j - 1) * 0.072 + (Math.random()-0.5) * 0.025
          const b  = mk(new THREE.SphereGeometry((0.065 - j * 0.011) * sv, 8, 6), cream)
          b.position.set(
            Math.cos(a) * r2,
            y + j * 0.046 + (Math.random()-0.5) * 0.014,
            Math.sin(a) * r2,
          )
          b.scale.set(1+(Math.random()-0.5)*0.18, 1+(Math.random()-0.5)*0.12, 1+(Math.random()-0.5)*0.18)
          parent.add(b)
        }
      }
    }

    // Gold drip with realistic gravity curve
    const makeDrip = (parent: THREE.Object3D, angle: number, radius: number, topY: number, len: number) => {
      const sway = (Math.random() - 0.5) * 0.055
      const bulge = 0.04 + Math.random() * 0.03   // surface adhesion bulge
      const ox = Math.cos(angle) * (radius + bulge)
      const oz = Math.sin(angle) * (radius + bulge)
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ox * 0.97, topY + 0.01, oz * 0.97),
        new THREE.Vector3(ox, topY - 0.04, oz),
        new THREE.Vector3(ox + sway * 0.4, topY - len * 0.45, oz),
        new THREE.Vector3(ox + sway * 0.9, topY - len * 0.80, oz),
        new THREE.Vector3(ox + sway * 0.7, topY - len, oz),
      ])
      const thickness = 0.011 + Math.random() * 0.006
      parent.add(mk(new THREE.TubeGeometry(curve, 12, thickness, 6), gold))
      const drop = mk(new THREE.SphereGeometry(thickness * 1.9, 8, 6), gold)
      drop.position.copy(curve.getPoint(1))
      parent.add(drop)
    }

    // Rose
    const newPetalMat = (color = 0xFFB0C0) => new THREE.MeshPhysicalMaterial({
      color, roughness: 0.14, transmission: 0.26, thickness: 0.20, ior: 1.44,
      clearcoat: 0.50, clearcoatRoughness: 0.18, side: THREE.DoubleSide, envMapIntensity: 0.25,
    })
    const makeRose = (parent: THREE.Object3D, pos: THREE.Vector3, scale = 1, petalColor = 0xFFB0C0) => {
      const g = new THREE.Group()
      g.position.copy(pos)
      g.scale.setScalar(scale)
      // Slight random tilt (natural, not perfectly upright)
      g.rotation.x = (Math.random()-0.5) * 0.20
      g.rotation.z = (Math.random()-0.5) * 0.15
      const pm = newPetalMat(petalColor)
      const layers = [
        { n: 4,  r: 0.044, ps: [0.30, 1.28, 0.48] as [number,number,number], tx: -0.30, dy: 0.07 },
        { n: 6,  r: 0.10,  ps: [0.37, 1.06, 0.58] as [number,number,number], tx: -0.55, dy: 0.02 },
        { n: 9,  r: 0.17,  ps: [0.43, 0.90, 0.68] as [number,number,number], tx: -0.72, dy:-0.04 },
        { n: 12, r: 0.27,  ps: [0.50, 0.75, 0.78] as [number,number,number], tx: -0.88, dy:-0.10 },
      ]
      layers.forEach((lay, li) => {
        const offset = li * 0.22
        for (let i = 0; i < lay.n; i++) {
          const a = (i / lay.n) * Math.PI * 2 + offset
          const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 5), pm)
          p.scale.set(...lay.ps)
          p.position.set(Math.cos(a)*lay.r + (Math.random()-0.5)*0.006, lay.dy + (Math.random()-0.5)*0.005, Math.sin(a)*lay.r + (Math.random()-0.5)*0.006)
          p.rotation.set(lay.tx + (Math.random()-0.5)*0.08, a, (Math.random()-0.5)*0.05)
          g.add(p)
        }
      })
      const sepalM = new THREE.MeshPhysicalMaterial({ color: 0x355828, roughness: 0.45, clearcoat: 0.2 })
      for (let i = 0; i < 5; i++) {
        const a = (i/5)*Math.PI*2
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 4), sepalM)
        s.scale.set(0.28, 0.58, 0.45)
        s.position.set(Math.cos(a)*0.31, -0.13, Math.sin(a)*0.31)
        s.rotation.set(-1.0, a, 0)
        g.add(s)
      }
      parent.add(g)
      return g
    }

    // Baby's breath
    const makeBreath = (parent: THREE.Object3D, center: THREE.Vector3) => {
      const wm = new THREE.MeshPhysicalMaterial({ color: 0xF8F5F0, roughness: 0.35, clearcoat: 0.3 })
      const sm = new THREE.MeshStandardMaterial({ color: 0x426238, roughness: 0.65 })
      for (let i = 0; i < 30; i++) {
        const a = Math.random()*Math.PI*2, r = 0.1+Math.random()*0.58, h = 0.05+Math.random()*0.58
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.003, h, 4), sm)
        stem.position.set(center.x+Math.cos(a)*r, center.y+h*0.5, center.z+Math.sin(a)*r)
        parent.add(stem)
        const bl = new THREE.Mesh(new THREE.SphereGeometry(0.020+Math.random()*0.012, 6, 4), wm)
        bl.position.set(center.x+Math.cos(a)*r, center.y+h, center.z+Math.sin(a)*r)
        parent.add(bl)
      }
    }

    // Macaron with subtle shell texture
    const makeMacaron = (color: number) => {
      const g   = new THREE.Group()
      const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.30, clearcoat: 0.55, clearcoatRoughness: 0.18, envMapIntensity: 0.5 })
      const fil = new THREE.MeshPhysicalMaterial({ color: 0xFFF0E5, roughness: 0.50 })
      // Slightly imperfect half-spheres
      const topGeo  = new THREE.SphereGeometry(0.20, 18, 9, 0, Math.PI*2, 0, Math.PI/2)
      const topPos  = topGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < topPos.count; i++) {
        topPos.setX(i, topPos.getX(i) + (Math.random()-0.5)*0.004)
        topPos.setY(i, topPos.getY(i) + (Math.random()-0.5)*0.003)
        topPos.setZ(i, topPos.getZ(i) + (Math.random()-0.5)*0.004)
      }
      topPos.needsUpdate = true; topGeo.computeVertexNormals()
      const top = mk(topGeo, mat); top.scale.y = 0.52; top.position.y = 0.055
      const bot = mk(new THREE.SphereGeometry(0.20, 18, 9, 0, Math.PI*2, 0, Math.PI/2), mat)
      bot.scale.y = 0.52; bot.rotation.x = Math.PI; bot.position.y = -0.055
      g.add(top, bot, mk(new THREE.CylinderGeometry(0.190, 0.190, 0.074, 18), fil))
      return g
    }

    // ════════════════════════════════════════════════════════════════
    // SCENE BUILD
    // ════════════════════════════════════════════════════════════════
    const cakeGroup = new THREE.Group()
    scene.add(cakeGroup)

    // ── Subtle warm vignette orb behind the cake ──────────────────────
    // (MeshBasicMaterial, BackSide — a near-invisible warm shell)
    cakeGroup.add(mk(
      new THREE.SphereGeometry(6.0, 16, 10),
      new THREE.MeshBasicMaterial({ color: 0x1A0808, transparent: true, opacity: 0.50, side: THREE.BackSide }),
    ))

    // ── Pedestal ──────────────────────────────────────────────────────
    const ped = new THREE.Group()
    ped.add(mk(new THREE.CylinderGeometry(1.52, 1.78, 0.14, 8),  silver, [0,-3.60,0]))
    ped.add(mk(new THREE.CylinderGeometry(0.44, 0.54, 0.90, 8),  silver, [0,-3.12,0]))
    ped.add(mk(new THREE.CylinderGeometry(1.33, 1.33, 0.10, 32), mirror, [0,-2.62,0]))
    for (let i = 0; i < 8; i++) {
      const a = (i/8)*Math.PI*2
      ped.add(mk(new THREE.SphereGeometry(0.055, 8, 6), silver, [Math.cos(a)*1.33,-2.62,Math.sin(a)*1.33]))
    }
    // Tiny crumbs on pedestal top surface
    scatterCrumbs(ped, -2.57, 1.2, 10)
    cakeGroup.add(ped)

    // ── Tier 1 – imperfect displaced fondant ──────────────────────────
    const t1 = new THREE.Group()
    // Natural slight tilt – handmade cake isn't perfectly centered
    t1.position.x = (Math.random()-0.5) * 0.04
    t1.position.z = (Math.random()-0.5) * 0.04

    t1.add(mk(imperfectCyl(1.71, 1.75, 1.02, 52, 0.013), fondant, [0,-2.07,0]))
    t1.add(mk(new THREE.CylinderGeometry(1.77,1.77,0.054,48), gold,  [0,-1.535,0]))
    t1.add(mk(new THREE.CylinderGeometry(1.77,1.77,0.054,48), gold,  [0,-2.595,0]))

    // Ruffle skirt
    for (let i = 0; i < 40; i++) {
      const a  = (i/40)*Math.PI*2
      const sv = 0.75+Math.random()*0.45
      const r  = mk(new THREE.SphereGeometry(0.11, 8, 6), cream)
      r.scale.set(0.55*sv, 0.9*sv, 0.55*sv)
      r.position.set(Math.cos(a)*1.74, -2.53+(Math.random()-0.5)*0.04, Math.sin(a)*1.74)
      t1.add(r)
    }
    // Drips with varied lengths
    for (let i = 0; i < 18; i++) makeDrip(t1, (i/18)*Math.PI*2, 1.71, -1.535, 0.32+Math.random()*0.28)
    pearlRing(t1, -1.56, 1.67, 34)
    pearlRing(t1, -2.57, 1.67, 34)
    // Quilted dots
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 28; i++) {
        const a   = (i/28)*Math.PI*2 + (row%2)*(Math.PI/28) + (Math.random()-0.5)*0.04
        const dot = mk(new THREE.OctahedronGeometry(0.020+Math.random()*0.006, 0), gold)
        dot.position.set(Math.cos(a)*1.72, -2.44+row*0.25+(Math.random()-0.5)*0.015, Math.sin(a)*1.72)
        dot.rotation.y = a + (Math.random()-0.5)*0.3
        t1.add(dot)
      }
    }
    // Gold leaf patches scattered on tier surface
    for (let i = 0; i < 8; i++) goldLeafPatch(t1, (i/8)*Math.PI*2 + Math.random()*0.4, 1.72, -1.8-Math.random()*0.6)
    // Crumbs at base
    scatterCrumbs(t1, -2.60, 1.6, 16)
    cakeGroup.add(t1)

    // Pillars t1→t2
    for (let i = 0; i < 4; i++) {
      const a = (i/4)*Math.PI*2 + Math.PI/4 + (Math.random()-0.5)*0.08
      const px = Math.cos(a)*1.0, pz = Math.sin(a)*1.0
      cakeGroup.add(
        mk(new THREE.CylinderGeometry(0.044,0.044,0.58,10), gold, [px,-1.26,pz]),
        mk(new THREE.SphereGeometry(0.054,8,6), gold, [px,-0.97,pz]),
        mk(new THREE.SphereGeometry(0.054,8,6), gold, [px,-1.54,pz]),
      )
    }

    // ── Tier 2 ────────────────────────────────────────────────────────
    const t2 = new THREE.Group()
    t2.position.x = (Math.random()-0.5) * 0.035
    t2.position.z = (Math.random()-0.5) * 0.035

    t2.add(mk(imperfectCyl(1.11, 1.14, 0.85, 48, 0.011), fondant, [0,-1.11,0]))
    t2.add(mk(new THREE.CylinderGeometry(1.17,1.17,0.048,40), gold,    [0,-0.675,0]))
    t2.add(mk(new THREE.CylinderGeometry(1.17,1.17,0.048,40), gold,    [0,-1.535,0]))
    t2.add(mk(new THREE.TorusGeometry(1.12,0.017,8,60), roseGold,      [0,-0.93,0]))
    t2.add(mk(new THREE.TorusGeometry(1.12,0.017,8,60), roseGold,      [0,-1.30,0]))
    for (let i = 0; i < 22; i++) {
      const a = (i/22)*Math.PI*2 + (Math.random()-0.5)*0.04
      const d = mk(new THREE.OctahedronGeometry(0.026+Math.random()*0.006, 0), roseGold)
      d.position.set(Math.cos(a)*1.13, -1.10+(Math.random()-0.5)*0.015, Math.sin(a)*1.13)
      d.rotation.y = a
      t2.add(d)
    }
    for (let i = 0; i < 13; i++) makeDrip(t2, (i/13)*Math.PI*2, 1.11, -0.675, 0.25+Math.random()*0.20)
    pearlRing(t2, -0.69, 1.08, 24)
    pearlRing(t2, -1.55, 1.08, 24)
    for (let i = 0; i < 5; i++) goldLeafPatch(t2, (i/5)*Math.PI*2 + Math.random()*0.5, 1.12, -1.0-Math.random()*0.4)
    scatterCrumbs(t2, -1.56, 1.0, 10)
    cakeGroup.add(t2)

    // Pillars t2→t3
    for (let i = 0; i < 3; i++) {
      const a  = (i/3)*Math.PI*2 + (Math.random()-0.5)*0.06
      const px = Math.cos(a)*0.63, pz = Math.sin(a)*0.63
      cakeGroup.add(
        mk(new THREE.CylinderGeometry(0.037,0.037,0.48,8), gold, [px,-0.43,pz]),
        mk(new THREE.SphereGeometry(0.046,8,6), gold, [px,-0.19,pz]),
        mk(new THREE.SphereGeometry(0.046,8,6), gold, [px,-0.67,pz]),
      )
    }

    // ── Tier 3 ────────────────────────────────────────────────────────
    const t3 = new THREE.Group()
    t3.position.x = (Math.random()-0.5) * 0.028
    t3.position.z = (Math.random()-0.5) * 0.028

    t3.add(mk(imperfectCyl(0.65, 0.67, 0.72, 40, 0.009), fondant, [0,0.28,0]))
    t3.add(mk(new THREE.CylinderGeometry(0.69,0.69,0.04,36), gold, [0,0.66,0]))
    t3.add(mk(new THREE.CylinderGeometry(0.69,0.69,0.04,36), gold, [0,-0.08,0]))
    pearlRing(t3, 0.68, 0.63, 17)
    pearlRing(t3, -0.10, 0.63, 17)
    irregPiping(t3, 0.70, 0.50, 10)
    irregPiping(t3, 0.70, 0.28, 7)
    irregPiping(t3, 0.70, 0.10, 4)
    // Cream dome top – slightly imperfect
    const domeMat = new THREE.MeshPhysicalMaterial({ color: 0xFFF8EE, roughness: 0.45, clearcoat: 0.28 })
    t3.add(mk(new THREE.SphereGeometry(0.135, 14, 8, 0, Math.PI*2, 0, Math.PI/2), domeMat, [0,0.78,0]))
    for (let i = 0; i < 3; i++) goldLeafPatch(t3, (i/3)*Math.PI*2 + Math.random()*0.8, 0.66, 0.20+Math.random()*0.25)
    cakeGroup.add(t3)

    // ── Asymmetric flower arrangement ────────────────────────────────
    const flowers = new THREE.Group()
    // Main rose, slightly off-center
    makeRose(flowers, new THREE.Vector3(0.05, 1.05, -0.04), 1.0, 0xFFADBE)
    ;[
      { p: new THREE.Vector3( 0.44, 0.91,  0.16), s: 0.74, c: 0xFFCED8 },
      { p: new THREE.Vector3(-0.40, 0.93,  0.24), s: 0.70, c: 0xFF96AC },
      { p: new THREE.Vector3( 0.14, 0.87, -0.42), s: 0.66, c: 0xFFCAD2 },
      { p: new THREE.Vector3(-0.22, 0.85, -0.30), s: 0.60, c: 0xFFDDE5 },
      { p: new THREE.Vector3( 0.32, 0.80,  0.46), s: 0.52, c: 0xFFB4C4 },
      { p: new THREE.Vector3(-0.50, 0.78,  0.08), s: 0.44, c: 0xFFD8E0 }, // extra asymmetric rose
    ].forEach(r => makeRose(flowers, r.p, r.s, r.c))

    const leafMat = new THREE.MeshPhysicalMaterial({ color: 0x335A28, roughness: 0.42, clearcoat: 0.40, side: THREE.DoubleSide })
    for (let i = 0; i < 14; i++) {
      const a    = (i/14)*Math.PI*2 + (Math.random()-0.5)*0.3
      const leaf = mk(new THREE.SphereGeometry(0.11+Math.random()*0.03, 6, 4), leafMat)
      leaf.scale.set(0.28, 0.52+Math.random()*0.12, 0.78)
      leaf.position.set(Math.cos(a)*(0.58+Math.random()*0.12), 0.78+(Math.random()-0.5)*0.08, Math.sin(a)*(0.58+Math.random()*0.12))
      leaf.rotation.set(-0.5+(Math.random()-0.5)*0.2, a, (Math.random()-0.5)*0.15)
      flowers.add(leaf)
    }
    makeBreath(flowers, new THREE.Vector3(0, 0.90, 0))
    cakeGroup.add(flowers)

    // ── Crown topper ─────────────────────────────────────────────────
    const crown = new THREE.Group()
    crown.add(mk(new THREE.SphereGeometry(0.054, 12, 8), pearl, [0,1.78,0]))
    for (let i = 0; i < 7; i++) {
      const a = (i/7)*Math.PI*2
      const ray = mk(new THREE.CylinderGeometry(0.008, 0.002, 0.27, 6), gold)
      ray.position.set(Math.cos(a)*0.14, 1.78, Math.sin(a)*0.14)
      ray.rotation.z = a + Math.PI/2; ray.rotation.y = a
      crown.add(ray, mk(new THREE.SphereGeometry(0.017, 8, 6), pearl, [Math.cos(a)*0.29, 1.78, Math.sin(a)*0.29]))
    }
    crown.add(mk(new THREE.CylinderGeometry(0.010,0.004,0.36,6), gold, [0,1.96,0]))
    crown.add(mk(new THREE.SphereGeometry(0.021,8,6), pearl, [0,2.15,0]))
    const xtalMat = new THREE.MeshPhysicalMaterial({ color: 0xEDF2FF, roughness: 0.01, transmission: 0.92, thickness: 0.10, ior: 1.50, clearcoat: 0.95 })
    for (let i = 0; i < 5; i++) {
      const a = (i/5)*Math.PI*2
      crown.add(mk(new THREE.CylinderGeometry(0.004,0.004,0.14,4), gold, [Math.cos(a)*0.21,1.71,Math.sin(a)*0.21]))
      crown.add(mk(new THREE.SphereGeometry(0.026,8,6), xtalMat,         [Math.cos(a)*0.21,1.61,Math.sin(a)*0.21]))
    }
    cakeGroup.add(crown)

    // ── Orbiting gold flakes ──────────────────────────────────────────
    interface Flake { mesh: THREE.Mesh; radius: number; baseY: number; speed: number; ph: number }
    const flakes: Flake[] = []
    for (let i = 0; i < 7; i++) {
      const flake = mk(new THREE.PlaneGeometry(0.09+Math.random()*0.07, 0.05+Math.random()*0.05), goldLeafMat)
      flakes.push({ mesh: flake, radius: 2.2+Math.random()*1.0, baseY: -1.5+Math.random()*3.0, speed: 0.052+Math.random()*0.032, ph: Math.random()*Math.PI*2 })
      scene.add(flake)
    }

    // ── Orbiting macarons ─────────────────────────────────────────────
    interface MacData { grp: THREE.Group; radius: number; baseY: number; speed: number; ph: number }
    const macarons: MacData[] = [0xCC7888, 0x85A880, 0xA090C0, 0xD0B880, 0xD0C8B0, 0xB07840, 0x8AA088, 0xCC9898]
      .map((c, i) => {
        const grp = makeMacaron(c)
        scene.add(grp)
        return { grp, radius: 3.3+(i%2)*0.5, baseY: -2.0+i*0.5, speed: 0.090+i*0.004, ph: (i/8)*Math.PI*2 }
      })

    // ── Orbiting mini roses ────────────────────────────────────────────
    interface MiniRoseData { grp: THREE.Group; radius: number; baseY: number; ph: number }
    const miniRoses: MiniRoseData[] = [0xFFCED8, 0xFF90A8, 0xFFDDE5, 0xFFAABB].map((c, i) => {
      const grp = new THREE.Group()
      makeRose(grp, new THREE.Vector3(0, 0, 0), 0.36, c)
      scene.add(grp)
      return { grp, radius: 4.0, baseY: -1.0+i*0.7, ph: (i/4)*Math.PI*2 }
    })

    // ── Atmospheric particles ──────────────────────────────────────────
    const mkPts = (n: number, spread: [number,number,number], sz: number, col: number, op: number) => {
      const pos = new Float32Array(n*3)
      for (let i = 0; i < n; i++) { pos[i*3]=(Math.random()-0.5)*spread[0]; pos[i*3+1]=(Math.random()-0.5)*spread[1]; pos[i*3+2]=(Math.random()-0.5)*spread[2] }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(geo, new THREE.PointsMaterial({ size: sz, color: col, transparent: true, opacity: op, sizeAttenuation: true }))
    }
    const dustPts   = mkPts(130, [22,18,12], 0.022, 0xC8A020, 0.32)
    const sparkPts  = mkPts(45,  [18,18,18], 0.040, 0xFFE8BB, 0.18)
    scene.add(dustPts, sparkPts)

    // ════════════════════════════════════════════════════════════════
    // ANIMATION
    // ════════════════════════════════════════════════════════════════
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      cakeGroup.rotation.y = t * 0.065
      cakeGroup.position.y = Math.sin(t * 0.33) * 0.09

      orbitLight.position.set(Math.cos(t * 0.16) * 7, 2.5, Math.sin(t * 0.16) * 7)

      macarons.forEach(mac => {
        const a = t * mac.speed + mac.ph
        mac.grp.position.set(Math.cos(a)*mac.radius, mac.baseY+Math.sin(t*0.52+mac.ph)*0.18, Math.sin(a)*mac.radius)
        mac.grp.rotation.y = a + Math.PI/2
        mac.grp.rotation.x = Math.sin(t*0.28+mac.ph) * 0.14
      })
      miniRoses.forEach(mr => {
        const a = -t*0.085 + mr.ph
        mr.grp.position.set(Math.cos(a)*mr.radius, mr.baseY+Math.sin(t*0.43+mr.ph)*0.22, Math.sin(a)*mr.radius)
        mr.grp.rotation.y = a
      })
      flakes.forEach(f => {
        const a = t*f.speed + f.ph
        f.mesh.position.set(Math.cos(a)*f.radius, f.baseY+Math.sin(t*0.62+f.ph)*0.30, Math.sin(a)*f.radius)
        f.mesh.rotation.x += 0.016
        f.mesh.rotation.y += 0.011
        f.mesh.rotation.z  = Math.sin(t*0.78+f.ph) * 0.38
      })

      dustPts.rotation.y  =  t * 0.009
      dustPts.rotation.x  =  Math.sin(t * 0.005) * 0.07
      sparkPts.rotation.y = -t * 0.006

      camera.position.x += (mouseRef.current.x * 1.5 + 0.6 - camera.position.x) * 0.025
      camera.position.y += (-mouseRef.current.y * 0.9 + 0.5 - camera.position.y) * 0.025
      camera.lookAt(-0.15, 0.0, 0)

      composer.render()
    }
    animate()

    const onResize = () => {
      if (!el) return
      const nw = el.clientWidth, nh = el.clientHeight
      camera.aspect = nw/nh; camera.updateProjectionMatrix()
      renderer.setSize(nw, nh); composer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      composer.dispose(); renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
