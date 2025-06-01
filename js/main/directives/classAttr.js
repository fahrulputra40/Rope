import { effect } from "@vue/reactivity";
import { directive } from "../directive";
import { evaluateLater } from "../evaluator";

directive("class", (el, { expression, modifiers }, { cleanup }) => {
  const evaluate = evaluateLater(el, expression);

  if (modifiers.length == 0) {
    console.warn("Bind class directive failed");
    return;
  }

  effect(() => {
    evaluate((value) =>
      value ? el.classList.add(...modifiers) : el.classList.remove(...modifiers)
    );
  });
});
