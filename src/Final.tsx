import { useMemo } from "react";
import { getStory } from "@/data/story";

const Final = () => {
  const story = useMemo(() => {
    return getStory();
  }, []);

  return (
    <div className="final">
      <div className="flex justify-center items-center h-svh">
        <div className="block text-center overflow-y-auto  max-h-svh">
          <p> {story.title + "," + story.content} </p>
        </div>
      </div>
    </div>
  );
};

export default Final;
