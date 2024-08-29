import bloomTransitionFragmentShader from "../shaders/bloom/frag.glsl";
import * as THREE from "three";
import { Effect } from "postprocessing";

export class BloomTransitionEffect extends Effect {
  constructor({ intensity = 0, whiteAlpha = 0 } = {}) {
    super("BloomTranstionEffect", bloomTransitionFragmentShader, {
      uniforms: new Map([
        ["uIntensity", new THREE.Uniform(intensity)],
        ["uWhiteAlpha", new THREE.Uniform(whiteAlpha)],
      ]),
    });
  }
}
