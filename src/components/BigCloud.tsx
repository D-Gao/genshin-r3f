import { useGLTF, useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import bigCloudVertexShader from "../shaders/bigcloud/vert.glsl";
import bigCloudFragmentShader from "../shaders/bigcloud/frag.glsl";
import bigCloudBgFragmentShader from "../shaders/bigcloud/frag-bg.glsl";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Plane018: THREE.Mesh;
    Plane011: THREE.Mesh;
  };
  materials: object;
};

const BigCloud = () => {
  const [texture1, texture2] = useTexture([
    "textures/Tex_0063.png",
    "textures/Tex_0067b.png",
  ]);

  const material1 = useRef(
    new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudFragmentShader,
      transparent: true,
      toneMapped: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture1,
        },
      },
    })
  );

  const material2 = useRef(
    new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudBgFragmentShader,
      transparent: true,
      toneMapped: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture2,
        },
      },
    })
  );

  const { nodes } = useGLTF("/models/SM_BigCloud.glb") as GLTFResult;

  return (
    <>
      <mesh
        geometry={nodes.Plane018.geometry}
        material={material2.current}
        position={[2542.6754, 8231.0633, -37849.45]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[28208.3906, 28208.4, 28208.4]}
      />
      <mesh
        geometry={nodes.Plane011.geometry}
        material={material1.current}
        position={[-24.8545, 662.6854, -28148.0094]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[16595.0156, 16595.0188, 16595.0188]}
      />
    </>
  );
};

export default BigCloud;
