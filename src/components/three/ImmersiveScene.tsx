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

export default function ImmersiveScene({
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
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(0, 1, 14)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'default' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.domElement.style.background = 'transparent'
    el.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0xFFF0E0, 0.8))
    const dl1 = new THREE.DirectionalLight(0xFFE4A0, 2)
    dl1.position.set(10, 15, 8)
    scene.add(dl1)
    const dl2 = new THREE.DirectionalLight(0xFFD6E0, 1)
    dl2.position.set(-8, 6, -6)
    scene.add(dl2)
    const pl1 = new THREE.PointLight(0xD4AF37, 2, 20)
    pl1.position.set(6, 4, 6)
    scene.add(pl1)
    const pl2 = new THREE.PointLight(0xFFD6E0, 1.5, 18)
    pl2.position.set(-5, 3, -5)
    scene.add(pl2)

    // Donuts
    const donutData = [
      { p: [-5, 1.5, -2]  as [number,number,number], c: 0xF6EEE3, ic: 0xFFD6E0, sc: 1.1, ph: 0 },
      { p: [5, 0.5, -1]   as [number,number,number], c: 0xFFD6E0, ic: 0xD4AF37, sc: 0.9, ph: 1.4 },
      { p: [-4, -2, 1]    as [number,number,number], c: 0xFFFDF8, ic: 0xFFD6E0, sc: 1.0, ph: 2.8 },
      { p: [4, 2.5, 1.5]  as [number,number,number], c: 0xF6EEE3, ic: 0xD4AF37, sc: 1.2, ph: 0.7 },
      { p: [-6, -0.5, -0.5] as [number,number,number], c: 0xFFD6E0, ic: 0xFFFDF8, sc: 0.8, ph: 3.5 },
      { p: [6, -1.5, 0.5] as [number,number,number], c: 0xF6EEE3, ic: 0xFFD6E0, sc: 1.0, ph: 2.1 },
      { p: [0, 3.5, -3]   as [number,number,number], c: 0xFFFDF8, ic: 0xD4AF37, sc: 0.85, ph: 4.2 },
      { p: [-2, -3, 2]    as [number,number,number], c: 0xFFD6E0, ic: 0xF6EEE3, sc: 1.15, ph: 5.6 },
      { p: [2.5, 3, 2.5]  as [number,number,number], c: 0xF6EEE3, ic: 0xFFD6E0, sc: 0.75, ph: 1.9 },
    ]
    const donuts = donutData.map(d => {
      const g = new THREE.Group()
      g.add(createMesh(new THREE.TorusGeometry(0.55, 0.22, 12, 40), new THREE.MeshStandardMaterial({ color: d.c, roughness: 0.35 })))
      g.add(createMesh(new THREE.TorusGeometry(0.55, 0.14, 8, 40), new THREE.MeshStandardMaterial({ color: d.ic, roughness: 0.2 })))
      g.position.set(...d.p)
      g.scale.setScalar(d.sc)
      scene.add(g)
      return { g, p: d.p, ph: d.ph }
    })

    // Mini cakes
    const cakePositions: Array<[number,number,number]> = [[-7,0,-3],[7,1,-2],[-1,-4,-2],[0,4.5,2]]
    const cakeScales = [0.7, 0.8, 0.65, 0.9]
    const miniCakes = cakePositions.map((pos, i) => {
      const mPink  = new THREE.MeshStandardMaterial({ color: 0xFFD6E0, roughness: 0.35 })
      const mCream = new THREE.MeshStandardMaterial({ color: 0xF6EEE3, roughness: 0.35 })
      const mGold  = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.15 })
      const g = new THREE.Group()
      g.add(createMesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 20), mPink, [0, -0.5, 0]))
      g.add(createMesh(new THREE.CylinderGeometry(0.55, 0.55, 0.6, 20), mCream, [0, 0.1, 0]))
      g.add(createMesh(new THREE.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.15 }), [0, 0.5, 0]))
      ;[[-0.5, 0.8], [0.1, 0.55]].forEach(([y, r]) => g.add(createMesh(new THREE.TorusGeometry(r, 0.015, 6, 40), mGold, [0, y, 0])))
      g.position.set(...pos)
      g.scale.setScalar(cakeScales[i])
      scene.add(g)
      return { g, iy: pos[1], ph: i * 1.3 }
    })

    // Chocolate spheres
    const spherePositions: Array<[number,number,number]> = [[-3,2.5,3],[3,-2,-3],[-5,-3,2],[5,3,-1]]
    const chocSpheres = spherePositions.map((pos, i) => {
      const m = createMesh(
        new THREE.IcosahedronGeometry(0.35, 1),
        new THREE.MeshStandardMaterial({ color: 0x5A3825, roughness: 0.15, metalness: 0.2, emissive: new THREE.Color(0x3D2419), emissiveIntensity: 0.3 }),
        pos
      )
      scene.add(m)
      return { m, iy: pos[1], ph: i * 1.1 }
    })

    // Glow orbs
    const orbData = [
      { p: [-8, 2, 0]  as [number,number,number], c: 0xD4AF37, ph: 0 },
      { p: [8, -1, -2] as [number,number,number], c: 0xFFD6E0, ph: 2.1 },
      { p: [0, 5, -4]  as [number,number,number], c: 0xD4AF37, ph: 4.2 },
      { p: [-2, -5, 3] as [number,number,number], c: 0xFFD6E0, ph: 1.5 },
    ]
    const glowOrbs = orbData.map(d => {
      const m = createMesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshStandardMaterial({ color: d.c, emissive: new THREE.Color(d.c), emissiveIntensity: 1.5, transparent: true, opacity: 0.7 }),
        d.p
      )
      scene.add(m)
      return { m, iy: d.p[1], ph: d.ph }
    })

    // Dense particles
    const pCount = 120
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 28
      pPos[i*3+1] = (Math.random() - 0.5) * 18
      pPos[i*3+2] = (Math.random() - 0.5) * 14
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particlesMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.035, color: 0xD4AF37, transparent: true, opacity: 0.45, sizeAttenuation: true }))
    scene.add(particlesMesh)

    // Sparkles
    const sCount = 50
    const sPos = new Float32Array(sCount * 3)
    for (let i = 0; i < sCount; i++) {
      sPos[i*3]   = (Math.random() - 0.5) * 20
      sPos[i*3+1] = (Math.random() - 0.5) * 20
      sPos[i*3+2] = (Math.random() - 0.5) * 20
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const sparklesMesh = new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.06, color: 0xD4AF37, transparent: true, opacity: 0.35, sizeAttenuation: true }))
    scene.add(sparklesMesh)

    // Animate
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (pausedRef.current) return
      const t = clock.getElapsedTime()

      donuts.forEach(d => {
        d.g.rotation.x += 0.005
        d.g.rotation.y += 0.008
        d.g.position.y = d.p[1] + Math.sin(t * 0.7 + d.ph) * 0.3
        d.g.position.x = d.p[0] + Math.sin(t * 0.4 + d.ph) * 0.15
      })

      miniCakes.forEach(c => {
        c.g.rotation.y += 0.006
        c.g.position.y = c.iy + Math.sin(t * 0.55 + c.ph) * 0.25
      })

      chocSpheres.forEach(s => {
        s.m.position.y = s.iy + Math.sin(t * 0.8 + s.ph) * 0.4
        s.m.rotation.x += 0.004
        s.m.rotation.z += 0.003
      })

      glowOrbs.forEach(o => {
        o.m.position.y = o.iy + Math.sin(t * 0.6 + o.ph) * 0.5
        const s = 0.9 + Math.sin(t * 1.2 + o.ph) * 0.08
        o.m.scale.setScalar(s)
      })

      particlesMesh.rotation.y = t * 0.012
      particlesMesh.rotation.x = Math.sin(t * 0.006) * 0.1
      sparklesMesh.rotation.y = -t * 0.008

      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.025
      camera.position.y += (-mouseRef.current.y * 1.5 + 1 - camera.position.y) * 0.025
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
