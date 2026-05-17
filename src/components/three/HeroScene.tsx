'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows, PerspectiveCamera, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// ─── Luxury Cake ──────────────────────────────────────────────────────────────
// Replace this with <primitive object={nodes.Cake} /> if you have a .glb model
// Place your .glb file at public/models/cake.glb and use useGLTF('/models/cake.glb')
function LuxuryCake() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.12
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08
  })

  const creamMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFDF8'),
        roughness: 0.3,
        metalness: 0.0,
      }),
    []
  )

  const pinkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFD6E0'),
        roughness: 0.35,
        metalness: 0.0,
      }),
    []
  )

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.15,
        metalness: 0.85,
      }),
    []
  )

  const chocolateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#5A3825'),
        roughness: 0.4,
        metalness: 0.0,
      }),
    []
  )

  return (
    <group ref={ref} position={[0, -0.2, 0]}>
      {/* Serving plate */}
      <mesh position={[0, -1.85, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.06, 32]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.1} />
      </mesh>

      {/* Bottom tier */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 1.1, 32]} />
        <primitive object={creamMat} />
      </mesh>

      {/* Bottom chocolate bands */}
      {[-1.0, -0.7, -0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.5, 0.025, 8, 64]} />
          <primitive object={goldMat} />
        </mesh>
      ))}

      {/* Bottom frosting drip */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.52, 1.5, 0.06, 32]} />
        <primitive object={creamMat} />
      </mesh>

      {/* Middle tier */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.9, 32]} />
        <primitive object={pinkMat} />
      </mesh>

      {/* Middle gold bands */}
      {[-0.35, -0.0, 0.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.1, 0.02, 8, 64]} />
          <primitive object={goldMat} />
        </mesh>
      ))}

      {/* Top tier */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.8, 32]} />
        <primitive object={creamMat} />
      </mesh>

      {/* Top frosting dome */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0} />
      </mesh>

      {/* Gold crown decoration */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.5, 1.35, Math.sin(angle) * 0.5]}
            castShadow
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <primitive object={goldMat} />
          </mesh>
        )
      })}

      {/* Center gold sphere on top */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={goldMat} />
      </mesh>

      {/* Candles */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.38
        const z = Math.sin(angle) * 0.38
        return (
          <group key={i} position={[x, 1.15, z]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.025, 0.28, 6]} />
              <primitive object={pinkMat} />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <coneGeometry args={[0.03, 0.09, 6]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FF8C00"
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ─── Macaron ──────────────────────────────────────────────────────────────────
// Replace with useGLTF('/models/macaron.glb') if you have a model
function Macaron({
  position,
  color,
  speed = 0.5,
  phaseOffset = 0,
}: {
  position: [number, number, number]
  color: string
  speed?: number
  phaseOffset?: number
}) {
  const ref = useRef<THREE.Group>(null)
  const initialY = position[1]

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.4,
      }),
    [color]
  )

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += speed * 0.008
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + phaseOffset) * 0.12
    ref.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 0.9 + phaseOffset) * 0.18
  })

  return (
    <group ref={ref} position={position}>
      {/* Top shell */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.14, 20]} />
        <primitive object={mat} />
      </mesh>
      {/* Ruffle edge top */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.34, 0.03, 6, 24]} />
        <primitive object={mat} />
      </mesh>
      {/* Filling */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.31, 0.1, 20]} />
        <meshStandardMaterial color="#FFFDF8" roughness={0.6} />
      </mesh>
      {/* Ruffle edge bottom */}
      <mesh position={[0, -0.07, 0]}>
        <torusGeometry args={[0.34, 0.03, 6, 24]} />
        <primitive object={mat} />
      </mesh>
      {/* Bottom shell */}
      <mesh position={[0, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.32, 0.14, 20]} />
        <primitive object={mat} />
      </mesh>
    </group>
  )
}

// ─── Mouse-reactive camera rig ────────────────────────────────────────────────
function CameraRig({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.x += (mousePosition.x * 0.8 - camera.position.x) * 0.04
    camera.position.y += (-mousePosition.y * 0.5 + 2 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Floating sugar particles ─────────────────────────────────────────────────
function SugarParticles() {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes } = useMemo(() => {
    const count = 80
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      sz[i] = Math.random() * 0.04 + 0.01
    }
    return { positions: pos, sizes: sz }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
    ref.current.rotation.x = state.clock.elapsedTime * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4AF37"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Scene lighting ───────────────────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.9} color="#FFF8F0" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={2.5}
        color="#FFE4B5"
      />
      <directionalLight position={[-6, 8, -4]} intensity={0.8} color="#FFD6E0" />
      <pointLight position={[4, 3, 4]} intensity={1.5} color="#D4AF37" distance={15} />
      <pointLight position={[-4, 2, -3]} intensity={1.0} color="#FFD6E0" distance={12} />
    </>
  )
}

const macaronData = [
  { position: [-3.2, 0.8, -1.0] as [number, number, number], color: '#FFD6E0', speed: 0.6, phase: 0 },
  { position: [3.0, 1.2, -0.5] as [number, number, number], color: '#F6EEE3', speed: 0.4, phase: 1.2 },
  { position: [-2.8, -0.5, 0.5] as [number, number, number], color: '#D4AF37', speed: 0.7, phase: 2.4 },
  { position: [2.6, -0.8, 1.0] as [number, number, number], color: '#FFD6E0', speed: 0.5, phase: 0.8 },
  { position: [-1.8, 1.8, 1.2] as [number, number, number], color: '#FFFDF8', speed: 0.45, phase: 3.1 },
  { position: [2.0, 2.0, -1.5] as [number, number, number], color: '#FFD6E0', speed: 0.55, phase: 1.8 },
  { position: [-3.5, -1.5, -0.8] as [number, number, number], color: '#D4AF37', speed: 0.65, phase: 4.2 },
  { position: [3.4, 0.2, 1.5] as [number, number, number], color: '#F6EEE3', speed: 0.38, phase: 5.1 },
]

// ─── Main Scene Content ───────────────────────────────────────────────────────
function SceneContent({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <CameraRig mousePosition={mousePosition} />
      <SceneLights />
      <SugarParticles />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <LuxuryCake />
        </Float>

        {macaronData.map((m, i) => (
          <Macaron key={i} position={m.position} color={m.color} speed={m.speed} phaseOffset={m.phase} />
        ))}

        <Sparkles
          count={40}
          scale={12}
          size={1.5}
          speed={0.3}
          opacity={0.4}
          color="#D4AF37"
        />
      </Suspense>

    </>
  )
}

// ─── Exported Canvas ──────────────────────────────────────────────────────────
export default function HeroScene({
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
        toneMappingExposure: 1.2,
        powerPreference: 'default',
      }}
      style={{ background: 'transparent' }}
    >
      <SceneContent mousePosition={mousePosition} />
    </Canvas>
  )
}
