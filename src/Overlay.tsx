import { useEffect, useRef } from "react";
import useStore from "./store";
import { playDuang } from "./utils";

const Overlay = () => {
  const bgmStarted = useStore((state) => state.bgmStarted);
  const toggleDoor = useStore((state) => state.toggleDoor);
  const setDoorOpen = useStore((state) => state.setDoorOpen);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      void audioRef.current.play();
    }
  };

  const openDoor = () => {
    //should update the global door state
    void playDuang();
    toggleDoor();
  };

  const diveIn = () => {
    setDoorOpen();
  };

  useEffect(() => {
    if (bgmStarted) handlePlay();
  }, [bgmStarted]);

  return (
    <>
      <audio ref={audioRef} src="/audios/bgm.mp3" loop />
      <div className="menu hidden">
        <div className=" absolute bottom-[16%] right-[4%] ">
          <div className="flex flex-col items-center space-y-3">
            <div className="width-[7vmin] height-[7vmin]">
              <img
                src="/images/ClickMe.png"
                className="w-full h-full block"
                alt=""
                onClick={openDoor}
              />
            </div>
          </div>
        </div>
        <div className=" absolute bottom-[1%] left-[1%] w-[75vmin] text-[0.4rem] pointer-events-none ">
          {" "}
          <div className="">
            <p>免责声明：</p>
            <p>
              本网站是一个纯粹的技术示例，旨在展示和分享我们的技术能力。网站的设计和内容受到《原神》的启发，并尽可能地复制了《原神》的登录界面。我们对此表示敬意，并强调这个项目不是官方的《原神》产品，也没有与《原神》或其母公司miHoYo有任何关联。
            </p>
            <p>
              我们没有，也无意从这个项目中获得任何经济利益。这个网站的所有内容仅供学习和研究目的，以便让更多的人了解和熟悉webgl开发技术。
            </p>
            <p>
              如果miHoYo或任何有关方面认为这个项目侵犯了他们的权益，请联系我们，我们会立即采取行动。
            </p>
          </div>
        </div>
      </div>
      <div
        className="enter-bg absolute hidden"
        style={{ bottom: "4vmin", left: "2%", width: "96%" }}
      >
        <div
          className="flex-center flex"
          style={{
            height: "6vh",
            background:
              "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.482) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <img
            onClick={diveIn}
            src="/images/Entry.png"
            className="enter-entry block m-auto"
            style={{ height: "4vh" }}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Overlay;
