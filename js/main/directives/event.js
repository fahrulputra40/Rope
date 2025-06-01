import { directive } from "../directive";
import { evaluateLater } from "../evaluator";
import { initializeIfDirective } from "./if";

export const EVENT_KEY = "__EVENT_STATUS";
export const EVENT_LOADING = 0b00000001;
export const EVENT_ERROR = 0b00000010;
export const EVENT_SHOW = 0b00000100;
export const EVENT_TOAST_SUCCESS = 0b00001000;
export const EVENT_TOAST_ERROR = 0b00010000;

let evaluators = {};

directive("event", (el, {modifiers}, { effect, cleanup }) => {
  if (modifiers.length == 0) {
    console.warn("Bind event directive failed");
    return;
  }

  let evaluator;
  if (modifiers[0] == "loading") {
    if (!evaluators[EVENT_LOADING]) {
      evaluator = evaluateLater(el, `(${EVENT_KEY} & ${EVENT_LOADING}) > 0`);
      evaluators[EVENT_LOADING] = evaluator;
    } else {
      evaluator = evaluators[EVENT_LOADING];
    }
  } else if (modifiers[0] == "show") {
    if (!evaluators[EVENT_SHOW]) {
      evaluator = evaluateLater(el, `(${EVENT_KEY} & ${EVENT_SHOW}) > 0`);
      evaluators[EVENT_SHOW] = evaluator;
    } else {
      evaluator = evaluators[EVENT_SHOW];
    }
  } else if (modifiers[0] == "error") {
    if (!evaluators[EVENT_ERROR]) {
      evaluator = evaluateLater(el, `(${EVENT_KEY} & ${EVENT_ERROR}) > 0`);
      evaluators[EVENT_ERROR] = evaluator;
    } else {
      evaluator = evaluators[EVENT_ERROR];
    }
  } else if (modifiers[0] == "toast-success") {
    if (!evaluators[EVENT_TOAST_SUCCESS]) {
      evaluator = evaluateLater(
        el,
        `(${EVENT_KEY} & ${EVENT_TOAST_SUCCESS}) > 0`
      );
      evaluators[EVENT_TOAST_SUCCESS] = evaluator;
    } else {
      evaluator = evaluators[EVENT_TOAST_SUCCESS];
    }
  } else if (modifiers[0] == "toast-error") {
    if (!evaluators[EVENT_TOAST_ERROR]) {
      evaluator = evaluateLater(el, `(${EVENT_KEY} & ${EVENT_TOAST_ERROR}) > 0`);
      evaluators[EVENT_TOAST_ERROR] = evaluator;
    } else {
      evaluator = evaluators[EVENT_TOAST_ERROR];
    }
  } else {
    console.warn(`Unknown directive ${modifiers[0]}`);
    return;
  }

  const { show, hide } = initializeIfDirective(el);
  effect(() =>
    evaluator((value) => {
      value ? show() : hide();
    })
  );

  cleanup(() => el._x_undoIf && el._x_undoIf());
});
