import { directive } from "../directive";
import { evaluateLater } from "../evaluator";
import { closestNodeDataStack } from "../nodescope";

directive("if", (el, { expression, modifiers }, { effect, cleanup }) => {
  let evaluate = evaluateLater(el, expression);

  const {show, hide} = initializeIfDirective(el)
  effect(() =>
    evaluate((value) => {
      value ? show() : hide();
    })
  );

  cleanup(() => el._x_undoIf && el._x_undoIf());
});

export function initializeIfDirective(el, commentName = "IF-BLOCK") {
  const node = closestNodeDataStack(el);
  let comment = document.createComment(commentName);
  comment._x_element = el;
  el.x_comment = comment;
  el.x_show = true;
  el.x_node = node;
  el._x_undoIf = () => {
    el.x_show = false;
    el.x_node.insertBefore(el.x_comment, el);
    el.x_node.removeChild(el);
  };

  let show = () => {
    if (el.x_show) return;
    el.x_show = true;
    el.x_node.insertBefore(el, el.x_comment);
    el.x_node.removeChild(el.x_comment);
  };

  let hide = () => {
    if (!el.x_show) return;
    el._x_undoIf();
  };

  return {show, hide}
}
