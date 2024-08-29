/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { meshList } from "../data/column";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { getToonMaterialColumn } from "../utils";
import LoadColumns from "../LoadColumns";

interface MeshInfo {
  object: string;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  scale: THREE.Vector3;
}

const Column = () => {
  const { scene } = useThree();
  const { columnModels } = LoadColumns();

  const meshInfos = useMemo(() => {
    return meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], item.rotation[2], item.rotation[1])
        ),
        scale: new THREE.Vector3(
          item.scale[0],
          item.scale[2],
          item.scale[1]
        ).multiplyScalar(0.1),
      };
    });
  }, []);

  const meshGroup = useMemo(() => {
    return meshInfos
      .map((item: MeshInfo) => item.object)
      .reduce((acc: Record<string, MeshInfo[]>, val: string, i: number) => {
        acc[val] = (acc[val] || []).concat(meshInfos[i]);
        return acc;
      }, {});
  }, [meshInfos]);

  const instanceInfos = useMemo(() => {
    return Object.entries(meshGroup).map(([k, v]) => ({
      object: k,
      instanceList: v,
      meshList: [] as THREE.InstancedMesh<
        any,
        THREE.MeshStandardMaterial,
        THREE.InstancedMeshEventMap
      >[],
    }));
  }, [meshGroup]);

  useEffect(() => {
    instanceInfos.forEach((item) => {
      const model = columnModels[item.object as keyof typeof columnModels];
      model.scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
        if (obj instanceof THREE.Mesh) {
          const material = obj.material as THREE.MeshStandardMaterial;
          const toonMaterial = getToonMaterialColumn(material);
          toonMaterial.map!.minFilter = THREE.LinearMipMapLinearFilter;
          toonMaterial.map!.magFilter = THREE.LinearFilter;
          const im = new THREE.InstancedMesh(
            obj.geometry,
            toonMaterial,
            item.instanceList.length
          );
          im.castShadow = true;
          im.frustumCulled = false;
          item.meshList.push(im);
          scene.add(im);
        }
      });
      item.meshList.forEach((mesh) => {
        item.instanceList.forEach((e, i) => {
          const mat = new THREE.Matrix4();
          mat.compose(e.position, e.rotation, e.scale);
          mesh.setMatrixAt(i, mat);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });
    });
  }, [instanceInfos, scene]);

  return <></>;
};

export default Column;
