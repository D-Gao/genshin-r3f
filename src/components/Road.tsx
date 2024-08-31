import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEffect, useMemo, useRef } from "react";
import {
  getToonMaterialDoor,
  getToonMaterialRoad,
  playCreateDoor,
  playDiveIn,
} from "../utils";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { GLTFResult as DoorGLTFResult } from "./Door";
import useStore from "../store";
import { StoreState } from "@/store";

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
const offset = new THREE.Vector3(0, 34, 200);
const zLength = 212.4027;
const doubleZLength = 2 * zLength;

const Road = () => {
  const doorLoaded = useRef(false);
  const doorCreated = useStore((state: StoreState) => state.doorCreated);
  const doorOpened = useStore((state: StoreState) => state.doorOpened);
  const setDiveIn = useStore((state: StoreState) => state.setDiveIn);
  const doorAlreadyCreated = useRef(false);
  const setRunning = useStore((state: StoreState) => state.setRunning);
  const isRunning = useStore((state: StoreState) => state.isRunning);
  const { camera } = useThree();

  const { gl, scene: totalScene } = useThree();
  const { scene } = useGLTF("/models/SM_Road.glb") as GLTFResult;

  const doorModel = useGLTF("/models/DOOR.glb") as DoorGLTFResult;

  const planeModel = useGLTF("/models/WHITE_PLANE.glb") as GLTF;

  const mixer = useMemo(
    () => new THREE.AnimationMixer(doorModel.scene),
    [doorModel]
  );

  const originPosList = useRef<THREE.Vector3[]>([]);
  const roadCount = useRef(0);

  useEffect(() => {
    roadCount.current = scene.children.length; // = 12

    scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (obj instanceof THREE.Mesh) {
        obj.receiveShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialRoad(material, gl);
        obj.material = toonMaterial;
        obj.frustumCulled = false;
      }
    });

    scene.children.forEach((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      obj.position.multiplyScalar(0.1);
      obj.scale.multiplyScalar(0.1);
      obj.position.sub(offset);
    });

    // clone the same raod and put them one after another
    for (let i = 0; i < roadCount.current; i++) {
      const cloned = scene.children[i].clone();
      cloned.position.add(new THREE.Vector3(0, 0, -zLength));
      scene.add(cloned);
      //scene.scale.multiplyScalar(0.8);
    }

    totalScene.add(scene);
    scene.children.forEach((item) => {
      originPosList.current.push(item.position.clone());
    });
    return () => {
      // Cleanup function to dispose of the GLTF scene
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          // Dispose of geometry, material, and texture
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              // If the material is an array, dispose of each material in the array
              obj.material.forEach((material) => material.dispose());
            } else {
              // Dispose of the material
              obj.material.dispose();
            }
          }
          scene.remove(obj);
        }
      });

      /*  totalScene.remove(scene); */
    };
  }, []);

  //update the 4
  useFrame(() => {
    if (!isRunning) return;
    //make sure the original position array is filled with values
    if (!originPosList.current[0]) return;

    scene.children.forEach((item, i) => {
      //check if the block is behind the camera
      if (item.position.z > camera.position.z + 0) {
        // 创建门时应停止路块动画
        if (i % roadCount.current === 0 && doorCreated) {
          setRunning(false);
          createDoor(item.position.z);
        }
        // 把路块放到后面
        const zOffset = new THREE.Vector3(0, 0, doubleZLength);
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
        item.position.add(new THREE.Vector3(0, -70, 0));
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

  useEffect(() => {
    if (!doorCreated && doorAlreadyCreated.current) {
      console.log("destroy door!!!");
      destroyDoor();
    }
  }, [doorCreated]);

  useEffect(() => {
    if (doorOpened) openDoor();
  }, [doorOpened]);

  useEffect(() => {
    console.log("isrunnning state", isRunning);
  }, [isRunning]);

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
      console.log(doorModel.animations);
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

    console.log("creating doors");

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

      console.log(delta);

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
      <mesh></mesh>
    </>
  );
};

export default Road;
