/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/SM_Road.glb -o src/models/Road.tsx --typescript -r public 
*/

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { GLTFResult as DoorGLTFResult } from "@/components/Door";
import useStore, { StoreState } from "@/store";
import gsap from "gsap";
import {
  getToonMaterialDoor,
  getToonMaterialRoad,
  playCreateDoor,
  playDiveIn,
} from "@/utils";

type GLTFResult = GLTF & {
  nodes: {
    SM_MERGED517: THREE.Mesh;
    SM_MERGED517_1: THREE.Mesh;
    SM_MERGED518: THREE.Mesh;
    SM_MERGED518_1: THREE.Mesh;
    SM_MERGED519: THREE.Mesh;
    SM_MERGED519_1: THREE.Mesh;
    SM_MERGED520: THREE.Mesh;
    SM_MERGED520_1: THREE.Mesh;
    SM_MERGED521: THREE.Mesh;
    SM_MERGED521_1: THREE.Mesh;
    SM_MERGED522: THREE.Mesh;
    SM_MERGED522_1: THREE.Mesh;
    SM_MERGED523: THREE.Mesh;
    SM_MERGED523_1: THREE.Mesh;
    SM_MERGED524: THREE.Mesh;
    SM_MERGED524_1: THREE.Mesh;
    SM_MERGED525: THREE.Mesh;
    SM_MERGED525_1: THREE.Mesh;
    SM_MERGED526: THREE.Mesh;
    SM_MERGED526_1: THREE.Mesh;
    SM_MERGED527: THREE.Mesh;
    SM_MERGED527_1: THREE.Mesh;
    SM_MERGED528: THREE.Mesh;
    SM_MERGED528_1: THREE.Mesh;
  };
  materials: {
    M_0_Inst: THREE.MeshStandardMaterial;
    M_0_Inst1: THREE.MeshStandardMaterial;
  };
};

