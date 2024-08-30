import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import GradientBackground from "./components/GradientBackground";
import Cloud from "./components/Cloud";
import StarParticles from "./components/StarParticles";
import PolarLight from "./components/PolarLight";
import BigCloud from "./components/BigCloud";
import HashFog from "./components/HashFog";
import Column from "./components/Column";
import CameraFoward from "./CameraFoward";
import Road from "./components/Road";

const GenshinExperience = () => {
  const { camera } = useThree();
  const cameraControl = useRef<CameraControls>(null);
  CameraFoward({ ref: cameraControl });

  const drRef = useRef<THREE.DirectionalLight>(null);

  const intensitydr = 61;
  const intensityab = 18;

  const color = "#b7cfff";
  const colordr = "#ffd9b6";

  useEffect(() => {
    if (!drRef.current) return;

    const originPos = new THREE.Vector3(10000, 0, 6000);
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35;

    drRef.current.position.copy(camera.position.clone().add(originPos));

    void cameraControl.current!.setTarget(0, 10, -5000, false);
  }, []);

  return (
    <>
      <CameraControls ref={cameraControl}></CameraControls>
      {/* <Model></Model> */}
      <Road></Road>
      <Column></Column>
      <GradientBackground></GradientBackground>
      <Cloud></Cloud>
      <BigCloud></BigCloud>
      <StarParticles></StarParticles>
      <PolarLight></PolarLight>
      <HashFog></HashFog>
      <directionalLight
        ref={drRef}
        color={colordr}
        shadow-camera-top={400}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
        shadow-camera-right={400}
        shadow-camera-near={0.5}
        shadow-camera-far={10000}
        shadow-bias={-0.00005}
        intensity={intensitydr}
        castShadow
      ></directionalLight>
      <ambientLight color={color} intensity={intensityab}></ambientLight>
    </>
  );
};

export default GenshinExperience;
