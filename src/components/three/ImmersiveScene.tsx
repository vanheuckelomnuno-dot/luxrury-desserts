'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// ─── Luxury Donut ─────────────────────────────────────────────────────────────
// Replace with useGLTF('/models/donut.glb') for real model
function Donut({
  position,
  color,
  icing,
  scale = 1,
  phaseOffset = 0,
}: {
  position: [number, number, number]
  color: string
  icing: string
  scale?: number
  phaseOffset?: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x += 0.005
    ref.current.rotation.y += 0.008
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + phaseOffset) * 0.3
    ref.current.position.x = position[0] + Math.sin(t * 0.4 + phaseOffset) * 0.15
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Donut body */}
      <mesh castShadow>
        <torusGeometry args={[0.55, 0.22, 12, 40]} />
        <meshStandardMaterial
          color={new THREE.Color(color)}
          roughness={0.35}
          metalness={0.0}
        />
      </mesh>
      {/* Icing layer */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.14, 8, 40]} />
        <meshStandardMaterial
          color={new THREE.Color(icing)}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}

// ─── Mini Cake ────────────────────────────────────────────────────────────────
function MiniCake({
  position,
  scale = 0.7,
  phaseOffset = 0,
}: {
  position: [number, number, number]
  scale?: number
  phaseOffset?: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y += 0.006
    ref.current.position.y = position[1] + Math.sin(t * 0.55 + phaseOffset) * 0.25
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Tier 1 */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.6, 20]} />
        <meshStandardMaterial color="#FFD6E0" roughness={0.35} />
      </mesh>
      {/* Tier 2 */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.6, 20]} />
        <meshStandardMaterial color="#F6EEE3" roughness={0.35} />
      </mesh>
      {/* Top frosting */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
      </mesh>
      {/* Gold bands */}
      {[-0.5, 0.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.8 - i * 0.25, 0.015, 6, 40]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Floating Sphere (chocolate) ──────────────────────────────────────────────
function ChocolateSphere({
  position,
  phaseOffset = 0,
}: {
  position: [number, number, number]
  phaseOffset?: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + phaseOffset) * 0.4
    ref.current.rotation.x += 0.004
    ref.current.rotation.z += 0.003
  })

  return (
    <mesh ref={ref} position={position} castShadow>
      <icosahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial
        color="#5A3825"
        roughness={0.15}
        metalness={0.2}
        emissive="#3D2419"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// ─── Glowing orb ─────────────────────────────────────────────────────────────
function GlowOrb({
  position,
  color,
  phaseOffset = 0,
}: {
  position: [number, number, number]
  color: string
  phaseOffset?: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + phaseOffset) * 0.5
    ref.current.scale.setScalar(0.9 + Math.sin(t * 1.2 + phaseOffset) * 0.08)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

// ─── Dense particles ─────────────────────────────────────────────────────────
function ImmersiveParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 120
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.012
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.006) * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#D4AF37" transparent opacity={0.45} sizeAttenuation />
    </points>
  )
}

// ─── Scroll-reactive camera ───────────────────────────────────────────────────
function ImmersiveCamera({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.x += (mousePosition.x * 2 - camera.position.x) * 0.025
    camera.position.y += (-mousePosition.y * 1.5 + 1 - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene lights ─────────────────────────────────────────────────────────────
function ImmersiveLights() {
  return (
    <>
      <ambientLight intensity={0.8} color="#FFF0E0" />
      <directionalLight position={[10, 15, 8]} intensity={2} color="#FFE4A0" />
      <directionalLight position={[-8, 6, -6]} intensity={1} color="#FFD6E0" />
      <pointLight position={[6, 4, 6]} intensity={2} color="#D4AF37" distance={20} />
      <pointLight position={[-5, 3, -5]} intensity={1.5} color="#FFD6E0" distance={18} />
    </>
  )
}

const donutData = [
  { position: [-5, 1.5, -2] as [number, number, number], color: '#F6EEE3', icing: '#FFD6E0', scale: 1.1, phase: 0 },
  { position: [5, 0.5, -1] as [number, number, number], color: '#FFD6E0', icing: '#D4AF37', scale: 0.9, phase: 1.4 },
  { position: [-4, -2, 1] as [number, number, number], color: '#FFFDF8', icing: '#FFD6E0', scale: 1.0, phase: 2.8 },
  { position: [4, 2.5, 1.5] as [number, number, number], color: '#F6EEE3', icing: '#D4AF37', scale: 1.2, phase: 0.7 },
  { position: [-6, -0.5, -0.5] as [number, number, number], color: '#FFD6E0', icing: '#FFFDF8', scale: 0.8, phase: 3.5 },
  { position: [6, -1.5, 0.5] as [number, number, number], color: '#F6EEE3', icing: '#FFD6E0', scale: 1.0, phase: 2.1 },
  { position: [0, 3.5, -3] as [number, number, number], color: '#FFFDF8', icing: '#D4AF37', scale: 0.85, phase: 4.2 },
  { position: [-2, -3, 2] as [number, number, number], color: '#FFD6E0', icing: '#F6EEE3', scale: 1.15, phase: 5.6 },
  { position: [2.5, 3, 2.5] as [number, number, number], color: '#F6EEE3', icing: '#FFD6E0', scale: 0.75, phase: 1.9 },
]

const miniCakePositions: Array<[number, number, number]> = [
  [-7, 0, -3],
  [7, 1, -2],
  [-1, -4, -2],
  [0, 4.5, 2],
]

const chocSpheres: Array<[number, number, number]> = [
  [-3, 2.5, 3],
  [3, -2, -3],
  [-5, -3, 2],
  [5, 3, -1],
]

const glowOrbs = [
  { position: [-8, 2, 0] as [number, number, number], color: '#D4AF37', phase: 0 },
  { position: [8, -1, -2] as [number, number, number], color: '#FFD6E0', phase: 2.1 },
  { position: [0, 5, -4] as [number, number, number], color: '#D4AF37', phase: 4.2 },
  { position: [-2, -5, 3] as [number, number, number], color: '#FFD6E0', phase: 1.5 },
]

function SceneContent({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 14]} fov={60} />
      <ImmersiveCamera mousePosition={mousePosition} />
      <ImmersiveLights />
      <ImmersiveParticles />

      <Suspense fallback={null}>
        {donutData.map((d, i) => (
          <Donut key={i} {...d} />
        ))}

        {miniCakePositions.map((pos, i) => (
          <MiniCake key={i} position={pos} phaseOffset={i * 1.3} scale={[0.7, 0.8, 0.65, 0.9][i]} />
        ))}

        {chocSpheres.map((pos, i) => (
          <ChocolateSphere key={i} position={pos} phaseOffset={i * 1.1} />
        ))}

        {glowOrbs.map((o, i) => (
          <GlowOrb key={i} {...o} />
        ))}

        <Sparkles
          count={50}
          scale={20}
          size={2}
          speed={0.4}
          opacity={0.35}
          color="#D4AF37"
        />
      </Suspense>
    </>
  )
}

export default function ImmersiveScene({
  mousePosition,
  paused = false,
}: {
  mousePosition: { x: number; y: number }
  paused?: boolean
}) {
  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={1}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
        powerPreference: 'default',
      }}
      style={{ background: 'transparent' }}
    >
      <SceneContent mousePosition={mousePosition} />
    </Canvas>
  )
}
