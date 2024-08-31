import { useEffect, useMemo, useRef } from "react";
import { meshList } from "../data/polarLight";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import polarLightVertexShader from "../shaders/polarlight/vert.glsl";
import polarLightFragmentShader from "../shaders/polarlight/frag.glsl";
import { useFrame, useThree } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Plane009: THREE.Mesh;
  };
  materials: object;
};
const config = {
  totalZ: 206000,
};

const PolarLight = () => {
  const { camera } = useThree();
  const [texture] = useTexture(["textures/Tex_0071.png"]);

  const { nodes } = useGLTF("/models/SM_Light.glb") as GLTFResult;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const meshInfos = useMemo(() => {
    const meshInfos = meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], -item.rotation[1], item.rotation[2])
        ),
        scale: new THREE.Vector3(0.1, 0.1, 0.1),
      };
    });
    meshInfos.sort(
      (a: { position: { z: number } }, b: { position: { z: number } }) => {
        return a.position.z - b.position.z;
      }
    );

    return meshInfos;
  }, []);

  const shaderMaterial = useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: polarLightVertexShader,
      fragmentShader: polarLightFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture,
        },
        iTime: {
          value: 0,
        },
      },
    });
    return shaderMaterial;
  }, [texture]);

  useEffect(() => {
    updateInstance();
  }, []);

  useFrame((_, delta) => {
    shaderMaterial.uniforms.iTime.value += delta;
    if (instancedMeshRef.current) {
      if (meshInfos[meshInfos.length - 1].position.z > camera.position.z) {
        const firstElement = meshInfos.pop();
        if (firstElement) {
          firstElement.position.z -= config.totalZ * 0.05;
          meshInfos.unshift(firstElement);
          updateInstance();
        }
      }
    }
  });

  const updateInstance = () => {
    meshInfos.forEach((item, i) => {
      const mat = new THREE.Matrix4();
      mat.compose(item.position, item.rotation, item.scale);
      instancedMeshRef.current!.setMatrixAt(i, mat);
    });
    instancedMeshRef.current!.instanceMatrix.needsUpdate = true;
  };

  return (
    <instancedMesh
      ref={instancedMeshRef}
      frustumCulled={false}
      count={meshList.length}
      args={[nodes.Plane009.geometry, shaderMaterial, meshInfos.length]}
    ></instancedMesh>
  );
};

export default PolarLight;
