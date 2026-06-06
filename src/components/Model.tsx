"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useEffect, useState } from "react"
import * as THREE from "three"

// Preload the model to ensure it's cached
useGLTF.preload("/crt-tv.glb")

const MODEL_PATH = "/crt-tv.glb"

export function Model() {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (scene) {
      setIsReady(true)
    }
  }, [scene])

  const processed = useMemo(() => {
    if (!scene) return new THREE.Group()
    const s = scene.clone(true)
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xd4a000,
          metalness: 1.0,
          roughness: 0.2,
          envMapIntensity: 3.0,
          emissive: 0x553300,
          emissiveIntensity: 0.1,
        })
      }
    })
    return s
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !isReady) return
    groupRef.current.rotation.y += 0.006
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
  })

  if (!isReady) return null

  return <group ref={groupRef} scale={0.033}>
    <primitive object={processed} />
  </group>
}