import { directive } from "../directive";
import { updateRequestHandler } from "../utils/update";

directive("dispatch", (el, {value, expression}, { cleanup }) => {
  const handler = updateRequestHandler(el, value, expression);
  el.addEventListener("click", handler);
  cleanup(() => el.removeEventListener("click", handler));
});
