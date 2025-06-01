import { reactive } from "@vue/reactivity";
import { directive, prefix } from "../directive";
import { evaluate } from "../evaluator";
import { addRootSelector } from "../lifecyrcle";
import { addScopeToNode, addScopeToSnapshot } from "../nodescope";
import { EVENT_KEY, EVENT_SHOW } from "./event";
// import { reactive } from "../reactivity";

addRootSelector(() => `[${prefix("snapshot")}]`);

// hydrate data
directive("snapshot", (el, { expression, name }, { cleanup }) => {
  expression = expression === "" ? "{}" : expression;

  expression = evaluate(el, expression);

  const undoSnapshot = addScopeToSnapshot(el, expression);
  expression = { ...expression };
  const reactiveData = reactive(
    el.hasAttribute("rope:data")
      ? expression
      : { ...expression, [EVENT_KEY]: EVENT_SHOW }
  );
  const undo = addScopeToNode(el, reactiveData, name);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
    undoSnapshot();
  });
});

// reactive data
directive("data", (el, { expression, name }, { cleanup }) => {
  expression = expression === "" ? "{}" : expression;
  expression = evaluate(el, expression);

  const reactiveData = reactive({
    ...expression,
    [EVENT_KEY]: EVENT_SHOW
  });
  const undo = addScopeToNode(el, reactiveData, name);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
});
