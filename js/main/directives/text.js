import { directive } from "../directive";
import { evaluateLater } from "../evaluator";

directive("text", (el, { expression }, { effect }) => {
  let evaluate = evaluateLater(el, expression);
  effect(() => {
    evaluate((value) => {
      el.textContent = value;
    });
  });
});
