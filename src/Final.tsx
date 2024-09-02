/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getStory } from "@/data/story";
import { sakuraBase64 } from "./data/sakura";
import { Sakura } from "./data/SakuraClass";

const sakuraNum = 21;
const limitTimes = -1;
const Final: React.FC = () => {
  const story = useMemo(() => {
    return getStory();
  }, []);

  const img = useMemo(() => {
    const img = new Image();
    img.src = sakuraBase64;
    return img;
  }, []);

  /* const [sakuraList, setSakuraList] = useState<Sakura[]>([]); */
  /* const [staticx, setStaticx] = useState(true); */
  const limitArray = useMemo(() => {
    return new Array(sakuraNum).fill(limitTimes);
  }, []);
  const stopRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startSakura = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cxt = canvas.getContext("2d");
    if (!cxt) return;

    const newSakuraList: Sakura[] = [];
    for (let i = 0; i < sakuraNum; i++) {
      const sakura = new Sakura(i);
      sakura.drawSakura(cxt, img);
      newSakuraList.push(sakura);
    }
    //setSakuraList(newSakuraList);

    const animate = () => {
      cxt.clearRect(0, 0, canvas.width, canvas.height);
      newSakuraList.forEach((sakura) => {
        sakura.updateSakura(limitArray);
        sakura.drawSakura(cxt, img);
      });
      stopRef.current = requestAnimationFrame(animate);
    };
    stopRef.current = requestAnimationFrame(animate);
  }, [img, limitArray]);

  /* const stopSakura = () => {
    if (staticx) {
      cancelAnimationFrame(stopRef.current!);
      setStaticx(false);
    } else {
      startSakura();
      setStaticx(true);
    }
  }; */

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const loadImage = async () => {
      try {
        await new Promise((resolve) => {
          img.src = sakuraBase64;
          img.onload = () => {
            startSakura();
            resolve(img);
          };
        });
      } catch (error) {
        console.error("Failed to load the image", error);
      }
    };

    loadImage();

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(stopRef.current!);
      window.removeEventListener("resize", handleResize);
    };
  }, [img]);

  return (
    <div className="final">
      <div className="flex justify-center items-center h-svh">
        <div className="block text-center overflow-y-auto  max-h-svh">
          <p> {story.title} </p>
          <p> {story.content} </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default Final;
