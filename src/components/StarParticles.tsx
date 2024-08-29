import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import starParticleVertexShader from "../shaders/star/vert.glsl";
import starParticleFragmentShader from "../shaders/star/frag.glsl";
import { useFrame, useThree } from "@react-three/fiber";
const StarParticles = () => {
  const { gl, camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const [texture] = useTexture(["textures/Tex_0075.png"]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: starParticleVertexShader,
      fragmentShader: starParticleFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        iTime: { value: 0 },
        uPointSize: {
          value: 10000,
        },
        uPixelRatio: {
          value: gl.getPixelRatio(),
        },
        uTexture: {
          value: texture,
        },
      },
    });
  }, [texture, gl]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry();
  }, []);

  useEffect(() => {
    if (!pointsRef.current) return;

    const count = 4000;

    const positions = Float32Array.from(
      Array.from({ length: count }, () =>
        [2500, 2500, 1000].map(THREE.MathUtils.randFloatSpread)
      ).flat()
    );

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const randoms = Float32Array.from(
      Array.from({ length: count }, () => [1, 1, 1].map(Math.random)).flat()
    );
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
  }, []);

  useFrame((_, delta) => {
    shaderMaterial.uniforms.iTime.value += delta;

    // make the points group to follow the camera's movement
    pointsRef.current?.position.copy(
      new THREE.Vector3(0, 0, camera.position.z - 1000)
    );
  });

  return (
    <points
      ref={pointsRef}
      frustumCulled={false}
      position={[0, 0, -1000]}
      material={shaderMaterial}
      geometry={geometry}
    ></points>
  );
};

export default StarParticles;