const zLength = 212.4027;
const doubleZLength = 2 * zLength;
const offset = new THREE.Vector3(0, 34, 200);
const scale = 10;
export function Model(props: JSX.IntrinsicElements["group"]) {
  const doorCreated = useStore((state: StoreState) => state.doorCreated);
  const doorOpened = useStore((state: StoreState) => state.doorOpened);
  const setRunning = useStore((state: StoreState) => state.setRunning);
  const isRunning = useStore((state: StoreState) => state.isRunning);
  const setDiveIn = useStore((state: StoreState) => state.setDiveIn);
  const doorAlreadyCreated = useRef(false);
  const { gl, scene: totalScene, camera } = useThree();
  const doorLoaded = useRef(false);
  const doorModel = useGLTF("/models/DOOR.glb") as DoorGLTFResult;
  const { nodes, materials } = useGLTF("/models/SM_Road.glb") as GLTFResult;
  const planeModel = useGLTF("/models/WHITE_PLANE.glb") as GLTF;
  const mixer = useMemo(
    () => new THREE.AnimationMixer(doorModel.scene),
    [doorModel]
  );

  const roadCount = useRef(24);
  const roadRef1 = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const roadRef2 = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const originPosList = useRef<THREE.Vector3[]>([]);
  const roadPosList = useRef<THREE.Object3D<THREE.Object3DEventMap>[]>([]);
  const worldP = useRef(new THREE.Vector3());

  useEffect(() => {
    const temp = new THREE.Vector3();
    const originalPosList1: THREE.Vector3[] = [];
    const originalPosList2: THREE.Vector3[] = [];
    //fill the road's elements' original position
    roadRef1.current!.children.forEach((item) => {
      item.getWorldPosition(temp);
      //change it back to the original position
      temp.copy(temp.add(offset).multiplyScalar(scale));
      originalPosList1.push(temp.clone());
      originalPosList2.push(temp.clone());
    });

    roadPosList.current = [
      ...roadRef1.current!.children,
      ...roadRef2.current!.children,
    ];
    originPosList.current = [...originalPosList1, ...originalPosList2];

    roadRef1.current!.traverse(
      (obj: THREE.Object3D<THREE.Object3DEventMap>) => {
        if (obj instanceof THREE.Mesh) {
          obj.receiveShadow = true;
          const material = obj.material as THREE.MeshStandardMaterial;
          const toonMaterial = getToonMaterialRoad(material, gl);
          obj.material = toonMaterial;
          obj.frustumCulled = false;
        }
      }
    );

    return () => {
      originPosList!.current = [];
      roadPosList!.current = [];
    };
  }, []);

  useFrame(() => {
    //return;
    if (!isRunning) return;
    //make sure the original position array is filled with values
    if (!originPosList.current[0]) return;

    roadPosList.current!.forEach((item, i) => {
      //check if the block is behind the camera
      item.getWorldPosition(worldP.current);
      if (worldP.current.z > camera.position.z) {
        // 创建门时应停止路块动画
        if (i % roadCount.current === 0 && doorCreated) {
          setRunning(false);
          createDoor(worldP.current.z);
        }
        // 把路块放到后面
        const zOffset = new THREE.Vector3(0, 0, doubleZLength * 10);
        item.position.sub(zOffset);
        try {
          originPosList.current[i].sub(zOffset);
        } catch (error) {
          console.error(error);
        }

        const tartgetPosition = originPosList.current[i].clone();
        //this.originPosList[i].sub(zOffset);
        // 让路块从下面浮起来
        //const originPos = this.originPosList[i].clone();
        item.position.add(new THREE.Vector3(0, -70 * 10, 0));
        gsap.to(item.position, {
          x: tartgetPosition.x,
          y: tartgetPosition.y,
          z: tartgetPosition.z,
          duration: 2,
          ease: "back.out",
        });
      }
    });
  });

  //door part

  useEffect(() => {
    if (!doorCreated && doorAlreadyCreated.current) {
      destroyDoor();
    }
  }, [doorCreated]);

  useEffect(() => {
    if (doorOpened) openDoor();
  }, [doorOpened]);

  const createDoor = (z: number) => {
    if (!doorLoaded.current) {
      doorModel.scene.traverse(
        (obj: THREE.Object3D<THREE.Object3DEventMap>) => {
          if (obj instanceof THREE.Mesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            const material = obj.material as THREE.MeshStandardMaterial;
            const toonMaterial = getToonMaterialDoor(material);
            obj.material = toonMaterial;
            obj.frustumCulled = false;
          }
        }
      );
      doorModel.scene.scale.set(0.1, 0.1, 0.04);
      doorModel.scene.position.copy(
        new THREE.Vector3(0, -offset.y, z - zLength - 150)
      );
      totalScene.add(doorModel.scene);
      for (const clip of Object.values(doorModel.animations)) {
        /* action.setLoop(THREE.LoopOnce, 1);
        action.play(); */
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce, 1);
        action.time = 0;
        action.clampWhenFinished = true; // Optional: Stop the animation on the last frame
        action.play();
      }
      doorLoaded.current = true;
    } else {
      doorModel.scene.position.copy(
        new THREE.Vector3(0, -offset.y, z - zLength - 150)
      );
      doorModel.scene.visible = true;
    }

    doorAction(1.25, () => {
      document.querySelector(".enter-bg")?.classList.remove("hidden");
    });
  };

  const destroyDoor = () => {
    doorActionBackwards();
    document.querySelector(".enter-bg")?.classList.add("hidden");
  };

  const openDoor = () => {
    //create the white plane bejind the door
    createWhitePlane();
    const duration = doorModel.animations[0].duration;
    doorAction(duration);

    setTimeout(() => {
      setDiveIn();
      void playDiveIn();
      document.querySelector(".enter-bg")?.classList.add("hidden");
      document.querySelector(".menu")?.classList.add("hidden");
    }, (duration * 1000) / 2);
  };

  //function to compute the animation for the entire input duration
  const doorAction = (duration: number, cb?: () => void) => {
    void playCreateDoor();
    let animationId = 0;
    const action = mixer.clipAction(doorModel.animations[0]);
    //const duration = doorModel.animations[0].duration;
    let lasttime = 0;
    const animate = (timestamp: number) => {
      //get the current animation time
      const currentTime = action.time;

      let delta;
      if (lasttime === 0) delta = 0;
      else delta = timestamp - lasttime;
      lasttime = timestamp;

      mixer.update(delta / 1000 / 2);

      if (currentTime >= duration) {
        doorAlreadyCreated.current = true;
        cancelAnimationFrame(animationId);
        if (cb) cb();
      } else requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    //cancelAnimationFrame(id);
  };

  const doorActionBackwards = () => {
    void playCreateDoor();
    let animationId = 0;
    const action = mixer.clipAction(doorModel.animations[0]);
    //const duration = doorModel.animations[0].duration;
    let lasttime = 0;
    const animate = (timestamp: number) => {
      //get the current animation time
      const currentTime = action.time;

      let delta;
      if (lasttime === 0) delta = 0;
      else delta = timestamp - lasttime;
      lasttime = timestamp;

      mixer.update(-delta / 1000 / 2);

      if (currentTime <= 0.1) {
        doorAlreadyCreated.current = false;
        doorModel.scene.visible = false;
        setRunning(true);
        cancelAnimationFrame(animationId);
      } else requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    //cancelAnimationFrame(id);
  };

  const createWhitePlane = () => {
    planeModel.scene.scale.setScalar(0.1);
    const offset = new THREE.Vector3(
      doorModel.scene.position.x,
      doorModel.scene.position.y,
      doorModel.scene.position.z
    );
    planeModel.scene.position.copy(offset);

    planeModel.scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (obj instanceof THREE.Mesh) {
        const material = obj.material as THREE.MeshStandardMaterial;
        material.color = new THREE.Color("#ffffff").multiplyScalar(3);
        obj.frustumCulled = false;
      }
    });

    totalScene.add(planeModel.scene);
  };

  return (
    <>
      <group
        {...props}
        dispose={null}
        position={[0, -34, -200]}
        scale={1 / scale}
        ref={roadRef1}
      >
        {/* the world.position.z = current.local.position.z / 10 - 200  */}
        <group position={[-152.504, 0, 188.808]}>
          <mesh
            geometry={nodes.SM_MERGED517.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED517_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[183.436, 0, 2072.184]}>
          <mesh
            geometry={nodes.SM_MERGED518.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED518_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-70.568, 0, 1912.992]}>
          <mesh
            geometry={nodes.SM_MERGED519.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED519_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-138.458, 0, 1607.485]}>
          <mesh
            geometry={nodes.SM_MERGED520.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED520_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[134.274, 0, 1779.552]}>
          <mesh
            geometry={nodes.SM_MERGED521.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED521_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-129.094, 0, 1244.622]}>
          <mesh
            geometry={nodes.SM_MERGED522.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED522_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[133.103, 0, 1437.759]}>
          <mesh
            geometry={nodes.SM_MERGED523.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED523_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-235.612, 0, 845.473]}>
          <mesh
            geometry={nodes.SM_MERGED524.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED524_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[206.847, 0, 1032.757]}>
          <mesh
            geometry={nodes.SM_MERGED525.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED525_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-142.601, 0, 660.646]}>
          <mesh
            geometry={nodes.SM_MERGED526.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED526_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[82.905, 0, 400.516]}>
          <mesh
            geometry={nodes.SM_MERGED527.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED527_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-71.739, 0, 2244.25]}>
          <mesh
            geometry={nodes.SM_MERGED528.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED528_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
      </group>
      <group
        {...props}
        dispose={null}
        position={[0, -34, -200 - 212.4027]}
        scale={0.1}
        ref={roadRef2}
      >
        <group position={[-152.504, 0, 188.808]}>
          <mesh
            geometry={nodes.SM_MERGED517.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED517_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[183.436, 0, 2072.184]}>
          <mesh
            geometry={nodes.SM_MERGED518.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED518_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-70.568, 0, 1912.992]}>
          <mesh
            geometry={nodes.SM_MERGED519.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED519_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-138.458, 0, 1607.485]}>
          <mesh
            geometry={nodes.SM_MERGED520.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED520_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[134.274, 0, 1779.552]}>
          <mesh
            geometry={nodes.SM_MERGED521.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED521_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-129.094, 0, 1244.622]}>
          <mesh
            geometry={nodes.SM_MERGED522.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED522_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[133.103, 0, 1437.759]}>
          <mesh
            geometry={nodes.SM_MERGED523.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED523_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-235.612, 0, 845.473]}>
          <mesh
            geometry={nodes.SM_MERGED524.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED524_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[206.847, 0, 1032.757]}>
          <mesh
            geometry={nodes.SM_MERGED525.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED525_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-142.601, 0, 660.646]}>
          <mesh
            geometry={nodes.SM_MERGED526.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED526_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[82.905, 0, 400.516]}>
          <mesh
            geometry={nodes.SM_MERGED527.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED527_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-71.739, 0, 2244.25]}>
          <mesh
            geometry={nodes.SM_MERGED528.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED528_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/models/SM_Road.glb");
