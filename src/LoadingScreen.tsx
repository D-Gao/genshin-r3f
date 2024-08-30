import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import useStore from "./store";
import { playDuang } from "./utils";

import { StoreState } from "./store";

const LoadingScreen = () => {
  const { progress } = useProgress();

  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startBgm = useStore((state: StoreState) => state.startBgm);

  /* console.log(progress); */
  useEffect(() => {
    if (progress == 100) setReady(true);
  }, [progress]);

  const startGame = async () => {
    await playDuang();

    //should fadeout the loading screen and start the bgm
    ref.current!.style.opacity = "0";
    ref.current!.style.transition = "opacity 2s ease-in";
    ref.current!.style.pointerEvents = "none";
    startBgm();
    document.querySelector(".menu")?.classList.remove("hidden");
  };

  return (
    <>
      <div
        ref={ref}
        className={` loader-screen  fixed z-10 inset-0 bg-white transition-opacity duration-1000 opacity-100
 `}
        style={{ willChange: "opacity " }}
      >
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <img
            src="/images/Genshin.png"
            style={{
              width: `45vmin`,
            }}
            className="title block"
            alt=""
          />
        </div>
        <div
          className="absolute flex justify-center left-[50%] top-[71%] translate-x-[-50%] translate-y-[-50%]"
          style={{
            width: `41vmin`,
          }}
        >
          {ready ? (
            <button
              className="loadingScreen__button"
              onClick={() => void startGame()}
            >
              启动
            </button>
          ) : (
            <progress
              className="loader-progress progress-bar transition-all ease-in-out duration-300 "
              style={{
                height: "0.375rem",
              }}
              value={progress}
              max="100"
              dir="ltr"
            ></progress>
          )}
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
