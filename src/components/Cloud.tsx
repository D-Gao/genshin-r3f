import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import cloudVertexShader from "../shaders/cloud/vert.glsl";
import cloudFragmentShader from "../shaders/cloud/frag.glsl";
import { meshList as meshList } from "../data/cloud";

const meshInfos = meshList.map((item) => {
  return {
    object: item.object,
    position: new THREE.Vector3(
      item.position[0],
      item.position[2],
      -item.position[1]
    ).multiplyScalar(0.1),
    rotation: new THREE.Quaternion(),
    scale: new THREE.Vector3(1, 1, 1),
  };
});
meshInfos.sort((a, b) => {
  return a.position.z - b.position.z;
});

const params = {
  color1: "#00a2f0",
  color2: "#f0f0f5",
  count: meshInfos.length,
};

const Cloud = () => {
  const [texture] = useTexture(["textures/Tex_0062.png"]);

  const shaderMaterial = useRef(
    new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      toneMapped: true,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture,
        },
        uColor1: {
          value: new THREE.Color(params.color1),
        },
        uColor2: {
          value: new THREE.Color(params.color2),
        },
      },
    })
  );

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    meshInfos.forEach((item, i) => {
      const mat = new THREE.Matrix4();
      mat.compose(item.position, item.rotation, item.scale);
      instancedMeshRef.current!.setMatrixAt(i, mat);
    });
    instancedMeshRef.current!.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <instancedMesh
        ref={instancedMeshRef}
        /* renderOrder={-1} */
        /* material={shaderMaterial.current} */
        frustumCulled={false}
        count={params.count}
        /* ref={rainRef} */
        /* position={[0, 0, 0]} */
        /*  rotation={[-0.1, 0, 0.1]} */
        visible={true}
        args={[undefined, shaderMaterial.current, params.count]}
      >
        <planeGeometry args={[3000, 1500]}></planeGeometry>
      </instancedMesh>
    </>
  );
};

export default Cloud;
