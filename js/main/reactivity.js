import { scheduler } from "./scheduler";

let reactive, effect, release, raw;
let shouldSchedule = true;

export function initEngine(engine) {
  reactive = engine.reactive;
  effect = (callback) => {
    engine.effect(callback, {
      scheduler: () => {
        if (shouldSchedule) {
          scheduler(callback);
        } else {
          callback();
        }
      },
    });
  };
  raw = engine.toRaw;
  release = engine.stop;
}

export function elementBindEffect(el) {
  let cleanUp = () => {};
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanUp = () => {
      if (effectReference === undefined) return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };

    return effectReference;
  };

  return [wrappedEffect, cleanUp];
}

export { reactive, effect, release, raw };
