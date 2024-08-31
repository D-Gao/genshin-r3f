import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import useStore from "./store";

const params = {
  speed: 1,
};
const CameraFoward = ({ ref }: { ref: React.RefObject<CameraControls> }) => {
  const { camera } = useThree();
  const isRunning = useStore((state) => state.isRunning);
  const setRunning = useStore((state) => state.setRunning);
  const diveIn = useStore((state) => state.diveIn);

  const center = useRef(new THREE.Vector3(0, 10, 10));
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5));
  //the default is true
  const prevRunningState = useRef(true);

  useEffect(() => {
    console.log("isruuning in camear foward:", isRunning);
  }, [isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause or stop data updates
        prevRunningState.current = isRunning;
        setRunning(false);
      } else {
        // Resume data updates
        setTimeout(() => {
          setRunning(prevRunningState.current);
        }, 10);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning, setRunning]);

  useEffect(() => {
    if (diveIn) diveInAction();
  }, [diveIn]);

  const diveInAction = () => {
    const originPos = camera.position.clone();
    ref.current!.smoothTime = 0.3;
    void ref.current!.setPosition(
      originPos.x,
      originPos.y,
      originPos.z - 400,
      true
    );
    const curTarget = ref.current!.getTarget(new THREE.Vector3());
    void ref.current!.setTarget(0, 10, curTarget.z - 500, true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((_, delta) => {
    if (!isRunning || !ref.current) {
      return;
    }
    console.log("useframe update");

    center.current.add(new THREE.Vector3(0, 0, -params.speed * delta * 100));
    cameraTarget.current.add(
      new THREE.Vector3(0, 0, -params.speed * delta * 100)
    );

    void ref.current!.setPosition(...center.current.clone().toArray(), true);
    void ref.current!.setTarget(
      ...cameraTarget.current.clone().toArray(),
      true
    );
  });

  return {};
};

export default CameraFoward;
