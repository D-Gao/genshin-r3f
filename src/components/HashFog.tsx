import hashFogVertexShader from "../shaders/hashfog/vert.glsl";
import hashFogFragmentShader from "../shaders/hashfog/frag.glsl";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const HashFog = () => {
  const shaderMaterial = useRef(
    new THREE.ShaderMaterial({
      vertexShader: hashFogVertexShader,
      fragmentShader: hashFogFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        iTime: {
          value: 0,
        },
      },
    })
  );

  const { camera } = useThree();

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    meshRef.current?.position.copy(
      new THREE.Vector3(0, 0, camera.position.z - 200)
    );
  });

  return (
    <>
      <mesh material={shaderMaterial.current} ref={meshRef}>
        <planeGeometry args={[1000, 1000]}></planeGeometry>
      </mesh>
    </>
  );
};

export default HashFog;
