import { isCloning } from "../clone";
import { directive } from "../directive";
import { evaluateLater } from "../evaluator";
import { closestDataStack, closestNodeDataStack } from "../nodescope";
import on from "./on";

directive("model", (el, { modifiers, expression }, { effect, cleanup }) => {
  let evaluateGet = evaluateLater(el, expression);
  let evaluateSet = evaluateLater(el, `${expression} = __placeholder`);

  let getValue = () => {
    let result;

    evaluateGet((value) => (result = value));

    return isGetterSetter(result) ? result.get() : result;
  };

  let setValue = (value) => {
    let result;

    evaluateGet((value) => (result = value));

    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {}, {
        scope: { __placeholder: value },
      });
    }
  };

  var event =
    el.tagName.toLowerCase() === "select" ||
    ["checkbox", "radio"].includes(el.type) ||
    modifiers.includes("lazy")
      ? "change"
      : "input";

  let removeListener = isCloning
    ? () => {}
    : on(el, [event, ...modifiers], (e) => {
        setValue(getInputValue(el, modifiers, e, getValue()));
      });

  if (!el._x_removeModelListeners) el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;

  const stack = closestDataStack(el);
  const target =
    stack.find((obj) =>
      Object.prototype.hasOwnProperty.call(obj, expression)
    ) || 0;
  if (target != 0) {
    el.value = target[expression];
  }
  cleanup(() => el._x_removeModelListeners["default"]());
});

function isGetterSetter(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.get === "function" &&
    typeof value.set === "function"
  );
}

function getInputValue(el, modifiers, event, currentValue) {
  if (event instanceof CustomEvent && event.detail !== undefined)
    return event.detail !== null && event.detail !== undefined
      ? event.detail
      : event.target.value;

  let newValue = event.target.value;

  return newValue;
}
