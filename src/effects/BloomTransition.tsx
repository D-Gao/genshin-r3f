import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { BloomTransitionEffect } from "./BloomTransitionEffect";
import { Effect } from "postprocessing";
import useStore from "../store";
import gsap from "gsap";

interface Props {
  intensity?: number;
  whiteAlpha?: number;
}

const BloomTransition = (props: Props, ref: React.Ref<Effect>) => {
  const effect = useMemo(() => {
    return new BloomTransitionEffect(props);
  }, [props]);

  const diveIn = useStore((state) => state.diveIn);
  const reset = useStore((state) => state.reset);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline());

  useEffect(() => {
    const bloomInTransition = () => {
      const params: Props = { ...props };
      tl.current.clear();
      tl.current.to(params, {
        whiteAlpha: 1,
        intensity: 0.3,
        duration: 1,
        onUpdate: () => {
          effect.uniforms.get("uIntensity")!.value = params.intensity;
          effect.uniforms.get("uWhiteAlpha")!.value = params.whiteAlpha;
        },
        onComplete: () => {
          /* effect.uniforms.get("uIntensity")!.value = 0;
          effect.uniforms.get("uWhiteAlpha")!.value = 0; */
          reset();
          window.location.replace("/final");
        },
      });
    };
    if (diveIn) bloomInTransition();

    return () => {};
  }, [diveIn]);

  return <primitive ref={ref} object={effect}></primitive>;
};

export default forwardRef(BloomTransition);
