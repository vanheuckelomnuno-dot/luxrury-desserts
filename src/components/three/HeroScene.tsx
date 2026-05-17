'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function createMesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos?: [number, number, number]
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, mat)
  if (pos) mesh.position.set(pos[0], pos[1], pos[2])
  return mesh
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
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 2, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'default' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.domElement.style.background = 'transparent'
    el.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0xFFF8F0, 0.9))
    const dl1 = new THREE.DirectionalLight(0xFFE4B5, 2.5)
    dl1.position.set(8, 12, 6)
    scene.add(dl1)
    const dl2 = new THREE.DirectionalLight(0xFFD6E0, 0.8)
    dl2.position.set(-6, 8, -4)
    scene.add(dl2)
    const pl1 = new THREE.PointLight(0xD4AF37, 1.5, 15)
    pl1.position.set(4, 3, 4)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0xFFD6E0, 1.0, 12)
    pl2.position.set(-4, 2, -3)
    scene.add(pl2)

    // Materials
    const mCream = new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.3 })
    const mPink  = new THREE.MeshStandardMaterial({ color: 0xFFD6E0, roughness: 0.35 })
    const mGold  = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.15 })
    const mWhite = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.15 })
    const mFire  = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: new THREE.Color(0xFF8C00), emissiveIntensity: 2 })

    // Cake
    const cake = new THREE.Group()
    cake.position.set(0, -0.2, 0)
    cake.add(createMesh(new THREE.CylinderGeometry(2.0, 2.0, 0.06, 32), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.4, roughness: 0.1 }), [0, -1.85, 0]))
    cake.add(createMesh(new THREE.CylinderGeometry(1.5, 1.5, 1.1, 32), mCream, [0, -1.3, 0]))
    ;[-1.0, -0.7, -0.4].forEach(y => cake.add(createMesh(new THREE.TorusGeometry(1.5, 0.025, 8, 64), mGold, [0, y, 0])))
    cake.add(createMesh(new THREE.CylinderGeometry(1.1, 1.1, 0.9, 32), mPink, [0, -0.15, 0]))
    ;[-0.35, 0.0, 0.35].forEach(y => cake.add(createMesh(new THREE.TorusGeometry(1.1, 0.02, 8, 64), mGold, [0, y, 0])))
    cake.add(createMesh(new THREE.CylinderGeometry(0.7, 0.7, 0.8, 32), mCream, [0, 0.7, 0]))
    cake.add(createMesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), mWhite, [0, 1.15, 0]))
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      cake.add(createMesh(new THREE.SphereGeometry(0.06, 8, 8), mGold, [Math.cos(a) * 0.5, 1.35, Math.sin(a) * 0.5]))
    }
    cake.add(createMesh(new THREE.SphereGeometry(0.1, 16, 16), mGold, [0, 1.42, 0]))
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const cg = new THREE.Group()
      cg.position.set(Math.cos(a) * 0.38, 1.15, Math.sin(a) * 0.38)
      cg.add(createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 6), mPink))
      cg.add(createMesh(new THREE.ConeGeometry(0.03, 0.09, 6), mFire, [0, 0.19, 0]))
      cake.add(cg)
    }
    scene.add(cake)

    // Macarons
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
      const mat = new THREE.MeshPhysicalMaterial({ color: d.c, roughness: 0.35, clearcoat: 0.4 })
      const g = new THREE.Group()
      g.add(createMesh(new THREE.CylinderGeometry(0.32, 0.34, 0.14, 20), mat, [0, 0.14, 0]))
      g.add(createMesh(new THREE.TorusGeometry(0.34, 0.03, 6, 24), mat, [0, 0.07, 0]))
      g.add(createMesh(new THREE.CylinderGeometry(0.31, 0.31, 0.1, 20), new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.6 })))
      g.add(createMesh(new THREE.TorusGeometry(0.34, 0.03, 6, 24), mat, [0, -0.07, 0]))
      g.add(createMesh(new THREE.CylinderGeometry(0.34, 0.32, 0.14, 20), mat, [0, -0.14, 0]))
      g.position.set(...d.p)
      scene.add(g)
      return { g, iy: d.p[1], s: d.s, ph: d.ph }
    })

    // Particles
    const pCount = 80
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 14
      pPos[i*3+1] = (Math.random() - 0.5) * 10
      pPos[i*3+2] = (Math.random() - 0.5) * 8
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particlesMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.04, color: 0xD4AF37, transparent: true, opacity: 0.5, sizeAttenuation: true }))
    scene.add(particlesMesh)

    const sCount = 40
    const sPos = new Float32Array(sCount * 3)
    for (let i = 0; i < sCount; i++) {
      sPos[i*3]   = (Math.random() - 0.5) * 12
      sPos[i*3+1] = (Math.random() - 0.5) * 12
      sPos[i*3+2] = (Math.random() - 0.5) * 12
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const sparklesMesh = new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.08, color: 0xD4AF37, transparent: true, opacity: 0.4, sizeAttenuation: true }))
    scene.add(sparklesMesh)

    // Animate
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      cake.rotation.y = t * 0.12
      cake.position.y = -0.2 + Math.sin(t * 0.5) * 0.08

      macarons.forEach(m => {
        m.g.rotation.y += m.s * 0.008
        m.g.rotation.z = Math.sin(t * 0.6 + m.ph) * 0.12
        m.g.position.y = m.iy + Math.sin(t * 0.9 + m.ph) * 0.18
      })

      particlesMesh.rotation.y = t * 0.015
      particlesMesh.rotation.x = t * 0.008
      sparklesMesh.rotation.y = -t * 0.01

      camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.04
      camera.position.y += (-mouseRef.current.y * 0.5 + 2 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)

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
